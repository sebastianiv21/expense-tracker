output "project_id" {
  value = neon_project.main.id
}

output "project_connection_uri" {
  description = "Default connection URI for the primary branch (contains credentials)."
  value       = neon_project.main.connection_uri
  sensitive   = true
}

output "project_connection_uri_pooler" {
  description = "Default connection URI pooler for the primary branch (contains credentials)."
  value       = neon_project.main.connection_uri_pooler
  sensitive   = true
}

output "project_default_branch_id" {
  value = neon_project.main.default_branch_id
}

output "project_database_user" {
  value = neon_project.main.database_user
}

output "pages_project_name" {
  description = "The name of the Cloudflare Pages project"
  value       = cloudflare_pages_project.web.name
}
