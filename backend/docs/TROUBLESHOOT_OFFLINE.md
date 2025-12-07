# Troubleshooting "Offline" Status in Railway

When your Railway service shows "Offline", follow these steps:

## Step 1: Check Deployment Logs

1. **Go to Railway Dashboard**
   - Click on your service
   - Go to **"Deployments"** tab
   - Click on the **latest deployment**
   - Scroll through the logs

**Look for:**
- ❌ Build errors
- ❌ Missing files
- ❌ TypeScript compilation errors
- ❌ Missing dependencies

## Step 2: Check Runtime Logs

1. **In your service, go to "Logs" tab**
2. **Look for error messages**

**Common errors:**
- `Error: Cannot find module...`
- `Database connection error`
- `Port already in use`
- `Missing environment variable`

## Step 3: Verify Environment Variables

Go to **Variables** tab and verify ALL are set:

### Required Variables:

✅ **NODE_ENV**
```
NODE_ENV=production
```

✅ **PORT**
```
PORT=5166
```
*(Railway may override this - that's OK)*

✅ **DATABASE_URL**
```
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require
```
*(Must include `?sslmode=require`)*

✅ **JWT_SECRET**
```
JWT_SECRET=your-secret-here
```

✅ **JWT_REFRESH_SECRET**
```
JWT_REFRESH_SECRET=your-refresh-secret-here
```

✅ **CORS_ORIGIN** (Optional but recommended)
```
CORS_ORIGIN=*
```

## Step 4: Common Issues & Fixes

### Issue 1: "Cannot find module 'dist/server.js'"

**Cause:** Build failed or TypeScript didn't compile

**Fix:**
- Check **Deployments** tab for build errors
- Verify `Dockerfile` is in `backend/` directory
- Check that `tsconfig.json` exists

### Issue 2: "Database connection error"

**Cause:** Wrong DATABASE_URL or Supabase not allowing connections

**Fix:**
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Supabase password is correct
- Ensure Supabase allows connections from Railway IPs
- Check Supabase dashboard for connection logs

### Issue 3: "Port already in use" or "EADDRINUSE"

**Cause:** Port conflict (rare on Railway)

**Fix:**
- Railway sets `PORT` automatically - don't hardcode it
- Verify your code uses `process.env.PORT || 5166`
- Check `PORT` variable is set (even if Railway overrides it)

### Issue 4: "Missing environment variable"

**Cause:** Required env var not set

**Fix:**
- Check **Variables** tab
- Ensure all required variables are present
- No typos in variable names (case-sensitive!)

### Issue 5: Service starts then crashes

**Cause:** Runtime error after startup

**Fix:**
- Check **Logs** tab for error messages
- Look for stack traces
- Common causes:
  - Database connection timeout
  - Invalid JWT secret format
  - Missing file permissions

## Step 5: Verify Service Configuration

1. **Check Root Directory:**
   - Go to **Settings** → **Source**
   - Verify **Root Directory** is set to: `backend`
   - (Not empty, not `/`, should be `backend`)

2. **Check Dockerfile:**
   - Verify `Dockerfile` exists in `backend/` directory
   - Railway should auto-detect it

3. **Check Build Settings:**
   - **Settings** → **Build**
   - Should auto-detect Dockerfile
   - Build command should be automatic

## Step 6: Restart the Service

Sometimes a simple restart fixes issues:

1. Go to **Settings** → **General**
2. Click **"Restart"** or **"Redeploy"**
3. Watch the **Logs** tab for startup messages

## Step 7: Check Railway Status

1. Visit: https://status.railway.app
2. Check if Railway is experiencing issues

## Step 8: Review Build Logs in Detail

In **Deployments** tab, look for:

### Successful Build Should Show:
```
✅ Building Docker image...
✅ Installing dependencies...
✅ Compiling TypeScript...
✅ Build successful
```

### Failed Build Will Show:
```
❌ Error: ...
❌ Failed to build
```

## Quick Diagnostic Commands

If you can access Railway CLI (if auth works):

```powershell
railway logs --tail 100
railway status
railway variables
```

## Still Offline?

1. **Check the exact error message** in Logs tab
2. **Take a screenshot** of the error
3. **Check Railway Status:** https://status.railway.app
4. **Try redeploying:**
   - Settings → General → Redeploy
   - Or trigger a new deployment

## Need More Help?

- **Railway Discord:** https://discord.gg/railway
- **Railway Docs:** https://docs.railway.app
- **Check build logs** in Deployments tab for specific errors

