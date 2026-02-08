terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }
  }
}

data "cloudflare_pages_project" "web" {
  account_id   = var.cloudflare_account_id
  project_name = var.project_name
}

resource "cloudflare_pages_domain" "custom" {
  account_id   = var.cloudflare_account_id
  project_name = data.cloudflare_pages_project.web.name
  name         = var.custom_domain
}

resource "cloudflare_dns_record" "web" {
  zone_id = var.cloudflare_zone_id
  name    = "intent"
  ttl     = 1
  type    = "CNAME"
  content = "${data.cloudflare_pages_project.web.name}.pages.dev"
  proxied = true
}
