# Next Steps - Fix "Waiting for your content" Page

## Immediate Action: Check Log Stream

The default page means your Node.js server isn't starting. Check the logs to see why.

### Step 1: Open Log Stream

1. **Azure Portal** → Your Web App
2. **Log Stream** (left menu)
3. **Watch for errors** - this shows real-time server output

### Step 2: Identify the Error

Look for one of these common errors:

#### Error 1: "Cannot find module 'dist/server.js'"
**Cause:** TypeScript wasn't compiled  
**Fix:** Use Docker deployment (recommended) or add build command

#### Error 2: "Port already in use"
**Cause:** Port conflict  
**Fix:** Verify `PORT=8080` is set in Application settings

#### Error 3: "Database connection error"
**Cause:** Missing or wrong DATABASE_URL  
**Fix:** Check environment variables are set correctly

#### Error 4: No errors, but no server messages
**Cause:** Server not starting  
**Fix:** Check startup command in Configuration

## Quick Fixes Based on Error

### If "Cannot find module 'dist/server.js'"

**Option A: Switch to Docker (Recommended)**
1. **Deployment Center** → **Settings**
2. **Build provider:** "Docker Container"
3. **Dockerfile path:** `backend/Dockerfile`
4. **Save** → **Sync**

**Option B: Add Build Command**
1. **Configuration** → **Application settings**
2. **Add:** `POST_BUILD_COMMAND` = `npm run build`
3. **Save** → **Restart**

### If "Port already in use"
1. **Configuration** → **Application settings**
2. **Verify:** `PORT=8080` is set
3. **Startup Command:** `npm start` or `node dist/server.js`

### If "Database connection error"
1. **Configuration** → **Application settings**
2. **Verify:** `DATABASE_URL` includes `?sslmode=require`
3. **Check:** All variables from `backend/RAILWAY_VALUES.md` are set

## After Fixing

1. **Restart** the Web App (Overview → Restart)
2. **Check Log Stream** for "Server running on port 8080"
3. **Test:** `https://your-app.azurewebsites.net/health`

## What Success Looks Like

In **Log Stream**, you should see:
```
🚀 Server running on port 8080
📡 API available at http://localhost:8080/api
Database connected successfully
```

Then test:
- `https://your-app.azurewebsites.net/health` → Should return JSON
- `https://your-app.azurewebsites.net/api/health` → Should return JSON

## Still Need Help?

Share the **exact error message** from Log Stream and I'll help fix it!

