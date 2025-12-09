# Fix: No Logs and "Not Deployed" Status

## Current Issues

1. **No logs in Log Stream** - Application logging might be disabled
2. **Shows "not deployed"** - Deployment might not have completed

## Step 1: Enable Application Logging

1. **Azure Portal** → Your Web App
2. **Configuration** → **Logging** (left menu, not General settings)
3. **Application Logging (Filesystem):** Turn **ON**
4. **Level:** Select **Information** (or Verbose for more details)
5. **Save** (top of page)
6. **Restart** your Web App

## Step 2: Check Deployment Status

1. **Deployment Center** (left menu)
2. **Check:**
   - Is there a deployment listed?
   - What's the status? (Succeeded, Failed, In Progress)
   - Click on the latest deployment to see logs

3. **If no deployment or failed:**
   - **Deployment Center** → **Sync** (to trigger new deployment)
   - OR push to Azure DevOps: `git push origin main`

## Step 3: Verify Files Are Deployed

1. **Advanced Tools (Kudu)** → **Go** (opens in new tab)
2. **Debug console** → **CMD**
3. **Check directory structure:**
   ```cmd
   cd site\wwwroot
   dir
   ```
4. **Look for:**
   - `backend/` folder (should exist)
   - `backend/package.json` (should exist)
   - `backend/dist/` (should exist if TypeScript compiled)

5. **If `backend/` doesn't exist:**
   - `SCM_REPOSITORY_PATH=backend` might not be working
   - Files might be in root instead

## Step 4: Check Build Logs

1. **Deployment Center** → **Logs**
2. **Click on latest deployment**
3. **Look for:**
   - Build errors
   - "Building TypeScript..."
   - "npm run build"
   - Any failures

## Step 5: Trigger New Deployment

If deployment shows as "not deployed" or failed:

### Option A: Manual Sync
1. **Deployment Center** → **Sync**
2. Watch for deployment to start

### Option B: Push to Git
```powershell
git push origin main
```
Azure should auto-deploy

### Option C: Redeploy
1. **Deployment Center** → **Logs**
2. Click on a previous deployment
3. **Redeploy** button

## Step 6: Verify Configuration

### Configuration → Application Settings:

✅ **Required:**
```
SCM_REPOSITORY_PATH = backend
POST_BUILD_COMMAND = npm run build
NODE_ENV = production
PORT = 8080
DATABASE_URL = ...
JWT_SECRET = ...
JWT_REFRESH_SECRET = ...
CORS_ORIGIN = *
```

### Configuration → General Settings:

✅ **Startup Command:** `cd backend && npm start`

### Configuration → Logging:

✅ **Application Logging (Filesystem):** ON
✅ **Level:** Information

## What to Check

1. ✅ **Application Logging enabled?** (Configuration → Logging)
2. ✅ **Deployment status?** (Deployment Center)
3. ✅ **Files in right place?** (Kudu Console)
4. ✅ **Build succeeded?** (Deployment Center → Logs)
5. ✅ **Startup command correct?** (`cd backend && npm start`)

## Expected After Fix

### Deployment Center:
- ✅ Shows "Deployment successful"
- ✅ Latest deployment has green checkmark

### Log Stream:
- ✅ Shows "npm info using npm@..."
- ✅ Shows "🚀 Server running on port 8080"
- ✅ Shows "Database connected successfully"

### Website:
- ✅ `/health` endpoint returns JSON
- ✅ `/test` endpoint returns JSON

## Still Not Working?

1. **Check Kudu Console** - Are files in `site/wwwroot/backend/`?
2. **Check Deployment Center Logs** - Any build errors?
3. **Share what you see** - Deployment status, Kudu directory listing, any errors

