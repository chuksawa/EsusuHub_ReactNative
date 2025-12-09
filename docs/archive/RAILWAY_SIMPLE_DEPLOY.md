# Simple Railway Deployment (No CI/CD)

This guide shows you how to deploy to Railway without setting up CI/CD pipelines.

## Method 1: Railway Dashboard + Git (Easiest)

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"** (if you can connect GitHub)
   - OR **"Empty Project"** if GitHub isn't available

### Step 2: Connect Your Repository

**If Railway supports Azure DevOps:**
1. Look for **"Azure DevOps"** or **"Azure Repos"** option
2. Authorize Railway to access your Azure DevOps
3. Select your repository
4. Railway will auto-detect the `backend` folder

**If Azure DevOps not supported:**
- Use Method 2 (Railway CLI) or Method 3 (Manual)

### Step 3: Configure Service

1. Railway should auto-detect `backend/Dockerfile`
2. If not, go to **Settings** → **Source**:
   - Set **Root Directory:** `backend`
   - Verify **Dockerfile Path:** `backend/Dockerfile`

### Step 4: Set Environment Variables

Go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=5166
DATABASE_URL=postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres?sslmode=require
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here
API_BASE_URL=https://your-app.railway.app/api
CORS_ORIGIN=https://your-frontend.com,http://localhost:3000
```

### Step 5: Deploy

- Railway will automatically build and deploy
- Or click **"Deploy"** to trigger manually
- Watch the build logs in real-time

## Method 2: Railway CLI (Recommended - No Docker Needed!)

Deploy directly from your local machine using Railway CLI. **Railway builds Docker in the cloud - you don't need Docker Desktop!**

### Step 1: Install Railway CLI

```powershell
npm install -g @railway/cli
```

### Step 2: Login to Railway

**Option A: Browser Login (if it works)**
```powershell
railway login
# Visit the URL and enter pairing code quickly
```

**Option B: Use Token (More Reliable)**
1. Go to Railway Dashboard → **Account Settings** → **Tokens**
2. Create new token
3. Set as environment variable:
   ```powershell
   $env:RAILWAY_TOKEN="your-token-here"
   ```

### Step 3: Initialize Railway Project

```powershell
cd backend
railway init
```

Follow prompts:
- Create new project or link existing? (Choose based on your needs)
- Project name: (Enter name or press Enter)

### Step 4: Set Environment Variables

```powershell
railway variables set NODE_ENV=production
railway variables set DATABASE_URL="postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres?sslmode=require"
railway variables set JWT_SECRET="your-secret-here"
railway variables set JWT_REFRESH_SECRET="your-refresh-secret-here"
railway variables set API_BASE_URL="https://your-app.railway.app/api"
railway variables set CORS_ORIGIN="https://your-frontend.com,http://localhost:3000"
```

### Step 5: Deploy

```powershell
railway up
```

This will:
- **Build your Docker image in Railway's cloud** (no local Docker needed!)
- Push to Railway
- Deploy automatically

### Step 6: Get Your URL

```powershell
railway domain
# Or check Railway Dashboard → Settings → Networking
```

## Method 3: Manual Docker Build & Push (Requires Local Docker)

**Note:** This method requires Docker Desktop to be running. If you don't have Docker, use Method 1 or 2 instead.

Build Docker image locally and push to Railway registry.

### Step 1: Build Docker Image

```powershell
cd backend
docker build -t esusuhub-api .
```

### Step 2: Get Railway Registry Credentials

1. Go to Railway Dashboard
2. Your Project → Service → **Settings** → **Registry**
3. Copy the login command (looks like):
   ```powershell
   docker login registry.railway.app -u _ -p <token>
   ```

### Step 3: Tag Image for Railway

```powershell
# Get your service ID from Railway Dashboard → Settings → Registry
docker tag esusuhub-api:latest registry.railway.app/<service-id>:latest
```

### Step 4: Login and Push

```powershell
# Login to Railway registry (use credentials from Step 2)
docker login registry.railway.app -u _ -p <your-token>

# Push image
docker push registry.railway.app/<service-id>:latest
```

### Step 5: Deploy in Railway

1. Go to Railway Dashboard
2. Your Service → **Deployments**
3. Click **"Redeploy"** or Railway will auto-deploy

## Method 4: Railway Web Editor (Quick Test)

For quick testing without Git:

1. Go to Railway Dashboard
2. Create **Empty Project**
3. Add **Empty Service**
4. Go to **Settings** → **Source**
5. Use Railway's web-based editor or upload files
6. Set environment variables
7. Deploy

## Recommended: Method 2 (Railway CLI)

For Azure DevOps repositories, **Method 2 (Railway CLI)** is the most reliable:

✅ Works with any Git provider  
✅ No CI/CD setup needed  
✅ **No local Docker needed** - Railway builds in the cloud  
✅ Deploy from your local machine  
✅ Can automate with simple scripts

**You don't need Docker Desktop for this method!** Railway builds your Docker image in their cloud.  

## Quick Deploy Script

Create `backend/deploy.ps1`:

```powershell
# Quick deploy script
$env:RAILWAY_TOKEN="your-token-here"
cd backend
railway up
```

Then just run:
```powershell
.\deploy.ps1
```

## Environment Variables Checklist

Before deploying, make sure you have:

- [ ] `DATABASE_URL` - Supabase connection string
- [ ] `JWT_SECRET` - Generated secret (use `npm run generate-secrets`)
- [ ] `JWT_REFRESH_SECRET` - Generated refresh secret
- [ ] `NODE_ENV=production`
- [ ] `API_BASE_URL` - Your Railway URL (update after first deploy)
- [ ] `CORS_ORIGIN` - Your frontend URLs

## After Deployment

1. **Get your Railway URL:**
   - Railway Dashboard → Settings → Networking
   - Or run: `railway domain`

2. **Test your deployment:**
   ```bash
   curl https://your-app.railway.app/health-quick
   ```

3. **Update frontend:**
   - Update `src/config/env.ts` with your Railway URL
   - Set `API_BASE_URL` to `https://your-app.railway.app/api`

4. **View logs:**
   ```powershell
   railway logs
   # Or Railway Dashboard → Service → Logs
   ```

## Troubleshooting

### "Railway CLI not found"
```powershell
npm install -g @railway/cli
```

### "Authentication failed"
- Use token method instead of browser login
- Set `$env:RAILWAY_TOKEN` before running commands

### "Build failed"
- Check Railway logs: Dashboard → Service → Logs
- Verify Dockerfile is in `backend/` directory
- Check all dependencies in `package.json`

### "Database connection failed"
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Supabase allows connections from Railway IPs
- Ensure password is correct

## Next Steps

After successful deployment:

1. ✅ Test all API endpoints
2. ✅ Update frontend API URL
3. ✅ Set up custom domain (optional)
4. ✅ Configure monitoring (optional)

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- See other guides in `backend/docs/` for specific issues

