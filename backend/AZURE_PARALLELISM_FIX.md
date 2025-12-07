# Fix: Azure DevOps Hosted Parallelism Error

## The Problem

You're seeing this error:
```
No hosted parallelism has been purchased or granted. To request a free parallelism grant, please fill out the following form https://aka.ms/azpipelines-parallelism-request
```

This means your Azure DevOps organization doesn't have parallelism grants for Microsoft-hosted agents yet.

## Solution 1: Request Free Parallelism Grant (Recommended)

### Step 1: Request the Grant

1. **Fill out the form:**
   - Go to: https://aka.ms/azpipelines-parallelism-request
   - Fill in your details:
     - **Organization name:** Your Azure DevOps org name
     - **Project name:** Your project name
     - **Use case:** "Deploying Node.js backend to Railway"
     - **Expected usage:** "1-2 concurrent pipelines"
   - Submit the form

2. **Wait for approval:**
   - Usually approved within 24-48 hours
   - You'll receive an email when approved
   - No cost - it's free!

3. **Once approved:**
   - Your pipeline will work immediately
   - No code changes needed

### Step 2: Verify Grant

After approval:
1. Go to Azure DevOps → **Organization Settings** → **Parallel jobs**
2. You should see "Microsoft-hosted" with 1 free job
3. Your pipeline should now run successfully

## Solution 2: Use Self-Hosted Agent (Immediate)

If you need to deploy immediately without waiting, set up a self-hosted agent:

### Option A: Use Your Local Machine (Quick Test)

1. **Download Agent:**
   - Go to Azure DevOps → **Project Settings** → **Agent pools**
   - Click **"Default"** pool
   - Click **"New agent"**
   - Select your OS (Windows/Linux/Mac)
   - Follow the download instructions

2. **Configure Agent:**
   ```powershell
   # Extract and run config
   .\config.cmd  # Windows
   # or
   ./config.sh  # Linux/Mac
   ```

3. **Run Agent:**
   ```powershell
   .\run.cmd  # Windows
   # or
   ./run.sh  # Linux/Mac
   ```

4. **Update Pipeline:**
   Change `azure-pipelines.yml`:
   ```yaml
   pool:
     name: Default  # Uses your self-hosted agent
     # Remove vmImage line
   ```

### Option B: Use Azure VM (More Stable)

1. **Create Azure VM:**
   - Go to Azure Portal
   - Create VM (Ubuntu 20.04 or Windows Server)
   - Size: Standard_B2s (cheapest)
   - Allow SSH/RDP access

2. **Install Agent on VM:**
   - SSH/RDP into VM
   - Download agent from Azure DevOps
   - Configure and run agent

3. **Update Pipeline:**
   ```yaml
   pool:
     name: Default  # Your self-hosted pool
   ```

## Solution 3: Modify Pipeline to Use Less Resources

Temporarily reduce pipeline complexity:

```yaml
# Simplified pipeline - fewer steps
pool:
  vmImage: 'ubuntu-latest'

steps:
  - script: |
      npm install -g @railway/cli
      cd backend
      export RAILWAY_TOKEN=$(RAILWAY_TOKEN)
      railway up --detach
    displayName: 'Deploy to Railway'
    env:
      RAILWAY_TOKEN: $(RAILWAY_TOKEN)
```

## Solution 4: Use Railway Dashboard (No Pipeline)

Deploy directly via Railway Dashboard:

1. Go to [railway.app](https://railway.app)
2. Create project → Empty Project
3. Add service → Connect Git (if Azure DevOps supported)
4. Or manually deploy via Railway CLI from your local machine

## Recommended Approach

**For immediate deployment:**
1. ✅ Request free parallelism grant (takes 24-48 hours)
2. ✅ In the meantime, use Railway Dashboard to deploy manually
3. ✅ Once grant is approved, your pipeline will work automatically

**For long-term:**
- Free grant gives you 1 concurrent Microsoft-hosted job
- Usually sufficient for most projects
- If you need more, consider self-hosted agents or paid plans

## Quick Fix: Deploy Manually While Waiting

While waiting for parallelism grant approval:

### Via Railway Dashboard:

1. **Create Project in Railway:**
   - Go to [railway.app](https://railway.app)
   - New Project → Empty Project

2. **Add Service:**
   - Click "+ New" → "Empty Service"
   - Settings → Source → Set root directory: `backend`

3. **Set Environment Variables:**
   - Go to Variables tab
   - Add all required variables (see `DEPLOYMENT_QUICK_START.md`)

4. **Deploy:**
   - Railway will build from your Dockerfile
   - Or connect Git if Azure DevOps is supported

### Via Railway CLI (Local):

```powershell
# Set token
$env:RAILWAY_TOKEN="your-token"

# Deploy from your local machine
cd backend
railway up
```

## After Parallelism Grant is Approved

Once you receive approval:

1. ✅ Your existing pipeline will work automatically
2. ✅ No code changes needed
3. ✅ Pipeline will use Microsoft-hosted agents
4. ✅ Deployments will be automatic on push

## Check Grant Status

1. Go to Azure DevOps → **Organization Settings**
2. Click **"Parallel jobs"**
3. Check **"Microsoft-hosted"** section
4. Should show "1 free job" after approval

## Need More Parallelism?

If you need more than 1 concurrent job:

- **Self-hosted agents:** Unlimited (you manage infrastructure)
- **Paid plans:** Azure DevOps offers paid parallelism
- **Alternative:** Use multiple Azure DevOps organizations

## Summary

**Best approach:**
1. ✅ Request free parallelism grant (https://aka.ms/azpipelines-parallelism-request)
2. ✅ Deploy manually via Railway Dashboard while waiting
3. ✅ Once approved, your pipeline works automatically

**Alternative:**
- Set up self-hosted agent for immediate use
- Use Railway Dashboard for all deployments

Your pipeline code is correct - you just need the parallelism grant or a self-hosted agent!

