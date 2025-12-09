# Upgrade Azure App Service Plan for Docker Support

## Current Situation

- ✅ `POST_BUILD_COMMAND` is set correctly
- ❌ But it's not executing (Oryx issue)
- 💡 Docker would solve this reliably

## App Service Plan Tiers

### Free Tier (F1)
- ❌ **No Docker support**
- ❌ Limited features
- ✅ Free

### Basic Tier (B1, B2, B3)
- ✅ **Docker support available**
- ✅ More reliable
- 💰 ~$13-55/month (depending on size)

### Standard Tier (S1, S2, S3)
- ✅ **Full Docker support**
- ✅ Production-ready
- ✅ Auto-scaling
- 💰 ~$50-200/month

## How to Upgrade

### Step 1: Check Current Plan

1. **Azure Portal** → Your Web App
2. **Overview** (left menu)
3. **Look for:** "App Service plan" section
4. **Note the current plan name** (e.g., "Free", "Basic", "Standard")

### Step 2: Upgrade Plan

**Option A: Upgrade Existing Plan**

1. **Click on your App Service plan** (in Overview)
2. **Scale up (App Service plan)** (left menu)
3. **Select a tier:**
   - **Basic B1** (~$13/month) - Good for testing
   - **Basic B2** (~$25/month) - Better performance
   - **Standard S1** (~$50/month) - Production-ready
4. **Click "Apply"**
5. **Wait for upgrade** (takes a few minutes)

**Option B: Create New Plan**

1. **Overview** → **Change App Service plan**
2. **Create new** or **Select existing**
3. **Choose tier** with Docker support
4. **Apply**

### Step 3: Enable Docker After Upgrade

1. **Configuration** → **General settings**
2. **Stack:** Change to **"Docker"** or **"Docker Compose"**
3. **Save**

### Step 4: Configure Docker Deployment

1. **Deployment Center** → **Settings**
2. **Build provider:** Should now show **"Docker Container"**
3. **Dockerfile path:** `backend/Dockerfile`
4. **Save**

## Cost Comparison

| Tier | Monthly Cost | Docker Support | Best For |
|------|-------------|----------------|----------|
| Free (F1) | $0 | ❌ No | Testing only |
| Basic B1 | ~$13 | ✅ Yes | Development |
| Basic B2 | ~$25 | ✅ Yes | Small production |
| Standard S1 | ~$50 | ✅ Yes | Production |

## Alternative: Try Different Build Command

Before upgrading, you could try:

### Option 1: PRE_BUILD_COMMAND

Sometimes `PRE_BUILD_COMMAND` works when `POST_BUILD_COMMAND` doesn't:

1. **Configuration** → **Application settings**
2. **Add:**
   - **Name:** `PRE_BUILD_COMMAND`
   - **Value:** `npm run build`
3. **Save** → **Restart** → **Redeploy**

### Option 2: Custom Build Script

Create a build script that Azure can run:

1. **In your repo:** Create `backend/build.sh`
2. **Content:**
   ```bash
   #!/bin/bash
   npm install
   npm run build
   ```
3. **Configuration** → **Application settings**
4. **Add:**
   - **Name:** `POST_BUILD_COMMAND`
   - **Value:** `bash build.sh`

## Recommendation

### If Budget Allows:
- ✅ **Upgrade to Basic B1** (~$13/month)
- ✅ **Enable Docker**
- ✅ **Most reliable solution**

### If Budget is Tight:
- ✅ **Try PRE_BUILD_COMMAND first** (free)
- ✅ **If that doesn't work, then upgrade**

## After Upgrading

1. ✅ **Change Stack to Docker**
2. ✅ **Configure Docker deployment**
3. ✅ **Deploy** - Docker will build TypeScript automatically
4. ✅ **No more POST_BUILD_COMMAND issues!**

## Quick Upgrade Steps

1. **Overview** → Click your **App Service plan name**
2. **Scale up (App Service plan)** (left menu)
3. **Select:** **Basic B1** (cheapest with Docker)
4. **Apply** → Wait ~5 minutes
5. **Configuration** → **General settings** → **Stack:** **Docker**
6. **Deployment Center** → **Settings** → **Docker Container**
7. **Deploy!**

## Cost Savings Tip

- You can **scale down** later if needed
- Azure charges **per hour**, so you can test and then scale down
- **Dev/Test pricing** might be available (check Azure pricing)

## Need Help?

- **Azure Pricing Calculator:** https://azure.microsoft.com/pricing/calculator/
- **App Service Pricing:** https://azure.microsoft.com/pricing/details/app-service/windows/
- **Support:** Azure Portal → Help + support

