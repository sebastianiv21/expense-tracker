terraform {
  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = "0.13.0"
    }
  }
}

resource "neon_branch" "this" {
  project_id = var.project_id
  name       = var.branch_name
}

resource "neon_endpoint" "this" {
  project_id = var.project_id
  branch_id  = neon_branch.this.id

  autoscaling_limit_max_cu = 0.25
}

resource "neon_role" "this" {
  project_id = var.project_id
  branch_id  = neon_branch.this.id
  name       = "intent_owner_${var.branch_name}"
}
