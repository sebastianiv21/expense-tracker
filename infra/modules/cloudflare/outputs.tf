output "pages_domain_name" {
  description = "The domain of the Cloudflare Pages project"
  value       = cloudflare_pages_domain.custom.name
}
