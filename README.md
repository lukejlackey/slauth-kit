# 🦥 Slauth-Kit

**Slauth-Kit** is a plug-and-play authentication backend designed for indie devs. It runs in AWS, handles user login with JWT, and uses MongoDB for storage.

## 💡 Features

- Secure signup/login endpoints
- JWT auth with secret from AWS SSM
- MongoDB-backed user storage
- ECS Fargate + Terraform deploy
- Ready for frontend integration (coming soon!)

## 📦 Tech Stack

- C# ASP.NET Core
- MongoDB Atlas
- Docker
- AWS ECS Fargate
- Terraform

## 🚀 Deployment

1. Build & push Docker image to Docker Hub
2. Configure secrets in AWS SSM:
    ```bash
    aws ssm put-parameter --name "/slauth-kit/mongo-uri" --type "SecureString" --value "<uri>"
    aws ssm put-parameter --name "/slauth-kit/jwt-secret" --type "SecureString" --value "<jwt secret>"
    ```
3. Deploy via Terraform:
    ```bash
    terraform init
    terraform apply
    ```

## 🧪 Testing

    ```bash
    curl -X POST http://<public-ip>/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"email": "you@example.com", "password": "secret"}'
    ```