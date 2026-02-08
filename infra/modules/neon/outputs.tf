output "database_uri" {
  description = "Full PostgreSQL connection string for the API"
  value       = "postgresql://${neon_role.this.name}:${neon_role.this.password}@${neon_endpoint.this.host}/${neon_database.this.name}?sslmode=require"
  sensitive   = true
}

output "database_host" {
  description = "Database hostname"
  value       = neon_endpoint.this.host
}

output "database_user" {
  description = "Database username"
  value       = neon_role.this.name
}

output "database_name" {
  description = "Database name"
  value       = neon_database.this.name
}
