# Azure App Service Deployment Options

## How Deployment Works

When you connect Azure DevOps to your Web App, Azure sets up **continuous deployment**. This means:

1. **Source:** Your code in Azure DevOps (or GitHub)
2. **Destination:** Your Web App (`esusuhubappserver`)
3. **Trigger:** Changes in your repository OR manual sync

## Three Ways to Deploy

### Option 1: Automatic Deployment (Recommended) ✅

**How it works:**
- Connect Azure DevOps in **Deployment Center**
- Every `git push` to your main branch **automatically triggers deployment**
- No manual steps needed!

**Steps:**
1. **Deployment Center** → Connect Azure DevOps
2. Push code: `git push origin main`
3. **Azure automatically:**
   - Detects the push
   - Builds your Docker image
   - Deploys to your web app
   - Updates your app!

**Check status:**
- **Deployment Center** → **Logs** (see build progress)
- **Deployment Center** → **History** (see all deployments)

### Option 2: Manual Sync from Portal ✅

**How it works:**
- Trigger deployment directly from Azure Portal
- Pulls latest code from your repository
- Useful for testing or re-deploying

**Steps:**
1. **Azure Portal** → Your Web App
2. **Deployment Center** → **Sync**
3. Azure pulls latest code and deploys

**When to use:**
- Want to re-deploy without pushing new code
- Testing deployment process
- Troubleshooting

### Option 3: Manual from Azure DevOps ✅

**How it works:**
- Azure DevOps creates a pipeline automatically
- You can run it manually from DevOps

**Steps:**
1. **Azure DevOps** → Your project
2. **Pipelines** → Find your deployment pipeline
3. **Run pipeline** → Deploys to web app

**When to use:**
- Want to see detailed pipeline logs
- Need to configure build steps
- Advanced scenarios

## Important: The Web App is the Destination

```
┌─────────────────┐         ┌──────────────────┐
│  Azure DevOps   │  ────>  │   Web App        │
│  (Your Code)    │  Deploy │  (Running App)   │
└─────────────────┘         └──────────────────┘
     Source                      Destination
```

- **Source:** Azure DevOps repository (where your code lives)
- **Destination:** Azure App Service Web App (where your app runs)
- **Deployment:** The process of copying/building code from source to destination

## What Happens During Deployment

1. **Azure pulls code** from your repository
2. **Builds Docker image** (if using Docker)
3. **Runs Dockerfile** commands:
   - `npm ci` (install dependencies)
   - `npm run build` (build TypeScript)
4. **Starts container** with your app
5. **Your app is live!**

## Recommended Setup

### For Development:
✅ **Automatic deployment** (Option 1)
- Push code → Auto-deploys
- Fast iteration
- Easy workflow

### For Production:
✅ **Automatic deployment** + **Manual approval** (if needed)
- Set up branch policies in Azure DevOps
- Require pull request reviews
- Auto-deploy after approval

## Quick Start

1. **Deployment Center** → Connect Azure DevOps
2. **Configuration** → Set environment variables
3. **Push code:** `git push origin main`
4. **Watch:** Deployment Center → Logs

That's it! Your app will deploy automatically. 🎉

## Troubleshooting

### "No deployments found"
- Make sure you've connected Azure DevOps
- Check that you've pushed code to the connected branch
- Try **Sync** button manually

### "Deployment failed"
- Check **Deployment Center** → **Logs**
- Verify Dockerfile path: `backend/Dockerfile`
- Check environment variables are set

### "How do I know if it deployed?"
- **Deployment Center** → **History** (shows all deployments)
- **Log Stream** (see server running)
- **Overview** → **Default domain** (test your app)

## Summary

- **Deployment triggers FROM:** Azure DevOps (when you push) OR Portal (when you sync)
- **Deployment deploys TO:** Your Web App
- **Recommended:** Automatic deployment (just push code!)
- **All methods:** Deploy to the same web app destination

The web app is where your app runs - deployment is just updating it with new code!

