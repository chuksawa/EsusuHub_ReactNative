# Current Deployment Setup

## Overview

This document describes the **actual** deployment setup for EsusuHub.

## Git Repository

**Repository:** Azure DevOps
- **URL:** `https://EsusuHub@dev.azure.com/EsusuHub/EsusuHub/_git/EsusuHub_ReactNative`
- **Organization:** EsusuHub
- **Project:** EsusuHub
- **Repository:** EsusuHub_ReactNative
- **Branch:** main

## Backend Deployment

### Azure App Service

**Service Name:** `esusuhubappserver`  
**Base URL:** `https://esusuhubappserver-etaceafxd2h6gzdc.canadacentral-01.azurewebsites.net`  
**Region:** Canada Central  
**Port:** 8080 (internal), 80/443 (external)

### Azure Container Registry (ACR)

**Registry Name:** `esusuhubcontainer`  
**Registry URL:** `esusuhubcontainer.azurecr.io`  
**Image:** `esusuhub-backend:latest`

### Deployment Method

**Current:** Manual Docker build and push
1. Build Docker image locally
2. Push to ACR: `docker push esusuhubcontainer.azurecr.io/esusuhub-backend:latest`
3. App Service pulls from ACR automatically

**Future:** Azure DevOps Pipeline (to be configured)
- Auto-build on git push
- Auto-push to ACR
- Auto-deploy to App Service

## Environment Variables

Set in Azure App Service → Configuration → Application settings:

```
NODE_ENV = production
PORT = 8080
DATABASE_URL = (Supabase PostgreSQL connection string)
JWT_SECRET = (generated secret)
JWT_REFRESH_SECRET = (generated secret)
CORS_ORIGIN = *
```

## API Endpoints

All endpoints available at:
```
https://esusuhubappserver-etaceafxd2h6gzdc.canadacentral-01.azurewebsites.net/api/*
```

**Available routes:**
- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/groups/*` - Savings groups
- `/api/payments/*` - Payments
- `/api/notifications/*` - Notifications
- `/api/banking/*` - Banking

**Health checks:**
- `/health` - Full health check
- `/health-quick` - Quick health check

## Frontend Configuration

The React Native app is configured to use the Azure backend:

**File:** `src/config/env.ts`
```typescript
API_BASE_URL: 'https://esusuhubappserver-etaceafxd2h6gzdc.canadacentral-01.azurewebsites.net/api'
```

## Database

**Provider:** Supabase  
**Type:** PostgreSQL  
**Connection:** Via `DATABASE_URL` environment variable  
**SSL:** Required (`sslmode=require`)

## What We Are NOT Using

❌ **Railway** - Not connected  
❌ **GitHub** - Not connected (using Azure DevOps instead)

## Related Documentation

- `docs/AZURE_DEPLOYMENT_SUCCESS.md` - Deployment success summary
- `docs/AZURE_APP_SERVICE_SETUP.md` - App Service setup guide
- `docs/AZURE_ACR_SETUP.md` - Container Registry setup
- `docs/AZURE_ACR_LOCAL_BUILD.md` - Local Docker build and push
- `backend/deploy-acr.ps1` - PowerShell script for deployment

## Next Steps

1. ✅ Backend deployed to Azure App Service
2. ✅ Frontend configured to use Azure backend
3. ⏳ Set up Azure DevOps Pipeline for CI/CD
4. ⏳ Configure automatic deployments

