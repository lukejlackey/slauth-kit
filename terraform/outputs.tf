output "cluster_name" {
  value = aws_ecs_cluster.slauth_cluster.name
}

output "service_name" {
  value = aws_ecs_service.slauth_service.name
}

output "container_image" {
  value = var.container_image
}

output "api_endpoint_info" {
  value       = "Find your API's public IP under ECS → slauth-cluster → slauth-api-service → Task → Networking"
  description = "This is the free way to access your API without a Load Balancer"
}