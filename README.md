# 🦥 Slauth-Kit

**Slauth-Kit** is a plug-and-play authentication backend designed for indie devs on tight budgets. It runs in AWS, handles user login with JWT, integrates OAuth providers, and uses MongoDB for storage.

---

## 💡 Features

- 🔐 Secure signup/login endpoints (C# ASP.NET Core)
- 🪙 JWT auth with secret from configuration or AWS SSM
- 🗄️ MongoDB–backed user storage
- 🌐 Pluggable OAuth flows (Google, GitHub, Discord, Microsoft, etc.)
- ☁️ ECS Fargate + Terraform deployment
- 🧩 Ready for frontend integration (React modal package)

---

## 🔧 Configuration

Slauth-Kit uses a **strongly-typed** `SlauthOptions` section in your `appsettings.json` (or via environment variables) for all secrets and endpoints:

```json
{
  "Slauth": {
    "MongoUri": "<your-mongo-connection-string>",
    "JwtSecret": "<your-long-jwt-secret>",
    "OAuthProviders": {
      "google": {
        "ClientId": "<google-client-id>",
        "ClientSecret": "<google-client-secret>"
      },
      "github": {
        "ClientId": "<github-id>",
        "ClientSecret": "<github-secret>"
      },
      // add any of: facebook, twitter, apple, gitlab, linkedin, reddit, amazon, twitch
    }
  }
}
```

> **Environment variables** can override these via `Slauth__MongoUri`, `Slauth__JwtSecret`, or `Slauth__OAuthProviders__{provider}__ClientId`, etc.

---

## 🚀 Running Locally

1. **Configure** your secrets in `appsettings.Development.json`:
   ```bash
   export Slauth__MongoUri="mongodb+srv://..."
   export Slauth__JwtSecret="super-secret-key"
   ```
2. **Build & run** the API:
   ```bash
   cd SlauthApi
   dotnet build
   dotnet run
   ```
3. **Test** HTTP endpoints:
   ```bash
   curl -X POST http://localhost:5000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"you@example.com","password":"Secret123!"}'
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"you@example.com","password":"Secret123!"}'
   ```

---

## 🐳 Docker

```bash
docker build -t slauth-api SlauthApi
docker run -e Slauth__MongoUri="..." -e Slauth__JwtSecret="..." -p 80:80 slauth-api
```

---

## 🐝 Terraform Deployment

1. Copy and edit your Terraform vars:
   ```bash
   cp template-config.example.tfvars terraform.tfvars
   nano terraform.tfvars    # fill in 'mongo_uri', 'jwt_secret', etc.
   ```
2. Deploy:
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

---

## 📦 Frontend Integration

If you’re using the React–Vite modal package, see [frontend/slauth-modal/README.md](frontend/slauth-modal/README.md) for instructions on customizing `baseUrl`, OAuth providers, and theming.

---

## 📄 License

MIT © Luke Lackey
