# Azure App Service Deployment Troubleshooting

## Common Deployment Failures

### 1. "Build failed" or "Deployment failed"

**Check Deployment Center → Logs:**
- Look for specific error messages
- Common errors:
  - "Dockerfile not found"
  - "Cannot find module"
  - "npm install failed"
  - "TypeScript compilation errors"

### 2. "Root directory not found"

**Fix:**
- **Configuration** → **Application settings**
- Add: `SCM_REPOSITORY_PATH` = `backend`
- Save and redeploy

### 3. "Dockerfile not found"

**Fix:**
- Verify Dockerfile exists in `backend/` directory
- Check **Deployment Center** → **Settings** → **Docker**
- Or use **Code deployment** instead of Docker

### 4. "npm install failed"

**Fix:**
- Check **Deployment Center** → **Logs** for specific package errors
- Verify `package.json` is in `backend/` directory
- Check Node version matches (20 LTS)

### 5. "TypeScript compilation failed"

**Fix:**
- We already fixed TypeScript errors locally
- Make sure all changes are committed and pushed
- Check if `tsconfig.json` is in the repo

### 6. "Port binding error"

**Fix:**
- Azure uses port 8080 by default
- Set `PORT=8080` in **Configuration** → **Application settings**
- Your code should use: `process.env.PORT || 8080`

## Step-by-Step Debugging

### Step 1: Check Deployment Logs

1. **Deployment Center** → **Logs** tab
2. **Click on latest deployment**
3. **Scroll through logs** to find the error
4. **Copy the error message**

### Step 2: Verify Configuration

**Configuration** → **Application settings** → Check:

✅ `SCM_REPOSITORY_PATH` = `backend`
✅ `NODE_ENV` = `production`
✅ `PORT` = `8080`
✅ All other environment variables set

### Step 3: Verify Source Connection

**Deployment Center** → **Settings** → Check:

✅ **Source:** Azure Repos
✅ **Organization:** Correct
✅ **Project:** EsusuHub
✅ **Repository:** EsusuHub_ReactNative
✅ **Branch:** main

### Step 4: Check Build Provider

**Deployment Center** → **Settings** → **Build provider:**

- **App Service build service** (recommended)
- OR **GitHub Actions** / **Azure Pipelines** (if configured)

### Step 5: Try Manual Deployment

1. **Deployment Center** → **Sync**
2. Or **Deployment Center** → **Redeploy**
3. Watch logs in real-time

## Alternative: Use Code Deployment (Not Docker)

If Docker is causing issues:

1. **Deployment Center** → **Settings**
2. **Source:** Azure Repos
3. **Build provider:** App Service build service
4. **Configuration** → **General settings:**
   - `SCM_DO_BUILD_DURING_DEPLOYMENT` = `true`
   - `WEBSITE_RUN_FROM_PACKAGE` = `0`
   - `SCM_REPOSITORY_PATH` = `backend`

This will:
- Build TypeScript during deployment
- Run `npm install`
- Start with `npm start`

## Common Error Messages & Fixes

### "ERROR: Cannot find module 'dist/server.js'"

**Cause:** TypeScript not compiled

**Fix:**
- Set `SCM_DO_BUILD_DURING_DEPLOYMENT` = `true`
- Or add build command in **Deployment Center** → **Settings**

### "ERROR: Port 5166 already in use"

**Cause:** Wrong port configured

**Fix:**
- Set `PORT=8080` in Application settings
- Azure uses 8080, not 5166

### "ERROR: Database connection failed"

**Cause:** Wrong DATABASE_URL or Supabase blocking

**Fix:**
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Supabase allows Azure IPs
- Test connection string locally

### "ERROR: Missing environment variable"

**Cause:** Required env var not set

**Fix:**
- Check all variables from `backend/RAILWAY_VALUES.md` are set
- Verify no typos in variable names

## Still Not Working?

1. **Copy the exact error message** from Deployment Center → Logs
2. **Check Log Stream** (left menu) for runtime errors
3. **Verify all files are in repo:**
   ```powershell
   git ls-files backend/
   ```
4. **Try redeploying** after fixing configuration

