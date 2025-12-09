# Fix Azure Oryx Build - TypeScript Not Compiling

## Problem

Azure Oryx is building your app but **not compiling TypeScript**. The error about Java is a red herring - the real issue is that Oryx doesn't know to run `npm run build` to compile TypeScript.

## Solution: Configure Build Command

Azure App Service needs to know to compile TypeScript before starting the app.

### Option 1: Use Build Command (Recommended)

1. **Azure Portal** → Your Web App
2. **Configuration** → **General settings**
3. **Application settings** → Add:

```
SCM_DO_BUILD_DURING_DEPLOYMENT = true
POST_BUILD_COMMAND = npm run build
```

4. **Save** and **Redeploy**

### Option 2: Use Startup Command

1. **Configuration** → **General settings**
2. **Startup Command:** 
   ```
   npm run build && npm start
   ```

3. **Save** and **Redeploy**

### Option 3: Use Docker (Best for TypeScript)

Since you have a Dockerfile, use Docker deployment instead:

1. **Deployment Center** → **Settings**
2. **Source:** Keep Azure Repos
3. **Build provider:** Change to **"Docker Container"**
4. **Dockerfile path:** `backend/Dockerfile`
5. **Save** and **Redeploy**

This will use your Dockerfile which already has the TypeScript build step.

## Why This Happens

Oryx automatically:
- ✅ Detects Node.js
- ✅ Runs `npm install`
- ❌ Does NOT run `npm run build` (doesn't know about TypeScript)

You need to tell it to build TypeScript explicitly.

## Recommended: Use Docker

Your Dockerfile already handles:
- ✅ Installing dependencies
- ✅ Building TypeScript (`npm run build`)
- ✅ Starting the server (`npm start`)

So Docker deployment is the easiest solution.

## Quick Fix Steps

### If Using Code Deployment (Oryx):

1. **Configuration** → **General settings**
2. Add application setting:
   - **Name:** `POST_BUILD_COMMAND`
   - **Value:** `npm run build`
3. **Save**
4. **Deployment Center** → **Sync**

### If Using Docker:

1. **Deployment Center** → **Settings**
2. **Build provider:** Select **"Docker Container"**
3. **Dockerfile path:** `backend/Dockerfile`
4. **Save**
5. **Deployment Center** → **Sync**

## Verify It Works

After redeploying, check **Log Stream** for:
- ✅ "Building TypeScript..."
- ✅ "Server running on port..."
- ✅ No "Cannot find module 'dist/server.js'" errors

