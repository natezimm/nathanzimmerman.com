# The VM and its address already exist; imports.tf brings them under Terraform without changing them.
# Only what is worth reviewing in a diff is described here, and the rest is left as it is on the VM.

resource "google_compute_address" "vm" {
  name         = var.address_name
  region       = var.region
  address_type = "EXTERNAL"
  network_tier = "PREMIUM"

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_compute_instance" "vm" {
  name         = var.vm_name
  zone         = var.zone
  machine_type = var.machine_type
  tags         = ["http-server", "https-server"]

  # Changing the machine type needs the VM stopped; Terraform may do that, and it starts again after.
  allow_stopping_for_update = true

  # The console sets this on new VMs. Leaving it out reads as a change that replaces the VM.
  key_revocation_action_type = "NONE"

  # The disk was made with the VM; its image and size are left as they are. The console makes boot
  # disks that go with the VM, which is also the provider's default.
  boot_disk {
    auto_delete = true
  }

  network_interface {
    network = "default"
    access_config {
      nat_ip       = google_compute_address.vm.address
      network_tier = "PREMIUM"
    }
  }

  lifecycle {
    prevent_destroy = true
    # Set when the VM was made, or by Google and the console since; none is worth replacing the VM for.
    ignore_changes = [
      boot_disk[0].initialize_params,
      metadata,
      metadata_startup_script,
      labels,
      service_account,
      scheduling,
      network_interface[0].network,
      network_interface[0].subnetwork,
    ]
  }
}

# The console's "Allow HTTP/HTTPS traffic" boxes made these two rules. The host's nginx answers on 80
# (certbot and the redirect to HTTPS) and 443. The default network's own rules cover SSH and stay as
# they are.
resource "google_compute_firewall" "http" {
  name          = "default-allow-http"
  network       = "default"
  direction     = "INGRESS"
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }
}

resource "google_compute_firewall" "https" {
  name          = "default-allow-https"
  network       = "default"
  direction     = "INGRESS"
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["https-server"]

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }
}
