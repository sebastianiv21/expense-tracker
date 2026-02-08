terraform {
  backend "s3" {
    bucket       = "sebastianiv21-terraform-state"
    key          = "intent-expense-tracker/project/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
    encrypt      = true
  }
}
