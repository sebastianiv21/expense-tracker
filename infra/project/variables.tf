variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "domain" {
  description = "Custom domain for production"
  type        = string
  default     = "" # Empty for dev/preview (use default workers.dev domains)
}

variable "api_url" {
  description = "API URL for production"
  type        = string
}

variable "production_branch" {
  description = "Production branch name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "github_owner" {
  description = "Github repository owner"
  type        = string
}

# Cloudflare
variable "cloudflare_api_token" {
  description = "Cloudflare API token for authentication"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for the domain"
  type        = string
  sensitive   = true
}

# Neon
variable "neon_api_key" {
  description = "Neon API key for database management"
  type        = string
  sensitive   = true
}

variable "neon_org_id" {
  description = "Neon Organization ID"
  type        = string
  sensitive   = true
}
