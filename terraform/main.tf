terraform {
  cloud {
    organization = "vyse"

    workspaces {
      name = "poneglyph-prod"
    }
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.30.0"
    }
  }

  required_version = "1.14.9"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

data "google_project" "current" {
  project_id = var.project_id
}
