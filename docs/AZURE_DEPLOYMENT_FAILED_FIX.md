# Fix: Deployment Failed and POST_BUILD_COMMAND Not Running

## Current Issues

1. ❌ **Deployments showing "Failed"**
2. ❌ **"npm run build" not in logs** - POST_BUILD_COMMAND not executing

## Step 1: Check Failed Deployment Error

1. **Deployment Center** → **Logs**
2. **Click on one of the failed deployments**
3. **Scroll through the logs** - Look for:
   - Red error messages
   - "Build failed"
   - "Deployment failed"
   - Any specific error text

4. **Copy the exact error message**

## Step 2: Verify POST_BUILD_COMMAND Configuration

1. **Configuration** → **Application settings**
2. **Find:** `POST_BUILD_COMMAND`
3. **Verify:**
   - ✅ **Name:** `POST_BUILD_COMMAND` (exact spelling, no typos)
   - ✅ **Value:** `npm run build` (no quotes, no extra spaces)
   - ✅ **Deployment slot setting:** **UNCHECKED**
4. **If missing or wrong:** Add/update it
5. **Save**

## Step 3: Common Issues & Fixes

### Issue 1: POST_BUILD_COMMAND Not Set

**Fix:**
- Add: `POST_BUILD_COMMAND = npm run build`
- Save → Restart → Redeploy

### Issue 2: Wrong Value Format

**Wrong:**
- `"npm run build"` (with quotes)
- `npm run build ` (with trailing space)
- `npm run build;` (with semicolon)

**Correct:**
- `npm run build` (exact, no quotes)

### Issue 3: Deployment Slot Setting Checked

**Fix:**
- Uncheck "Deployment slot setting"
- Save → Redeploy

### Issue 4: Build Failing Before POST_BUILD_COMMAND

If the build fails during `npm install` or earlier, POST_BUILD_COMMAND won't run.

**Check:**
- Look for errors in the build logs
- Common issues:
  - Missing dependencies
  - TypeScript errors
  - Network issues

## Step 4: Check Build Provider Settings

1. **Deployment Center** → **Settings**
2. **Build provider:** Should be "App Service build service"
3. **Verify:** Settings are saved

## Step 5: Alternative: Use SCM_DO_BUILD_DURING_DEPLOYMENT

If POST_BUILD_COMMAND isn't working, try:

1. **Configuration** → **Application settings**
2. **Add:**
   - `SCM_DO_BUILD_DURING_DEPLOYMENT = true`
   - `POST_BUILD_COMMAND = npm run build`
3. **Save** → **Restart** → **Redeploy**

## Step 6: Manual Verification

### Check if Setting is Applied:

1. **Advanced Tools (Kudu)** → **Go**
2. **Debug console** → **CMD**
3. ```cmd
   cd site
   type .env
   ```
4. **Look for:** `POST_BUILD_COMMAND=npm run build`

## Step 7: Trigger New Deployment

After fixing configuration:

1. **Deployment Center** → **Sync**
2. **OR** push to Git: `git push origin main`
3. **Watch the logs** for:
   - "Running post-build command..."
   - "npm run build"

## What to Share

To help diagnose, share:

1. **Error message** from failed deployment logs
2. **POST_BUILD_COMMAND value** (exact as shown in Azure)
3. **Whether "Deployment slot setting" is checked or unchecked**
4. **Any errors** in the build logs

## Quick Fix Checklist

- [ ] Click failed deployment → Copy error message
- [ ] Verify POST_BUILD_COMMAND = npm run build (exact)
- [ ] Uncheck "Deployment slot setting"
- [ ] Save all settings
- [ ] Restart Web App
- [ ] Deployment Center → Sync (trigger new deployment)
- [ ] Check logs for "npm run build"

