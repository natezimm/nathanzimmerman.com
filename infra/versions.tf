terraform {
  required_version = ">= 1.10"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 8.10"
    }
  }

  # State lives in a Cloud Storage bucket named in backend.hcl (not committed):
  #   terraform init -backend-config=backend.hcl
  backend "gcs" {
    prefix = "portfolio"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}
