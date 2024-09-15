terraform {
  backend "s3" {
    bucket         = "three-tier-app-bucket-rsd"
    region         = "ap-southeast-2"
    key            = "three-tier-app/Jenkins-Terraform/terraform.tfstate"
    dynamodb_table = "Lock-Files"
    encrypt        = true
  }
  required_version = ">=0.13.0"
  required_providers {
    aws = {
      version = ">= 2.7.0"
      source  = "hashicorp/aws"
    }
  }
}