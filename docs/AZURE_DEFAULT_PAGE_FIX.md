# Fix "Your web app is running and waiting for your content"

This message means Azure App Service is running, but **your Node.js server isn't starting**.

## Quick Fix: Check Log Stream

1. **Azure Portal** → Your Web App
2. **Log Stream** (left menu)
3. **Look for errors:**
   - "Cannot find module 'dist/server.js'"
   - "Port already in use"
   - "Database connection error"
   - Any startup errors

## Common Causes & Fixes

### 1. Server Not Starting (Most Common)

**Check Log Stream** - you'll likely see:
```
Error: Cannot find module 'dist/server.js'
```

**Fix:**
- TypeScript wasn't compiled
- Use Docker deployment (recommended) OR
- Add build command: `POST_BUILD_COMMAND = npm run build`

### 2. Wrong Startup Command

**Configuration** → **General settings** → **Startup Command:**

**If using Docker:**
- Leave empty (Dockerfile CMD handles it)
- OR: `npm start`
- OR: `node dist/server.js`

**If using Code deployment:**
- `npm start`
- OR: `node dist/server.js`

### 3. Port Configuration Issue

Azure uses port 8080. Your code should use:
```typescript
const PORT = process.env.PORT || 8080;
```

**Verify:**
- **Configuration** → **Application settings** → `PORT=8080` is set
- Your code uses `process.env.PORT` (which it does)

### 4. Root Path Not Configured

Your server might be running but not responding to root `/`.

**Check:**
- Your server should respond to `/health` or `/api/health`
- Try: `https://your-app.azurewebsites.net/health`
- Try: `https://your-app.azurewebsites.net/api/health`

## Step-by-Step Fix

### Step 1: Check Log Stream

**Most Important!** This will show you the exact error.

1. **Log Stream** (left menu)
2. Look for:
   - Server startup messages
   - Error messages
   - "Cannot find module" errors

### Step 2: Verify Deployment Type

**Deployment Center** → **Settings** → Check:

**If using Docker:**
- Build provider: "Docker Container"
- Dockerfile path: `backend/Dockerfile`

**If using Code:**
- Build provider: "App Service build service"
- Need to add: `POST_BUILD_COMMAND = npm run build`

### Step 3: Check Startup Command

**Configuration** → **General settings** → **Startup Command:**

- **Docker:** Leave empty or `npm start`
- **Code:** `npm start` or `node dist/server.js`

### Step 4: Verify Environment Variables

**Configuration** → **Application settings** → All set:

✅ `NODE_ENV=production`
✅ `PORT=8080`
✅ `DATABASE_URL=...`
✅ `JWT_SECRET=...`
✅ `JWT_REFRESH_SECRET=...`

### Step 5: Test Health Endpoint

Even if root `/` shows default page, health endpoint might work:

```
https://your-app.azurewebsites.net/health
https://your-app.azurewebsites.net/api/health
```

## Recommended: Use Docker

Since you have a Dockerfile, switch to Docker deployment:

1. **Deployment Center** → **Settings**
2. **Build provider:** "Docker Container"
3. **Dockerfile path:** `backend/Dockerfile`
4. **Save**
5. **Deployment Center** → **Sync**

This ensures:
- ✅ TypeScript is compiled
- ✅ Server starts correctly
- ✅ All dependencies installed

## What to Look For in Log Stream

**Good signs:**
```
🚀 Server running on port 8080
📡 API available at http://localhost:8080/api
Database connected successfully
```

**Bad signs:**
```
Error: Cannot find module 'dist/server.js'
Error: Port 8080 already in use
Database connection error
```

## Still Not Working?

1. **Copy the exact error** from Log Stream
2. **Check if health endpoint works:** `/health` or `/api/health`
3. **Try restarting:** Overview → Restart
4. **Share the error message** for specific help

