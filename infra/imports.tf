# Adopts what was made by hand in the console. After the first apply these can stay: an import of
# something already in state does nothing.

import {
  to = google_compute_address.vm
  id = "projects/${var.project_id}/regions/${var.region}/addresses/${var.address_name}"
}

import {
  to = google_compute_instance.vm
  id = "projects/${var.project_id}/zones/${var.zone}/instances/${var.vm_name}"
}

import {
  to = google_compute_firewall.http
  id = "projects/${var.project_id}/global/firewalls/default-allow-http"
}

import {
  to = google_compute_firewall.https
  id = "projects/${var.project_id}/global/firewalls/default-allow-https"
}
