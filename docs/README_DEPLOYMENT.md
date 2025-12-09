# Deployment Overview

## Current Setup

✅ **Deployed to:** Azure App Service  
✅ **Container Registry:** Azure Container Registry (ACR)  
✅ **Repository:** Azure DevOps  
✅ **Status:** Live and running

## Quick Reference

**Backend URL:**
```
https://esusuhubappserver-etaceafxd2h6gzdc.canadacentral-01.azurewebsites.net
```

**Health Check:**
```
https://esusuhubappserver-etaceafxd2h6gzdc.canadacentral-01.azurewebsites.net/health
```

## Deployment Methods

### Method 1: Manual Docker Build & Push (Current)

1. **Build Docker image:**
   ```powershell
   docker build -t esusuhubcontainer.azurecr.io/esusuhub-backend:latest -f backend/Dockerfile backend
   ```

2. **Login to ACR:**
   ```powershell
   az acr login --name esusuhubcontainer
   ```

3. **Push to ACR:**
   ```powershell
   docker push esusuhubcontainer.azurecr.io/esusuhub-backend:latest
   ```

4. **App Service automatically pulls the new image**

**Or use the script:**
```powershell
.\backend\deploy-acr.ps1
```

### Method 2: Azure DevOps Pipeline (Recommended for CI/CD)

1. **Set up service connections in Azure DevOps:**
   - Azure service connection (for App Service)
   - ACR service connection (for Container Registry)

2. **Update pipeline variables:**
   - `RESOURCE_GROUP` - Your Azure resource group
   - `ACR_NAME` - Container registry name
   - `APP_SERVICE_NAME` - App Service name

3. **Push to main branch:**
   ```powershell
   git push origin main
   ```

4. **Pipeline automatically:**
   - Builds Docker image
   - Pushes to ACR
   - Deploys to App Service

See `backend/azure-pipelines.yml` for the pipeline configuration.

### Method 3: Azure Portal Deployment Center

1. **Azure Portal** → Your App Service
2. **Deployment Center** → **Settings**
3. **Source:** Azure Repos
4. **Repository:** EsusuHub_ReactNative
5. **Branch:** main
6. **Root Directory:** backend
7. **Save** - Azure will auto-deploy

## Environment Variables

Set in Azure App Service → **Configuration** → **Application settings**:

```
NODE_ENV = production
PORT = 8080
DATABASE_URL = (Supabase connection string)
JWT_SECRET = (generated secret)
JWT_REFRESH_SECRET = (generated secret)
CORS_ORIGIN = *
```

## Monitoring

**Log Stream:**
- Azure Portal → App Service → **Log Stream**
- Real-time application logs

**Deployment Logs:**
- Azure Portal → App Service → **Deployment Center** → **Logs**

## Troubleshooting

See:
- [AZURE_DEPLOYMENT_TROUBLESHOOTING.md](./AZURE_DEPLOYMENT_TROUBLESHOOTING.md)
- [AZURE_APP_SERVICE_SETUP.md](./AZURE_APP_SERVICE_SETUP.md)

## Related Documentation

- [CURRENT_DEPLOYMENT_SETUP.md](./CURRENT_DEPLOYMENT_SETUP.md) - Complete setup overview
- [AZURE_DEPLOYMENT_SUCCESS.md](./AZURE_DEPLOYMENT_SUCCESS.md) - Deployment details
- [AZURE_ACR_SETUP.md](./AZURE_ACR_SETUP.md) - Container Registry setup
- [AZURE_ACR_LOCAL_BUILD.md](./AZURE_ACR_LOCAL_BUILD.md) - Local build guide

