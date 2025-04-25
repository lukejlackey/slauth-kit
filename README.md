# 🦥 Slauth-Kit

**Slauth-Kit** is a plug-and-play authentication backend designed for small devs on tight budgets. It runs in AWS, handles user login with a C# API w/ JWT, and uses MongoDB for storage.

---

## 💡 Features

- 🔐 Secure signup/login endpoints  
- 🪙 JWT auth using AWS SSM secrets  
- 🗄️ MongoDB-backed user storage  
- ☁️ ECS Fargate + Terraform deploy  
- 🧩 Ready for frontend integration (coming soon!)

---

## 📦 Tech Stack

- C# ASP.NET Core  
- MongoDB Atlas  
- Docker  
- AWS ECS Fargate  
- Terraform  
- AWS SSM (Parameter Store)

---

## 🚀 Quick Start (Template Use)

```bash
git clone https://github.com/lukejlackey/slauth-kit.git
cd slauth-kit

# Copy and configure your template variables
cp template-config.example.tfvars terraform.tfvars
nano terraform.tfvars

# Deploy the infrastructure
cd terraform
terraform init
terraform apply
```

---

## 🐳 Build & Push Your API Image

```bash
docker build -t YourDockerHubUsername/slauth-api:latest ./SlauthApi
docker push YourDockerHubUsername/slauth-api:latest
```

---

## 🔐 Create Secrets in AWS SSM

```bash
aws ssm put-parameter   --name "/slauth-kit/jwt-secret"   --type "SecureString"   --value "<your-long-jwt-secret>"

aws ssm put-parameter   --name "/slauth-kit/mongo-uri"   --type "SecureString"   --value "<your-mongodb-uri>"
```

---

## 🧪 Testing Your Live API

### ➕ Signup

```bash
curl -X POST http://<public-ip>/api/auth/signup   -H "Content-Type: application/json"   -d '{"email": "you@example.com", "password": "secret"}'
```

### 🔑 Login

```bash
curl -X POST http://<public-ip>/api/auth/login   -H "Content-Type: application/json"   -d '{"email": "you@example.com", "password": "secret"}'
```

### 👤 Get Current User

```bash
curl http://<public-ip>/api/auth/me   -H "Authorization: Bearer <your-jwt-token>"
```

---

## 🧰 Project Structure

```
slauth-kit/
├── SlauthApi/                      # ASP.NET Core API source
│    ├── Dockerfile                 # Container config
│    └── ...
├── terraform/                      # Infrastructure-as-code
├── template-config.example.tfvars  # Template Terraform vars
├── appsettings.template.json       # Optional config example
├── README.md                       # This file
├── .gitignore                      # Git ignore file
└── slauth-kit.sln                  # Solution file
```

---

## 🪄 Template Use

This project is configured as a [GitHub template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository). Click **“Use this template”** to quickly create your own version.

---

## 📄 License

MIT License. See `LICENSE` for details.
