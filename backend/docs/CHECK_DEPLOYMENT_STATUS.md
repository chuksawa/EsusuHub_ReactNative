# How to Check Railway Deployment Status

## Where to Look in Railway Dashboard

### Step 1: Check Deployment Status

1. **Go to your Railway project**
   - Visit: https://railway.app
   - Click on your project (e.g., "EsusuHub Backend")

2. **Check the Service Status**
   - You should see your service card
   - Look for status indicators:
     - 🟡 **"Building"** - Deployment in progress
     - 🟢 **"Active"** - Deployment successful
     - 🔴 **"Failed"** - Deployment error
     - ⚪ **"Inactive"** - Service stopped

### Step 2: View Build Logs

1. **Click on your service** (the service card)
2. **Go to "Deployments" tab** (top navigation)
3. **Click on the latest deployment** (most recent at the top)
4. **View the logs** - You'll see:
   - Build progress
   - Docker build steps
   - Any errors or warnings

### Step 3: Check Runtime Logs

1. **In your service, go to "Logs" tab**
2. **Watch real-time logs** - Shows:
   - Server startup messages
   - Database connection attempts
   - API requests
   - Errors

## What to Look For

### ✅ Good Signs (Deployment Working)

```
✅ Building Docker image...
✅ Installing dependencies...
✅ Compiling TypeScript...
✅ Starting server...
✅ Database connected successfully
✅ Server running on port 5166
```

### ⚠️ Warning Signs (May Need Attention)

```
⚠️  Database connection timeout (check DATABASE_URL)
⚠️  Missing environment variable (add to Variables tab)
⚠️  Port binding issue (check PORT variable)
```

### ❌ Error Signs (Deployment Failed)

```
❌ Build failed: Cannot find module...
❌ Database connection error
❌ Port already in use
❌ Invalid environment variable
```

## Quick Status Check

### Option 1: Railway Dashboard (Easiest)

1. Go to your service
2. Look at the **status indicator** (colored dot/circle)
3. Check **"Deployments"** tab for latest status
4. View **"Logs"** tab for runtime output

### Option 2: Check Service URL

Once deployed, Railway generates a domain:

1. Go to **Settings** → **Networking**
2. Look for **"Domain"** or **"Generate Domain"**
3. Copy the URL (e.g., `https://your-app.railway.app`)
4. Test it:
   ```powershell
   curl https://your-app.railway.app/health
   ```
   Should return: `1` or a health check response

### Option 3: Railway CLI (If Auth Works)

```powershell
railway status
railway logs
railway domain
```

## Common Deployment Stages

Railway goes through these stages:

1. **🔨 Building** (1-3 minutes)
   - Installing dependencies
   - Building Docker image
   - Compiling TypeScript

2. **🚀 Deploying** (30 seconds - 1 minute)
   - Starting container
   - Running health checks

3. **✅ Active** (Running)
   - Service is live
   - Accepting requests

## Troubleshooting

### "Build Failed"

**Check:**
- Go to **Deployments** tab → Click latest deployment
- Scroll through logs to find error
- Common issues:
  - Missing `Dockerfile` in `backend/` directory
  - TypeScript compilation errors
  - Missing dependencies

**Fix:**
- Verify `backend/Dockerfile` exists
- Check `backend/package.json` has all dependencies
- Review build logs for specific error

### "Service Not Responding"

**Check:**
- Go to **Logs** tab
- Look for:
  - "Server running on port..."
  - "Database connected..."
  - Any error messages

**Fix:**
- Verify `PORT=5166` in Variables
- Check `DATABASE_URL` is correct
- Ensure all required env vars are set

### "Database Connection Failed"

**Check:**
- Verify `DATABASE_URL` in Variables tab
- Check Supabase allows connections from Railway
- Look for SSL errors in logs

**Fix:**
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Verify Supabase password is correct
- Check Supabase dashboard for connection logs

## Next Steps After Deployment

Once you see **"Active"** status:

1. **Get your URL:**
   - Settings → Networking → Copy domain

2. **Test the API:**
   ```powershell
   curl https://your-app.railway.app/health
   ```

3. **Update frontend:**
   - Update `src/config/env.ts` with Railway URL

4. **Monitor:**
   - Keep Logs tab open to watch for errors
   - Check Metrics tab for usage stats

## Need Help?

- **Railway Status Page:** https://status.railway.app
- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway

