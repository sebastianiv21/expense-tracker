module "web" {
  source = "../../modules/cloudflare"

  cloudflare_zone_id    = var.cloudflare_zone_id
  cloudflare_account_id = var.cloudflare_account_id
  custom_domain         = var.domain
  project_name          = var.project_name
}
