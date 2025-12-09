# Fix: "can't cd to backend" Error

## The Error

```
cd: can't cd to backend
```

## The Problem

Oryx builds **FROM** `/home/site/backend` **TO** `/home/site/wwwroot`.

This means:
- ✅ Source code is in: `/home/site/backend`
- ✅ Built files go to: `/home/site/wwwroot` (directly, not in a subdirectory)
- ❌ Startup command tries: `cd backend` (but `backend` doesn't exist in `wwwroot`)

## The Fix

### Update Startup Command

1. **Azure Portal** → Your Web App
2. **Configuration** → **General settings**
3. **Startup Command:** Change from:
   ```
   cd backend && npm start
   ```
   To:
   ```
   npm start
   ```
4. **Save**
5. **Restart** your Web App

## Why This Happens

**Oryx Build Process:**
```
Source: /home/site/backend
  ↓ (builds)
Output: /home/site/wwwroot
```

The built files (including `package.json`, `dist/`, `node_modules/`) are placed directly in `/home/site/wwwroot`, not in a `backend` subdirectory.

## Verify Files Are in Right Place

1. **Advanced Tools (Kudu)** → **Go**
2. **Debug console** → **CMD**
3. ```cmd
   cd site\wwwroot
   dir
   ```
4. **Should see:**
   - ✅ `package.json`
   - ✅ `dist/` folder
   - ✅ `node_modules/` folder
   - ❌ No `backend/` folder

## Complete Configuration

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
Startup Command: npm start
```

**NOT:** `cd backend && npm start`

## After Fixing

Check **Log Stream** - you should see:

```
✅ npm info using npm@...
✅ npm info using node@...
✅ 🚀 Server running on port 8080
✅ 📡 API available at http://localhost:8080/api
```

## Summary

- **Oryx builds TO wwwroot** (not wwwroot/backend)
- **Startup command:** `npm start` (no `cd backend`)
- **Files are directly in wwwroot** after build

