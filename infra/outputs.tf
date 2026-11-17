output "vm_address" {
  description = "The VM's static external address, for DNS records and the deploy secrets."
  value       = google_compute_address.vm.address
}

output "uptime_checks" {
  description = "Each site's uptime check id."
  value       = { for key, check in google_monitoring_uptime_check_config.site : key => check.uptime_check_id }
}
