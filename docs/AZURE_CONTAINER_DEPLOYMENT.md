# Azure Container-Based App Deployment

## Your App: esusuhubappserver (Container-Based)

✅ **Container deployment** - Uses Docker, different from code-based apps!

## The Interface Has Changed

**Container-based apps show:**
- **Containers** tab (configure container source)
- **Logs** tab (deployment logs)
- **FTPS credentials** tab (file access)

**No "Settings" tab** - that's for code-based apps!

## Deployment Options for Container Apps

### Option 1: Azure DevOps Pipeline (Recommended) ✅

**Best for:** Azure DevOps repositories

**How it works:**
1. Create Azure DevOps Pipeline
2. Pipeline builds Docker image
3. Pipeline pushes to Azure Container Registry (ACR) or Docker Hub
4. App pulls from registry

**Steps:**

#### Step 1: Create Azure Container Registry (ACR)

1. **Azure Portal** → **Create a resource**
2. **Search:** "Container Registry"
3. **Create** → Fill in:
   - **Registry name:** `esusuhubregistry` (or your choice)
   - **Resource group:** Same as your web app
   - **SKU:** Basic (cheapest)
4. **Review + Create** → **Create**

#### Step 2: Create Azure DevOps Pipeline

1. **Azure DevOps** → Your project
2. **Pipelines** → **New pipeline**
3. **Azure Repos Git** → Select your repo
4. **Choose:** "Starter pipeline"
5. **Replace YAML** with this:

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  dockerRegistryServiceConnection: 'ACR-Connection' # You'll create this
  imageRepository: 'esusuhub-backend'
  containerRegistry: 'esusuhubregistry.azurecr.io' # Your ACR name
  dockerfilePath: 'backend/Dockerfile'
  tag: '$(Build.BuildId)'
  azureSubscription: 'your-subscription-id' # Get from Azure Portal
  appName: 'esusuhubappserver'

stages:
- stage: Build
  displayName: 'Build and Push Docker Image'
  jobs:
  - job: Docker
    displayName: 'Docker Build'
    steps:
    - task: Docker@2
      displayName: 'Build and push image'
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(dockerRegistryServiceConnection)
        tags: |
          $(tag)
          latest

- stage: Deploy
  displayName: 'Deploy to App Service'
  dependsOn: Build
  jobs:
  - deployment: Deploy
    displayName: 'Deploy to App Service'
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebAppContainer@1
            displayName: 'Deploy to Azure App Service'
            inputs:
              azureSubscription: $(azureSubscription)
              appName: $(appName)
              containers: $(containerRegistry)/$(imageRepository):$(tag)
```

#### Step 3: Create Service Connection

1. **Azure DevOps** → **Project settings** (bottom left)
2. **Service connections** → **New service connection**
3. **Docker Registry** → **Azure Container Registry**
4. **Fill in:**
   - **Azure subscription:** Select your subscription
   - **Azure container registry:** Select your ACR
   - **Service connection name:** `ACR-Connection`
5. **Save**

#### Step 4: Configure Pipeline Variables

1. **Pipelines** → Your pipeline → **Edit**
2. **Variables** (top right)
3. **Add:**
   - `azureSubscription` = Your subscription ID (get from Azure Portal → Subscriptions)
   - `appName` = `esusuhubappserver`

#### Step 5: Configure App Service to Use Container

1. **Azure Portal** → Your Web App
2. **Deployment Center** → **Containers** tab
3. **Image source:** Azure Container Registry
4. **Registry:** Select your ACR
5. **Image:** `esusuhub-backend`
6. **Tag:** `latest`
7. **Save**

#### Step 6: Set Environment Variables

1. **Configuration** → **Application settings**
2. **Add:**
   ```
   NODE_ENV = production
   PORT = 8080
   DATABASE_URL = postgresql://postgres:sieQK72VRwSbZEiJ@db.tsfvtkvkejjbxjuiixgx.supabase.co:5432/postgres?sslmode=require
   JWT_SECRET = ede315d278c155c2f594397365395d1d1b36fc70ff2ce50c3b03cc67b60fe169a9c68d44cd3fd16b858b4a753adedba204eaf102700694de0fb678883d91474d
   JWT_REFRESH_SECRET = 5f836eeeefdd17d622eaa0c1c2a3b19944b6d6bef8daf0c7b0813b361f8b45bf0211038291354854d7457a0c4214a381fbb113917ade191b8ec01c86203b9d28
   CORS_ORIGIN = *
   ```
3. **Save**

#### Step 7: Deploy!

1. **Azure DevOps** → **Pipelines** → Your pipeline
2. **Run pipeline** → **Run**
3. **Watch:** Pipeline builds and deploys!

### Option 2: Docker Hub (Simpler) ✅

**Best for:** Quick setup without ACR

**Steps:**

1. **Create Docker Hub account** (if needed): https://hub.docker.com
2. **Build and push locally:**
   ```powershell
   cd backend
   docker build -t your-dockerhub-username/esusuhub-backend:latest .
   docker login
   docker push your-dockerhub-username/esusuhub-backend:latest
   ```

3. **Azure Portal** → Your Web App
4. **Deployment Center** → **Containers** tab
5. **Image source:** Docker Hub
6. **Access type:** Public
7. **Image and tag:** `your-dockerhub-username/esusuhub-backend:latest`
8. **Save**

### Option 3: Local Docker Build + Manual Push

**Best for:** Testing before full CI/CD

**Steps:**

1. **Build locally:**
   ```powershell
   cd backend
   docker build -t esusuhub-backend .
   ```

2. **Tag for ACR:**
   ```powershell
   docker tag esusuhub-backend esusuhubregistry.azurecr.io/esusuhub-backend:latest
   ```

3. **Login to ACR:**
   ```powershell
   az acr login --name esusuhubregistry
   ```

4. **Push to ACR:**
   ```powershell
   docker push esusuhubregistry.azurecr.io/esusuhub-backend:latest
   ```

5. **Configure app** (same as Option 1, Step 5)

## Quick Start (Simplest)

**If you want the fastest setup:**

1. **Use Docker Hub** (Option 2)
2. **Build and push once locally**
3. **Configure app to pull from Docker Hub**
4. **Set environment variables**
5. **Done!**

For automatic deployments later, set up the pipeline (Option 1).

## Configuration Checklist

- [ ] **Container Registry created** (ACR or Docker Hub)
- [ ] **Docker image built and pushed**
- [ ] **Deployment Center** → **Containers** → Configured
- [ ] **Configuration** → **Application settings** → All env vars set
- [ ] **App restarted** (happens automatically after container config)

## Troubleshooting

### "No containers tab"
- Make sure your app is **container-based** (not code-based)
- Check **Configuration** → **General settings** → **Stack** = Docker

### "Image pull failed"
- Check container registry credentials
- Verify image name and tag are correct
- Check ACR admin user is enabled (Settings → Access keys)

### "Container won't start"
- Check **Log Stream** for errors
- Verify environment variables are set
- Check Dockerfile CMD is correct

## Summary

**Container apps = Different deployment!**
- ❌ No "Settings" tab in Deployment Center
- ✅ Use **Containers** tab to configure image source
- ✅ Use **Azure DevOps Pipeline** for automatic deployments
- ✅ Or use **Docker Hub** for simpler setup

The key difference: Container apps pull pre-built images, code apps build from source!

