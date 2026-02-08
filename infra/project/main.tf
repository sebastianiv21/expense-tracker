resource "neon_project" "main" {
  name                      = var.project_name
  org_id                    = var.neon_org_id
  history_retention_seconds = 21600

  branch {
    name          = var.production_branch
    database_name = "intent_db"
    role_name     = "intent_owner"
  }

  default_endpoint_settings {
    autoscaling_limit_max_cu = 0.25
  }
}

resource "cloudflare_pages_project" "web" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch

  source = {
    type = "github"
    config = {
      owner                          = var.github_owner
      repo_name                      = var.github_repo
      production_branch              = var.production_branch
      pr_comments_enabled            = true
      path_excludes                  = ["apps/api", "infra"]
      production_deployments_enabled = true
    }
  }

  build_config = {
    build_command   = "pnpm build --filter=web"
    destination_dir = "apps/web/dist"
    root_dir        = "/"
  }

  deployment_configs = {
    production = {
      compatibility_date = "2025-09-27"
      env_vars = {
        NEXT_PUBLIC_API_URL = {
          type  = "plain_text"
          value = var.api_url
        }
      }
    },
    preview = {
      compatibility_date = "2025-09-27"
    }
  }
}
