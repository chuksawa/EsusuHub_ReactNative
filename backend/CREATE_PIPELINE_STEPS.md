# Quick Guide: Create Azure DevOps Pipeline

## ⚠️ Important: Parallelism Grant Required

Your pipeline uses **Microsoft-hosted agents**, which require a free parallelism grant from Microsoft.

**If you see a parallelism error:**
1. Request free grant: https://aka.ms/azpipelines-parallelism-request (takes 24-48 hours)
2. Or use self-hosted agent (see `AZURE_PARALLELISM_FIX.md`)

**If you have the grant or self-hosted agent:**
Follow these steps:

## Step-by-Step: Create Your Pipeline

### 1. Get Railway Token

1. Go to [railway.app](https://railway.app)
2. Sign in → Your Project → **Settings** → **Tokens**
3. Click **"New Token"** → Name it "Azure DevOps Pipeline"
4. **Copy the token** (save it - you won't see it again!)

### 2. Create Pipeline in Azure DevOps

1. **Go to Azure DevOps**
   - Navigate to your project
   - Click **"Pipelines"** in the left menu
   - Click **"New pipeline"** or **"Create Pipeline"**

2. **Select Source**
   - Choose **"Azure Repos Git"** (your Azure DevOps repository)
   - Select your repository
   - Select branch: `main` or `master`

3. **Configure Pipeline**
   - Choose **"Existing Azure Pipelines YAML file"**
   - Path: `backend/azure-pipelines.yml`
   - Click **"Continue"**

4. **Review Pipeline**
   - You'll see the pipeline YAML
   - Verify it looks correct
   - **Don't run yet** - we need to add the token first!

### 3. Add Railway Token Variable

1. **In the pipeline editor**, click **"Variables"** (top right)
2. Click **"New variable"**
3. Fill in:
   - **Name:** `RAILWAY_TOKEN`
   - **Value:** Paste your Railway token
   - **☑️ Keep this value secret** (IMPORTANT - check this box!)
4. Click **"OK"**
5. Click **"Save"** (to save the variable)

### 4. Save and Run Pipeline

1. Click **"Save"** (to save the pipeline)
2. Click **"Run"** to test it
3. Watch the pipeline execute:
   - ✅ Install Node.js 18
   - ✅ Install Railway CLI
   - ✅ Build TypeScript
   - ✅ Deploy to Railway

### 5. Verify Deployment

After pipeline succeeds:

1. Go to Railway Dashboard
2. Check your service is deployed
3. Test health endpoint:
   ```bash
   curl https://your-app.railway.app/health-quick
   ```

## What Happens Automatically

Once set up, the pipeline will:

- ✅ **Trigger automatically** on push to `main`/`master` branches
- ✅ **Use Microsoft-hosted Ubuntu agent** (no setup needed)
- ✅ **Build your TypeScript code**
- ✅ **Deploy to Railway**
- ✅ **Skip deployment** on `develop` branch (only builds)

## Troubleshooting

### "No agent available"
- This shouldn't happen with Microsoft-hosted agents
- Check your organization has pipeline permissions
- Verify `vmImage: 'ubuntu-latest'` is in the YAML

### "RAILWAY_TOKEN not found"
- Make sure you added it as a pipeline variable
- Check "Keep this value secret" is enabled
- Variable name must be exactly: `RAILWAY_TOKEN`

### "Railway CLI authentication failed"
- Verify your Railway token is valid
- Check token hasn't expired
- Get a new token from Railway dashboard if needed

### "Build fails"
- Check Railway logs: Railway Dashboard → Service → Logs
- Verify environment variables are set in Railway
- Check `DATABASE_URL` is correct

## Pipeline Configuration Explained

```yaml
pool:
  vmImage: 'ubuntu-latest'  # ← Microsoft-hosted, no setup!
```

This automatically:
- ✅ Provisions an Ubuntu 20.04 VM
- ✅ Runs your pipeline steps
- ✅ Cleans up after completion
- ✅ No cost for setup/maintenance

## Next Steps After Pipeline Works

1. ✅ Pipeline auto-deploys on push to main
2. ✅ Set up branch policies (optional)
3. ✅ Add more environment variables if needed
4. ✅ Configure staging/production environments

## Troubleshooting Parallelism Error

If you see: "No hosted parallelism has been purchased or granted"

**Quick fix:**
1. Request free grant: https://aka.ms/azpipelines-parallelism-request
2. See `AZURE_PARALLELISM_FIX.md` for complete solutions
3. Or use self-hosted agent (see `azure-pipelines-self-hosted.yml`)

## Need Help?

- Parallelism Fix: See `AZURE_PARALLELISM_FIX.md`
- Azure DevOps Docs: https://docs.microsoft.com/azure/devops/pipelines
- Railway Docs: https://docs.railway.app
- See `AZURE_DEVOPS_RAILWAY.md` for complete guide

