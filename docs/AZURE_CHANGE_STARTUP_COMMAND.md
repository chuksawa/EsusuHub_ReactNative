# Change Startup Command - Step by Step

## Current Problem

Your startup command is: `cd backend && npm start`

This is causing the error: `cd: can't cd to backend`

## Why It's Wrong

Oryx builds files **directly to** `/home/site/wwwroot`, not to `/home/site/wwwroot/backend`.

So when the startup script runs:
1. It's already in `/home/site/wwwroot`
2. It tries: `cd backend` ❌ (doesn't exist)
3. Fails with error

## The Fix

### Step-by-Step:

1. **Azure Portal** → Your Web App (`esusuhub-backend`)
2. **Left menu** → **Configuration**
3. **Top tabs** → **General settings** (should be selected)
4. **Scroll down** to find **"Startup Command"** field
5. **Current value:** `cd backend && npm start`
6. **Change to:** `npm start`
7. **Click "Save"** (top of page - blue button)
8. **Restart** your Web App:
   - Go to **Overview** (left menu)
   - Click **"Restart"** button (top)
   - Confirm restart

## Visual Guide

```
Azure Portal
  └─ esusuhub-backend
      └─ Configuration (left menu)
          └─ General settings (tab)
              └─ Startup Command: [npm start]  ← Change here
                  └─ Save (top of page)
                      └─ Overview → Restart
```

## Why This Works

**Oryx Build Process:**
```
Source: /home/site/backend
  ↓ (builds and copies)
Output: /home/site/wwwroot
  ├── package.json
  ├── dist/
  │   └── server.js
  └── node_modules/
```

Files are **directly in wwwroot**, so:
- ✅ `npm start` works (runs from wwwroot)
- ❌ `cd backend && npm start` fails (backend doesn't exist)

## After Changing

Check **Log Stream** - you should see:

```
✅ npm info using npm@...
✅ npm info using node@...
✅ 🚀 Server running on port 8080
✅ 📡 API available at http://localhost:8080/api
```

## Verify Files Location

To confirm files are in wwwroot (not wwwroot/backend):

1. **Advanced Tools (Kudu)** → **Go**
2. **Debug console** → **CMD**
3. ```cmd
   cd site\wwwroot
   dir
   ```
4. **Should see:** `package.json`, `dist/`, `node_modules/` directly
5. **Should NOT see:** `backend/` folder

## Summary

- **Current:** `cd backend && npm start` ❌
- **Change to:** `npm start` ✅
- **Location:** Configuration → General settings → Startup Command
- **Then:** Save → Restart

