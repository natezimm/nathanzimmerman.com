variable "project_id" {
  description = "The GCP project that holds the VM."
  type        = string
}

variable "region" {
  description = "Region of the VM and its static address."
  type        = string
  default     = "us-east1"
}

variable "zone" {
  description = "Zone of the VM."
  type        = string
}

variable "vm_name" {
  description = "Name of the VM every app runs on."
  type        = string
}

variable "machine_type" {
  description = "The VM's machine type. Changing it stops and starts the VM."
  type        = string
  default     = "e2-small"
}

variable "address_name" {
  description = "Name of the VM's reserved static external address."
  type        = string
}

variable "alert_email" {
  description = "Where alerts are emailed. Kept in terraform.tfvars, which is not committed."
  type        = string
  sensitive   = true
}

variable "sites" {
  description = <<-EOT
    Every site to watch from outside, by a short key. host is the domain, path what to fetch.
    healthy_contains, when set, adds a second check that the answer contains this text, alerting
    when it has not for 15 minutes (Wheelhouse's "calendar":"Healthy" in /health).
    slo is the share of five-minute windows the site must answer in over 28 days; null for none.
  EOT
  type = map(object({
    name             = string
    host             = string
    path             = optional(string, "/")
    healthy_contains = optional(string)
    slo              = optional(number)
    runbook          = optional(string)
  }))
}
