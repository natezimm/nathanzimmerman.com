# Uptime checks from outside the VM, so they still fire when the whole machine is gone, with an alert
# for each site being down and its certificate running out, and an SLO with a burn-rate alert where a
# site sets one. Cloud Monitoring's uptime checks and alerts are free at this size.

resource "google_project_service" "monitoring" {
  service            = "monitoring.googleapis.com"
  disable_on_destroy = false
}

resource "google_monitoring_notification_channel" "email" {
  display_name = "Portfolio alerts"
  type         = "email"
  labels = {
    email_address = var.alert_email
  }
  depends_on = [google_project_service.monitoring]
}

resource "google_monitoring_uptime_check_config" "site" {
  for_each = var.sites

  display_name     = "${each.value.name} up"
  period           = "300s"
  timeout          = "10s"
  checker_type     = "STATIC_IP_CHECKERS"
  selected_regions = ["USA_VIRGINIA", "USA_OREGON", "EUROPE"]

  http_check {
    path         = each.value.path
    port         = 443
    use_ssl      = true
    validate_ssl = true
    accepted_response_status_codes {
      status_class = "STATUS_CLASS_2XX"
    }
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = each.value.host
    }
  }

  depends_on = [google_project_service.monitoring]
}

# A second check of the same address that passes only when the answer holds the site's healthy text.
resource "google_monitoring_uptime_check_config" "healthy" {
  for_each = { for key, site in var.sites : key => site if site.healthy_contains != null }

  display_name     = "${each.value.name} healthy"
  period           = "300s"
  timeout          = "10s"
  checker_type     = "STATIC_IP_CHECKERS"
  selected_regions = ["USA_VIRGINIA", "USA_OREGON", "EUROPE"]

  http_check {
    path         = each.value.path
    port         = 443
    use_ssl      = true
    validate_ssl = true
    accepted_response_status_codes {
      status_class = "STATUS_CLASS_2XX"
    }
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = each.value.host
    }
  }

  content_matchers {
    content = each.value.healthy_contains
    matcher = "CONTAINS_STRING"
  }

  depends_on = [google_project_service.monitoring]
}

resource "google_monitoring_alert_policy" "unhealthy" {
  for_each = google_monitoring_uptime_check_config.healthy

  display_name          = "${var.sites[each.key].name} is not healthy"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.email.id]

  conditions {
    display_name = "answer lacks ${var.sites[each.key].healthy_contains}"
    condition_threshold {
      filter          = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND resource.type=\"uptime_url\" AND metric.label.check_id=\"${each.value.uptime_check_id}\""
      comparison      = "COMPARISON_GT"
      threshold_value = 1
      duration        = "900s"
      trigger {
        count = 1
      }
      aggregations {
        alignment_period     = "1200s"
        per_series_aligner   = "ALIGN_NEXT_OLDER"
        cross_series_reducer = "REDUCE_COUNT_FALSE"
        group_by_fields      = ["resource.label.host"]
      }
    }
  }

  alert_strategy {
    auto_close = "1800s"
  }

  documentation {
    mime_type = "text/markdown"
    content   = "https://${var.sites[each.key].host}${var.sites[each.key].path} answers, but without `${var.sites[each.key].healthy_contains}`, for 15 minutes.${local.runbook[each.key]}"
  }
}

locals {
  check_filter = {
    for key, check in google_monitoring_uptime_check_config.site :
    key => "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND resource.type=\"uptime_url\" AND metric.label.check_id=\"${check.uptime_check_id}\""
  }
  runbook = {
    for key, site in var.sites : key => site.runbook == null ? "" : " See the [runbook](${site.runbook})."
  }
}

# Failing from more than one region for five minutes: one region's bad minute is the network.
resource "google_monitoring_alert_policy" "down" {
  for_each = var.sites

  display_name          = "${each.value.name} is down"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.email.id]

  conditions {
    display_name = "https://${each.value.host}${each.value.path} not answering"
    condition_threshold {
      filter          = local.check_filter[each.key]
      comparison      = "COMPARISON_GT"
      threshold_value = 1
      duration        = "300s"
      trigger {
        count = 1
      }
      aggregations {
        alignment_period     = "1200s"
        per_series_aligner   = "ALIGN_NEXT_OLDER"
        cross_series_reducer = "REDUCE_COUNT_FALSE"
        group_by_fields      = ["resource.label.host"]
      }
    }
  }

  alert_strategy {
    auto_close = "1800s"
  }

  documentation {
    mime_type = "text/markdown"
    content   = "https://${each.value.host}${each.value.path} has not answered from more than one region for 5 minutes.${local.runbook[each.key]}"
  }
}

resource "google_monitoring_alert_policy" "certificate" {
  for_each = var.sites

  display_name          = "${each.value.name} certificate expires soon"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.email.id]

  conditions {
    display_name = "certificate expires in under 14 days"
    condition_threshold {
      filter          = "metric.type=\"monitoring.googleapis.com/uptime_check/time_until_ssl_cert_expires\" AND resource.type=\"uptime_url\" AND metric.label.check_id=\"${google_monitoring_uptime_check_config.site[each.key].uptime_check_id}\""
      comparison      = "COMPARISON_LT"
      threshold_value = 14
      duration        = "600s"
      trigger {
        count = 1
      }
      aggregations {
        alignment_period     = "1200s"
        per_series_aligner   = "ALIGN_NEXT_OLDER"
        cross_series_reducer = "REDUCE_MIN"
        group_by_fields      = ["resource.label.host"]
      }
    }
  }

  alert_strategy {
    auto_close = "1800s"
  }

  documentation {
    mime_type = "text/markdown"
    content   = "The HTTPS certificate for ${each.value.host} expires within 14 days, so certbot's renewal has stopped.${local.runbook[each.key]}"
  }
}

# One custom service per site with an SLO, measured on its uptime check: a five-minute window is good
# when the check passed in it.
resource "google_monitoring_custom_service" "site" {
  for_each = { for key, site in var.sites : key => site if site.slo != null }

  # Service ids allow only lowercase letters, digits and hyphens.
  service_id   = "site-${replace(lower(each.key), "_", "-")}"
  display_name = each.value.name
  depends_on   = [google_project_service.monitoring]
}

resource "google_monitoring_slo" "uptime" {
  for_each = google_monitoring_custom_service.site

  service             = each.value.service_id
  slo_id              = "uptime"
  display_name        = "${var.sites[each.key].name} answers ${format("%g", var.sites[each.key].slo * 100)}% of five-minute windows over 28 days"
  goal                = var.sites[each.key].slo
  rolling_period_days = 28

  windows_based_sli {
    window_period          = "300s"
    good_bad_metric_filter = local.check_filter[each.key]
  }
}

# Burning a month's error budget ten times too fast for an hour: something is wrong now, not just
# a bad evening. The down alert covers short, total outages; this catches a flaky site.
resource "google_monitoring_alert_policy" "burn" {
  for_each = google_monitoring_slo.uptime

  display_name          = "${var.sites[each.key].name} is spending its error budget fast"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.email.id]

  conditions {
    display_name = "burn rate over 10 for an hour"
    condition_threshold {
      filter          = "select_slo_burn_rate(\"${each.value.id}\", \"3600s\")"
      comparison      = "COMPARISON_GT"
      threshold_value = 10
      duration        = "0s"
    }
  }

  alert_strategy {
    auto_close = "86400s"
  }

  documentation {
    mime_type = "text/markdown"
    content   = "Over the last hour ${var.sites[each.key].host} failed its uptime check often enough to use up 28 days of error budget in under 3 days.${local.runbook[each.key]}"
  }
}
