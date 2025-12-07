# Railway Authentication Quick Fix

Your Railway CLI version (4.12.0) has limited authentication options. Here are working methods:

## Method 1: Browserless Login (Try Again)

The pairing code method can work if you're quick:

```powershell
railway login --browserless
```

**Steps:**
1. Run the command
2. **Immediately** copy the URL and pairing code
3. Open the URL in your browser **right away** (pairing codes expire quickly)
4. Enter the pairing code when prompted
5. Complete authentication

**Tip:** Have the browser ready before running the command!

## Method 2: Use Railway Dashboard (No CLI Needed)

If CLI authentication keeps failing, deploy via the web dashboard:

### Step 1: Create Project in Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Sign in
3. Click **"New Project"**
4. Select **"Empty Project"** (we'll add code manually)

### Step 2: Connect Your Code

You have two options:

#### Option A: Manual Git Connection (if Azure DevOps supported)

1. In Railway project → **Settings** → **Source**
2. Look for **"Connect Git Repository"**
3. If Azure DevOps is listed, connect it
4. Select your repo and branch

#### Option B: Deploy via Railway CLI (after dashboard setup)

1. In Railway dashboard, create the project
2. Go to **Settings** → **Source
3. Railway will give you a Git URL or deployment instructions
4. Use that to push your code

#### Option C: Use Railway's Web Editor (for quick test)

1. In Railway project → **Deploy** tab
2. Use Railway's web-based deployment
3. Or upload files directly

### Step 3: Configure Environment Variables

In Railway Dashboard:
1. Go to your service → **Variables** tab
2. Add all required variables (see below)

### Step 4: Set Root Directory

1. Go to **Settings** → **Source**
2. Set **Root Directory** to: `backend`
3. Railway will detect the Dockerfile automatically

## Method 3: Use Railway API with Token

If you have a valid token, you can use Railway's REST API directly:

```powershell
# Set your token
$env:RAILWAY_TOKEN="your-token-here"

# Use Railway API via curl
# Example: Get projects
curl -H "Authorization: Bearer $env:RAILWAY_TOKEN" https://api.railway.app/v1/projects
```

See Railway API docs: https://docs.railway.app/reference/api

## Method 4: Update Railway CLI

Try updating to the latest version:

```powershell
npm uninstall -g @railway/cli
npm install -g @railway/cli@latest

# Then try login again
railway login
```

## Recommended: Dashboard Method

For Azure DevOps, I recommend:

1. **Use Railway Dashboard** to create the project
2. **Manually configure** environment variables
3. **Use Azure DevOps Pipeline** (see `azure-pipelines.yml`) to deploy
   - The pipeline can use Railway API or CLI in the pipeline environment
   - Set `RAILWAY_TOKEN` as a pipeline variable

## Environment Variables to Set in Dashboard

Once your project is created, add these in Railway Dashboard → Service → Variables:

```env
NODE_ENV=production
PORT=5166
DATABASE_URL=postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres?sslmode=require
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here
API_BASE_URL=https://your-app.railway.app/api
CORS_ORIGIN=https://your-frontend.com,http://localhost:3000
```

## Next Steps

1. Try browserless login one more time (be quick!)
2. If that fails, use Railway Dashboard method
3. Set up Azure DevOps Pipeline for automated deployments

See `AZURE_DEVOPS_RAILWAY.md` for complete pipeline setup.

