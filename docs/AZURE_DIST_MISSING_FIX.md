# Fix: dist/ Folder Missing - TypeScript Not Compiled

## Problem Confirmed

- ❌ `dist/` folder is missing
- ❌ Only `hostingstart.html` exists (default Azure page)
- ❌ TypeScript was NOT compiled
- ❌ `POST_BUILD_COMMAND` is not running

## Root Cause

`POST_BUILD_COMMAND` is either:
1. Not set correctly
2. Not being executed by Oryx
3. Failing silently

## Solution 1: Verify and Fix POST_BUILD_COMMAND

### Step 1: Check Current Setting

1. **Configuration** → **Application settings**
2. **Look for:** `POST_BUILD_COMMAND`
3. **Verify:**
   - ✅ **Name:** `POST_BUILD_COMMAND` (exact, case-sensitive)
   - ✅ **Value:** `npm run build` (no quotes, no spaces)
   - ✅ **Deployment slot setting:** **UNCHECKED**

### Step 2: If Missing or Wrong

1. **Add/Edit** the setting:
   - **Name:** `POST_BUILD_COMMAND`
   - **Value:** `npm run build`
   - **Deployment slot setting:** **UNCHECKED**
2. **Save**
3. **Restart** Web App
4. **Deployment Center** → **Sync** (trigger new build)

### Step 3: Verify It Runs

After redeploying, check build logs for:
```
Running post-build command...
npm run build
Building TypeScript...
Compiling...
```

## Solution 2: Use Alternative Build Command

If `POST_BUILD_COMMAND` still doesn't work, try:

### Option A: PRE_BUILD_COMMAND

1. **Configuration** → **Application settings**
2. **Add:**
   - **Name:** `PRE_BUILD_COMMAND`
   - **Value:** `npm run build`
3. **Save** → **Redeploy**

### Option B: SCM_DO_BUILD_DURING_DEPLOYMENT

1. **Configuration** → **Application settings**
2. **Add:**
   - **Name:** `SCM_DO_BUILD_DURING_DEPLOYMENT`
   - **Value:** `true`
   - **Name:** `POST_BUILD_COMMAND`
   - **Value:** `npm run build`
3. **Save** → **Redeploy**

## Solution 3: Switch to Docker (Recommended)

Since you have a Dockerfile, this is the most reliable option:

1. **Deployment Center** → **Settings**
2. **Build provider:** Change to **"Docker Container"**
3. **Dockerfile path:** `backend/Dockerfile`
4. **Save**
5. **Deployment Center** → **Sync**

Docker will:
- ✅ Build TypeScript automatically
- ✅ Copy files correctly
- ✅ Start server correctly

## Why POST_BUILD_COMMAND Might Not Work

### Issue 1: Oryx Build Process

Oryx might be:
- Building but not running post-build commands
- Failing silently
- Not recognizing the setting

### Issue 2: Setting Format

**Wrong:**
- `"npm run build"` (with quotes)
- `npm run build ` (with trailing space)
- `POST_BUILD_COMMAND` (wrong name)

**Correct:**
- `npm run build` (exact, no quotes)

### Issue 3: Deployment Slot Setting

If checked, the setting might only apply to a specific slot.

**Fix:** Uncheck it

## Quick Diagnostic

### Check if Setting Exists:

1. **Advanced Tools (Kudu)** → **Go**
2. **Debug console** → **CMD**
3. ```cmd
   cd site
   type .env
   ```
4. **Look for:** `POST_BUILD_COMMAND=npm run build`

If not found, the setting isn't being applied.

## Recommended: Switch to Docker

Since `POST_BUILD_COMMAND` isn't working reliably, **switch to Docker deployment:**

1. **Deployment Center** → **Settings**
2. **Build provider:** **"Docker Container"**
3. **Dockerfile path:** `backend/Dockerfile`
4. **Save** → **Sync**

This will:
- ✅ Build TypeScript automatically (in Dockerfile)
- ✅ Deploy correctly
- ✅ Start server correctly

## After Fixing

### Verify Files:

1. **Kudu Console:**
   ```cmd
   cd site\wwwroot
   dir
   dir dist
   ```
2. **Should see:**
   - ✅ `package.json`
   - ✅ `dist/` folder
   - ✅ `dist/server.js`
   - ✅ `node_modules/`

### Verify Server:

1. **Log Stream** - Should show:
   ```
   🚀 Server running on port 8080
   ```

2. **Test endpoint:**
   ```
   https://your-app.azurewebsites.net/health
   ```
   Should return JSON, not HTML.

## Summary

- **Current:** `dist/` missing, only `hostingstart.html`
- **Fix:** Verify `POST_BUILD_COMMAND` OR switch to Docker
- **Recommended:** Switch to Docker (most reliable)

