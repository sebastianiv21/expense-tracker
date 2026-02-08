terraform {
  required_version = ">= 1.11.0, < 2.0.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }

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

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "neon" {
  api_key = var.neon_api_key
}
