# Quick Start: Deploy to Azure App Service

## Fastest Method: Azure Portal

### 1. Create Web App (5 minutes)

1. Go to: https://portal.azure.com
2. **"+ Create a resource"** → Search **"Web App"**
3. **Basics:**
   - **Subscription:** Your subscription
   - **Resource Group:** Create new: `EsusuHub-RG`
   - **Name:** `esusuhub-backend` (must be unique)
   - **Publish:** Code
   - **Runtime stack:** Node 20 LTS (or Node 22)
   - **Operating System:** Linux
   - **Region:** Choose closest to you
   - **App Service Plan:** Create new (Free tier available)
4. **Click "Review + create"** → **"Create"**

### 2. Connect Azure DevOps (2 minutes)

1. **Deployment Center** (left menu)
2. **Source:** Azure Repos
3. **Organization:** Your Azure DevOps org
4. **Project:** EsusuHub
5. **Repository:** EsusuHub_ReactNative
6. **Branch:** main
7. **Click "Save"**

### 3. Set Root Directory (1 minute)

1. **Configuration** → **General settings**
2. **Application settings** → **New application setting:**
   - **Name:** `SCM_REPOSITORY_PATH`
   - **Value:** `backend`
3. **Click "Save"**

### 4. Set Environment Variables (2 minutes)

**Configuration** → **Application settings** → Add:

```
NODE_ENV = production
PORT = 8080
DATABASE_URL = (your Supabase connection string)
JWT_SECRET = (from RAILWAY_VALUES.md)
JWT_REFRESH_SECRET = (from RAILWAY_VALUES.md)
CORS_ORIGIN = *
```

### 5. Configure for Docker (if using Dockerfile)

1. **Configuration** → **General settings**
2. **Enable:** "Always On" (if on paid tier)
3. **Stack settings:**
   - **Stack:** Docker
   - **Docker Compose:** (if using docker-compose)
   - OR use **Deployment Center** → **Settings** → **Docker**

### 6. Deploy (Automatic)

- Push to Azure DevOps: `git push origin main`
- Azure will auto-deploy
- Check **Deployment Center** → **Logs**

### 7. Get URL

- **Overview** → Copy **"Default domain"**
- Test: `curl https://your-app.azurewebsites.net/health`

## Important Notes

⚠️ **Port:** Azure uses port 8080, not 5166. Your code should use `process.env.PORT || 8080`.

⚠️ **Root Directory:** Set `SCM_REPOSITORY_PATH=backend` so Azure knows where your code is.

⚠️ **Docker:** If using Dockerfile, configure Docker deployment in Deployment Center.

## Troubleshooting

**Not deploying?**
- Check **Deployment Center** → **Logs**
- Verify `SCM_REPOSITORY_PATH=backend` is set
- Check **Configuration** → **General settings** → **SCM_DO_BUILD_DURING_DEPLOYMENT** = `true`

**Build failing?**
- Check **Deployment Center** → **Logs** for errors
- Verify Dockerfile exists in `backend/` directory
- Check environment variables are set

**Service offline?**
- Check **Log Stream** (left menu) for runtime errors
- Verify PORT environment variable
- Check database connection

## Full Guide

See `AZURE_APP_SERVICE_SETUP.md` for detailed instructions.

