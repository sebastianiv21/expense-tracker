variable "neon_project_id" {
  description = "The ID of the Neon project"
  type        = string
}

variable "environment" {
  description = "The environment to use for the database"
  type        = string
}

variable "neon_database_name" {
  description = "The name of the database to use for the application"
  type        = string
}

variable "neon_api_key" {
  description = "Neon API key"
}

variable "neon_org_id" {
  description = "Neon organization ID"
}
