# Fix: "Could not read package.json" Error

## The Problem

```
npm error path /package.json
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

Azure is running `npm start` from `/home/site/wwwroot`, but your `package.json` is in the `backend` subdirectory.

## The Fix

### Option 1: Update Startup Command (Recommended)

1. **Azure Portal** → Your Web App
2. **Configuration** → **General settings**
3. **Startup Command:** Change from `npm start` to:
   ```
   cd backend && npm start
   ```
4. **Save**
5. **Restart** your Web App

### Option 2: Verify SCM_REPOSITORY_PATH

If `SCM_REPOSITORY_PATH=backend` is set correctly, Azure should copy files to the right place. But the startup command still needs to run from the `backend` directory.

**Check:**
1. **Configuration** → **Application settings**
2. **Verify:** `SCM_REPOSITORY_PATH = backend` is set
3. **Update Startup Command** to: `cd backend && npm start`

## Why This Happens

When using **App Build Service** (code deployment):
- Azure builds from `backend/` directory (if `SCM_REPOSITORY_PATH=backend` is set)
- But the startup command runs from `/home/site/wwwroot` by default
- Your `package.json` is in `backend/`, not the root

## Complete Configuration for App Build Service

### Configuration → Application Settings:

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

```
Startup Command: cd backend && npm start
```

## Alternative: Use Full Path

If the above doesn't work, try:

```
Startup Command: cd /home/site/wwwroot/backend && npm start
```

## Verify It Works

After updating and restarting, check **Log Stream** for:

```
✅ npm info using npm@...
✅ npm info using node@...
✅ 🚀 Server running on port 8080
```

Instead of:
```
❌ npm error enoent Could not read package.json
```

## Quick Fix Steps

1. ✅ **Configuration** → **General settings**
2. ✅ **Startup Command:** `cd backend && npm start`
3. ✅ **Save**
4. ✅ **Overview** → **Restart**
5. ✅ **Check Log Stream** for success

