module "db" {
  source             = "../../modules/neon"
  branch_name        = var.environment
  neon_database_name = var.neon_database_name
  org_id             = var.neon_org_id
  project_id         = var.neon_project_id
}
