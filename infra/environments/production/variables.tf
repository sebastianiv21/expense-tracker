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

# Project variables
variable "environment" {
  description = "Environment name (dev, preview, production)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "preview", "production"], var.environment)
    error_message = "Environment must be dev, preview, or production"
  }
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

variable "project_name" {
  description = "The name of the project"
  type        = string
}
