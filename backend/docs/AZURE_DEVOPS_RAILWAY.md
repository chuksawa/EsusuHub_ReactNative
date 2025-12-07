# Deploy from Azure DevOps to Railway

This guide explains how to deploy your EsusuHub backend from Azure DevOps to Railway.

## Prerequisites

1. Azure DevOps repository with your code
2. Railway account (sign up at [railway.app](https://railway.app))
3. Access to your Azure DevOps project

## Method 1: Deploy via Railway Dashboard (Recommended)

Railway supports Azure DevOps repositories directly.

### Step 1: Connect Azure DevOps to Railway

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in or create an account

2. **Create New Project**
   - Click **"New Project"**
   - Select **"Deploy from Git repo"**

3. **Connect Azure DevOps**
   - Railway will show options for Git providers
   - Look for **"Azure DevOps"** or **"Azure Repos"** option
   - Click **"Connect"** or **"Authorize"**

4. **Authorize Railway**
   - You'll be redirected to Azure DevOps login
   - Sign in with your Azure DevOps credentials
   - Grant Railway permission to access your repositories

5. **Select Your Repository**
   - Choose your Azure DevOps organization
   - Select your project
   - Select the repository containing your backend code
   - Railway will detect the `backend` folder automatically

### Step 2: Configure Service

1. **Set Root Directory**
   - Railway should auto-detect the `backend` folder
   - If not, go to Settings → Source → Root Directory
   - Set to: `backend`

2. **Verify Dockerfile Detection**
   - Railway should automatically detect `backend/Dockerfile`
   - If not, go to Settings → Build → Dockerfile Path
   - Set to: `backend/Dockerfile`

### Step 3: Set Environment Variables

Go to your service → **Variables** tab and add:

```env
NODE_ENV=production
PORT=5166
DATABASE_URL=postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres?sslmode=require
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here
API_BASE_URL=https://your-app.railway.app/api
CORS_ORIGIN=https://your-frontend.com,http://localhost:3000
```

### Step 4: Deploy

- Railway will automatically build and deploy when you push to your connected branch
- Or manually trigger deployment from Railway dashboard

## Method 2: Deploy via Railway CLI

If Railway dashboard doesn't support Azure DevOps directly, use the CLI:

### Step 1: Install Railway CLI

```bash
npm i -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

### Step 3: Initialize Railway in Your Project

```bash
cd backend
railway init
```

### Step 4: Link to Azure DevOps

You have two options:

#### Option A: Manual Git Push

1. **Add Railway as a remote**
   ```bash
   # Get your Railway Git URL from Railway dashboard
   # Go to your service → Settings → Source → Git Repository
   git remote add railway <railway-git-url>
   ```

2. **Push to Railway**
   ```bash
   git push railway main
   ```

#### Option B: Use Railway's Git Integration

1. **Create a Railway project**
   ```bash
   railway project new
   ```

2. **Link your local repo**
   ```bash
   railway link
   ```

3. **Set up environment variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set DATABASE_URL="postgresql://..."
   railway variables set JWT_SECRET="your-secret"
   railway variables set JWT_REFRESH_SECRET="your-refresh-secret"
   ```

4. **Deploy**
   ```bash
   railway up
   ```

## Method 3: Azure DevOps Pipeline to Railway

You can also set up an Azure DevOps Pipeline that deploys to Railway:

### Step 1: Get Railway Deployment Token

1. Go to Railway Dashboard
2. Navigate to your project → Settings → Tokens
3. Create a new token
4. Copy the token (save it securely)

### Step 2: Create Azure DevOps Pipeline

Create `azure-pipelines.yml` in your repository root:

```yaml
trigger:
  branches:
    include:
      - main
      - master

pool:
  vmImage: 'ubuntu-latest'

variables:
  RAILWAY_TOKEN: $(RAILWAY_TOKEN) # Set in Azure DevOps Variables

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Install Node.js'

  - script: |
      npm install -g @railway/cli
    displayName: 'Install Railway CLI'

  - script: |
      cd backend
      railway login --token $(RAILWAY_TOKEN)
      railway up
    displayName: 'Deploy to Railway'
    env:
      RAILWAY_TOKEN: $(RAILWAY_TOKEN)
```

### Step 3: Set Pipeline Variables

1. Go to Azure DevOps → Pipelines → Your Pipeline
2. Click **Edit** → **Variables**
3. Add variable:
   - Name: `RAILWAY_TOKEN`
   - Value: Your Railway token (mark as secret)
   - Scope: Pipeline

### Step 4: Run Pipeline

- Pipeline will run automatically on push to main/master
- Or trigger manually from Azure DevOps

## Method 4: Manual Docker Build & Push

If the above methods don't work, you can build Docker locally and push:

### Step 1: Build Docker Image

```bash
cd backend
docker build -t esusuhub-api:latest .
```

### Step 2: Tag for Railway Registry

```bash
# Get your Railway registry URL from Railway dashboard
# Service → Settings → Registry
docker tag esusuhub-api:latest registry.railway.app/your-service-id:latest
```

### Step 3: Login to Railway Registry

```bash
# Get credentials from Railway dashboard
# Service → Settings → Registry → Login Command
docker login registry.railway.app
```

### Step 4: Push to Railway

```bash
docker push registry.railway.app/your-service-id:latest
```

## Troubleshooting

### Railway Doesn't Show Azure DevOps Option

If Railway dashboard doesn't show Azure DevOps:
1. Use Railway CLI (Method 2)
2. Or use Azure DevOps Pipeline (Method 3)
3. Or contact Railway support to enable Azure DevOps integration

### Authentication Issues

- Ensure you have proper permissions in Azure DevOps
- Check that Railway has access to your repository
- Verify your Azure DevOps organization allows third-party integrations

### Build Fails

- Check Railway logs: Service → Logs
- Verify Dockerfile is in `backend/` directory
- Ensure all dependencies are in `package.json`
- Check that `backend/` is set as root directory

### Connection Issues

- Verify environment variables are set correctly
- Check Supabase connection string includes `?sslmode=require`
- Ensure Railway service has internet access

## Recommended Approach

For Azure DevOps, I recommend:

1. **Try Method 1 first** (Railway Dashboard) - easiest if supported
2. **Use Method 2** (Railway CLI) - most reliable, works with any Git provider
3. **Use Method 3** (Azure Pipeline) - if you want CI/CD in Azure DevOps

## Next Steps

After successful deployment:

1. ✅ Test health endpoint: `curl https://your-app.railway.app/health-quick`
2. ✅ Update frontend `API_BASE_URL` to Railway URL
3. ✅ Set up custom domain (optional)
4. ✅ Configure monitoring and alerts

## Additional Resources

- Railway Docs: https://docs.railway.app
- Azure DevOps Docs: https://docs.microsoft.com/azure/devops
- Railway Support: https://railway.app/support

