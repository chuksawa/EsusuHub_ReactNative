# Railway Not Deploying - Troubleshooting Guide

If Railway shows "Offline" and isn't deploying automatically, follow these steps:

## Step 1: Check Source Configuration

1. **Go to Railway Dashboard** → Your Service
2. **Settings** → **Source**
3. **Verify:**
   - ✅ **Root Directory** is set to: `backend`
   - ✅ **Dockerfile Path** is detected (should show `backend/Dockerfile`)
   - ✅ **Build Command** is auto-detected or empty
   - ✅ **Start Command** is `npm start` or `node dist/server.js` (or empty if Dockerfile has CMD)

## Step 2: Check if Code is Connected

**Option A: If using Git (Recommended)**
- Settings → Source → Should show your Git repository
- If not connected, click "Connect Repo"
- Railway will auto-deploy on every push

**Option B: If NOT using Git (Manual Upload)**
- Railway might not have your code
- You need to either:
  1. Connect a Git repository, OR
  2. Use Railway CLI to deploy: `railway up` (if auth works)

## Step 3: Trigger Manual Deployment

1. **Settings** → **General**
2. Click **"Redeploy"** or **"Deploy"** button
3. Watch the **Deployments** tab for build progress

## Step 4: Check Build Settings

1. **Settings** → **Build**
2. Verify:
   - **Build Command:** Should be empty (Dockerfile handles it) OR `npm run build`
   - **Dockerfile Path:** `backend/Dockerfile` or `Dockerfile`
   - **Docker Context:** `backend` or `.`

## Step 5: Verify Files Are Present

Railway needs these files in the `backend/` directory:
- ✅ `Dockerfile`
- ✅ `package.json`
- ✅ `tsconfig.json`
- ✅ `src/` directory with all source files

## Step 6: Check for Build Errors

1. **Deployments** tab → Click latest deployment
2. **Look for errors:**
   - "Dockerfile not found"
   - "Cannot find module"
   - "Build failed"
   - Any red error messages

## Step 7: Common Issues & Fixes

### Issue: "No deployments found"

**Fix:**
- Click **"Deploy"** or **"Redeploy"** button manually
- Or push a commit to trigger deployment (if Git connected)

### Issue: "Dockerfile not found"

**Fix:**
- Check **Root Directory** is set to `backend`
- Verify `Dockerfile` exists in `backend/` directory
- Check **Dockerfile Path** in Settings → Build

### Issue: "Build succeeded but service offline"

**Fix:**
- Check **Logs** tab for runtime errors
- Verify environment variables are set correctly
- Check **Start Command** is correct

### Issue: "No source code detected"

**Fix:**
- Connect a Git repository in Settings → Source
- Or use Railway CLI: `railway up` (if auth works)

## Step 8: Manual Trigger Checklist

If automatic deployment isn't working:

1. ✅ **Root Directory** set to `backend`
2. ✅ **Dockerfile** exists and is detected
3. ✅ **Environment Variables** are all set
4. ✅ **Start Command** is `npm start` or empty
5. ✅ Click **"Redeploy"** button manually
6. ✅ Watch **Deployments** tab for progress

## Step 9: Alternative - Use Railway CLI

If dashboard deployment isn't working, try CLI:

```powershell
cd backend
railway up
```

(Note: CLI auth might have issues - see other guides)

## Step 10: Check Railway Status

1. Visit: https://status.railway.app
2. Check if Railway is experiencing issues

## Still Not Working?

1. **Take a screenshot** of:
   - Settings → Source
   - Settings → Build
   - Deployments tab
   - Logs tab

2. **Check Railway Discord:** https://discord.gg/railway

3. **Verify your project structure:**
   ```
   backend/
   ├── Dockerfile
   ├── package.json
   ├── tsconfig.json
   └── src/
       └── server.ts
   ```

