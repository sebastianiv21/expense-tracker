terraform {
  required_version = ">= 1.11.0, < 2.0.0"

  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = "0.13.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.8"
    }
  }
}

provider "neon" {
  api_key = var.neon_api_key
}
