variable "branch_name" {
  description = "The name of the branch to use for the database"
  type        = string
}

variable "project_id" {
  description = "The ID of the Neon project"
  type        = string
}

variable "environment" {
  description = "The environment to use for the database"
  type        = string
}

variable "org_id" {
  description = "The Neon organization ID"
  type        = string
}
