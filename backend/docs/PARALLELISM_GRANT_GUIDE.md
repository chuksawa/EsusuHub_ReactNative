# How to Get Azure DevOps Parallelism Grant

## Current Status

You're seeing this error:
```
No hosted parallelism has been purchased or granted. To request a free parallelism grant...
```

This is **normal** for new Azure DevOps organizations. You need to request a free grant.

## Step-by-Step: Request Free Grant

### Step 1: Fill Out the Form

1. **Go to the form:**
   - Visit: https://aka.ms/azpipelines-parallelism-request
   - Or search: "Azure Pipelines parallelism request"

2. **Fill in the details:**
   - **Organization name:** Your Azure DevOps org (e.g., `yourorg`)
   - **Project name:** Your project name
   - **Email:** Your email address
   - **Use case:** Describe what you're doing
     - Example: "Deploying Node.js backend API to Railway for EsusuHub mobile app"
   - **Expected usage:** 
     - Example: "1-2 concurrent pipelines for continuous deployment"
   - **Additional info:** (Optional)
     - Example: "Free tier project, deploying to Railway cloud platform"

3. **Submit the form**

### Step 2: Wait for Approval

- **Typical approval time:** 24-48 hours
- **Sometimes faster:** Can be approved same day
- **You'll receive:** Email notification when approved
- **No cost:** It's completely free!

### Step 3: Verify Grant

After approval:

1. Go to Azure DevOps
2. Navigate to **Organization Settings** (gear icon, top right)
3. Click **"Parallel jobs"** in the left menu
4. Under **"Microsoft-hosted"**, you should see:
   - **1 free job** (or more if granted)
   - Status: Active

### Step 4: Run Your Pipeline

Once granted:
1. Go back to your pipeline
2. Click **"Run pipeline"**
3. It should work immediately! ✅

## What to Do While Waiting

While waiting for approval (24-48 hours), you have options:

### Option 1: Deploy Manually via Railway Dashboard (Recommended)

**Easiest and fastest:**

1. **Go to Railway Dashboard:**
   - Visit [railway.app](https://railway.app)
   - Sign in

2. **Create Project:**
   - Click **"New Project"**
   - Select **"Empty Project"**

3. **Add Service:**
   - Click **"+ New"** → **"Empty Service"**
   - Go to **Settings** → **Source**
   - Set **Root Directory:** `backend`

4. **Connect Git (Optional):**
   - If Azure DevOps is supported, connect your repo
   - Otherwise, Railway will build from Dockerfile

5. **Set Environment Variables:**
   - Go to **Variables** tab
   - Add all required variables:
     ```env
     NODE_ENV=production
     PORT=5166
     DATABASE_URL=postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres?sslmode=require
     JWT_SECRET=your_generated_secret
     JWT_REFRESH_SECRET=your_generated_refresh_secret
     API_BASE_URL=https://your-app.railway.app/api
     CORS_ORIGIN=https://your-frontend.com,http://localhost:3000
     ```

6. **Deploy:**
   - Railway will automatically build and deploy
   - Or click **"Deploy"** if manual trigger needed

### Option 2: Deploy from Local Machine

**Using Railway CLI:**

```powershell
# Set Railway token
$env:RAILWAY_TOKEN="your-token-here"

# Navigate to backend
cd backend

# Deploy
railway up
```

### Option 3: Set Up Self-Hosted Agent

If you need immediate pipeline deployment:

1. **Download agent:**
   - Azure DevOps → Project Settings → Agent pools → Default → New agent
   - Download for your OS

2. **Configure and run:**
   - See `AGENT_VERSION_FIX.md` for detailed steps

3. **Update pipeline:**
   - Use `azure-pipelines-self-hosted.yml` instead
   - Change pool to your agent pool name

## Form Tips

**To increase approval chances:**

1. **Be specific about use case:**
   - "Deploying Node.js backend API"
   - "Continuous deployment for mobile app backend"
   - "Production API deployment"

2. **Mention it's for learning/project:**
   - "Personal project"
   - "Learning/development"
   - "Small scale deployment"

3. **Be honest about usage:**
   - "1-2 concurrent pipelines"
   - "Low to moderate usage"

4. **Include project details:**
   - Project name
   - Technology stack (Node.js, Railway, Supabase)

## After Grant is Approved

Once you receive the approval email:

1. ✅ **No code changes needed** - your pipeline is already correct
2. ✅ **Just run the pipeline** - it will work immediately
3. ✅ **Automatic deployments** - on every push to main/master

## Check Grant Status

**Before approval:**
- Organization Settings → Parallel jobs
- Microsoft-hosted: "No parallel jobs"

**After approval:**
- Organization Settings → Parallel jobs
- Microsoft-hosted: "1 free job" (or more)

## Troubleshooting

### "Form submission failed"
- Try again later
- Check all fields are filled
- Use a valid email address

### "No response after 48 hours"
- Check spam/junk folder
- Verify email address is correct
- Submit form again if needed
- Contact Azure DevOps support

### "Grant was revoked"
- This shouldn't happen for free grants
- Contact Azure DevOps support
- Request grant again if needed

## Alternative: Use Self-Hosted Agent

If you can't wait or want unlimited parallelism:

1. Set up self-hosted agent (see `AGENT_VERSION_FIX.md`)
2. Use `azure-pipelines-self-hosted.yml`
3. No parallelism grant needed
4. Unlimited concurrent jobs

## Summary

**What to do now:**
1. ✅ **Request free grant:** https://aka.ms/azpipelines-parallelism-request
2. ✅ **Deploy manually via Railway Dashboard** while waiting
3. ✅ **Once approved, your pipeline works automatically**

**Your pipeline is correct** - you just need the grant approval!

## Quick Links

- **Request Grant:** https://aka.ms/azpipelines-parallelism-request
- **Check Status:** Azure DevOps → Organization Settings → Parallel jobs
- **Railway Dashboard:** https://railway.app
- **Railway Docs:** https://docs.railway.app

