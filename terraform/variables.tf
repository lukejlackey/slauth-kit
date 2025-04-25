variable "aws_region" {
  type    = string
  default = "us-west-1"
}

variable "container_image" {
  type        = string
  description = "Docker image URI for the slauth API"
}