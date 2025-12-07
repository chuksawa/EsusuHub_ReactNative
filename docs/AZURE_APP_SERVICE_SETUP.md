# Deploy to Azure App Service (Railway Alternative)

Azure App Service is Azure's equivalent to Railway - it's a Platform-as-a-Service (PaaS) that supports Node.js, Docker, and auto-deploys from Git.

## Why Azure App Service?

✅ **Similar to Railway:**
- Auto-deploys on Git push
- Supports Docker containers
- Environment variables
- Custom domains
- Free tier available
- Easy setup

✅ **Works with Azure DevOps:**
- Direct integration with your existing Azure DevOps repo
- No need to migrate to GitHub
- Uses your existing Azure account

## Prerequisites

- ✅ Azure account (you have this)
- ✅ Azure DevOps repository (you have this)
- ✅ Backend code ready (you have this)

## Step 1: Create Azure App Service

### Option A: Via Azure Portal (Easiest)

1. **Go to Azure Portal:** https://portal.azure.com
2. **Click "+ Create a resource"** (top left)
3. **Search for:** "Web App"
4. **Click "Web App"** → **"Create"**

### Option B: Via Azure CLI

```powershell
# Install Azure CLI if needed
# winget install -e --id Microsoft.AzureCLI

# Login
az login

# Create resource group
az group create --name EsusuHub-RG --location eastus

# Create App Service plan (Free tier)
az appservice plan create --name EsusuHub-Plan --resource-group EsusuHub-RG --sku FREE --is-linux

# Create Web App with Docker
az webapp create --resource-group EsusuHub-RG --plan EsusuHub-Plan --name esusuhub-backend --deployment-container-image-name node:18-alpine
```

## Step 2: Configure Deployment from Azure DevOps

1. **In Azure Portal:**
   - Go to your Web App
   - **Deployment Center** (left menu)
   - **Source:** Select "Azure Repos"
   - **Organization:** Your Azure DevOps organization
   - **Project:** EsusuHub
   - **Repository:** EsusuHub_ReactNative
   - **Branch:** main
   - **Build provider:** App Service build service
   - **Click "Save"**

2. **Set Root Directory:**
   - After connecting, go to **Configuration** → **General settings**
   - **SCM_DO_BUILD_DURING_DEPLOYMENT:** `true`
   - **WEBSITE_RUN_FROM_PACKAGE:** `0`
   - Add application setting: **SCM_REPOSITORY_PATH** = `backend`

## Step 3: Configure for Docker (Recommended)

Since you have a Dockerfile, use Docker deployment:

1. **In Azure Portal:**
   - Go to your Web App
   - **Deployment Center** → **Settings**
   - **Source:** Azure Container Registry or Docker Hub
   - OR use **Docker Compose** with your Dockerfile

2. **Alternative: Use Dockerfile directly**
   - **Configuration** → **General settings**
   - **WEBSITES_ENABLE_APP_SERVICE_STORAGE:** `true`
   - **DOCKER_REGISTRY_SERVER_URL:** (leave empty for public)
   - **DOCKER_CUSTOM_IMAGE_NAME:** `node:18-alpine`
   - **DOCKER_CUSTOM_IMAGE_RUN_COMMAND:** `npm start`

## Step 4: Set Environment Variables

1. **Configuration** → **Application settings**
2. **Add new application setting** for each:

```
NODE_ENV = production
PORT = 8080
DATABASE_URL = postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require
JWT_SECRET = your-secret-here
JWT_REFRESH_SECRET = your-refresh-secret-here
CORS_ORIGIN = *
```

**Note:** Azure App Service uses port 8080 by default (not 5166). Update your code to use `process.env.PORT || 8080`.

## Step 5: Configure Dockerfile for Azure

Azure App Service needs a small adjustment. Update your Dockerfile CMD:

```dockerfile
# In your Dockerfile, the CMD is already correct:
CMD ["node", "dist/server.js"]

# But make sure PORT is configurable:
# Your code already uses: process.env.PORT || config.port
# Just ensure config.port defaults to 8080 for Azure
```

## Step 6: Deploy

### Automatic (After Configuration)

Once configured, Azure will:
1. Watch your Azure DevOps repo
2. Auto-deploy on every push to `main`
3. Build using your Dockerfile
4. Restart the service

### Manual Trigger

1. **Deployment Center** → **Sync**
2. Or push to your repo:
   ```powershell
   git add .
   git commit -m "Deploy to Azure"
   git push origin main
   ```

## Step 7: Get Your URL

1. **Overview** (in your Web App)
2. **Default domain:** `https://esusuhub-backend.azurewebsites.net`
3. **Test it:**
   ```powershell
   curl https://esusuhub-backend.azurewebsites.net/health
   ```

## Step 8: Update Frontend

Update `src/config/env.ts`:

```typescript
API_BASE_URL: process.env.API_BASE_URL || 'https://esusuhub-backend.azurewebsites.net/api'
```

## Troubleshooting

### "Build failed"
- Check **Deployment Center** → **Logs**
- Verify Dockerfile is in `backend/` directory
- Check **Configuration** → **General settings** → **SCM_REPOSITORY_PATH**

### "Port already in use"
- Azure uses port 8080 by default
- Your code should use: `process.env.PORT || 8080`
- Check **Configuration** → **Application settings** → **PORT**

### "Cannot connect to database"
- Verify `DATABASE_URL` is set correctly
- Check Supabase allows connections from Azure IPs
- Ensure `?sslmode=require` is in the connection string

### "Service not responding"
- Check **Log Stream** (in left menu) for errors
- Verify environment variables are set
- Check **Deployment Center** → **Logs** for build errors

## Azure App Service vs Railway

| Feature | Azure App Service | Railway |
|---------|------------------|---------|
| Auto-deploy | ✅ Yes | ✅ Yes |
| Docker support | ✅ Yes | ✅ Yes |
| Free tier | ✅ Yes (limited) | ✅ Yes |
| Azure DevOps | ✅ Native | ❌ Not supported |
| GitHub | ✅ Supported | ✅ Supported |
| Custom domains | ✅ Yes | ✅ Yes |
| Environment vars | ✅ Yes | ✅ Yes |

## Cost

- **Free tier:** 1 GB storage, 60 minutes CPU/day
- **Basic tier:** ~$13/month (more resources)
- **Standard tier:** ~$50/month (production-ready)

## Next Steps

1. ✅ Create Azure App Service
2. ✅ Connect Azure DevOps repo
3. ✅ Set environment variables
4. ✅ Configure Docker
5. ✅ Deploy and test

## Resources

- **Azure App Service Docs:** https://docs.microsoft.com/azure/app-service/
- **Node.js on Azure:** https://docs.microsoft.com/azure/app-service/quickstart-nodejs
- **Docker on Azure:** https://docs.microsoft.com/azure/app-service/quickstart-custom-container

