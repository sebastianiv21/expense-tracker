output "database_uri" {
  description = "The neon db connection string"
  value       = module.db.database_uri
  sensitive   = true
}
