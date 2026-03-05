variable "location" {
  type        = string
  description = "Azure region"
  default     = "swedencentral"
}

variable "prefix" {
  type        = string
  description = "Project prefix used in resource names"
  default     = "prfx"
}

variable "env" {
  type        = string
  description = "Environment tag"
  default     = "dev"
}
