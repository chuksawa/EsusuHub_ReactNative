# App Not Reachable - Troubleshooting

## Error: "server IP address could not be found"

This usually means:
1. **App isn't running** (container not configured or failed to start)
2. **DNS not propagated** (if just created)
3. **App name is different** (check actual URL)

## Step 1: Verify App Name and URL

1. **Azure Portal** → Your Web App
2. **Overview** → **Default domain**
3. **Copy the exact URL** (should be something like `esusuhubappserver-xxxxx.azurewebsites.net`)

**Note:** The URL might be slightly different than what you typed!

## Step 2: Check App Status

1. **Overview** → Look at **Status**
2. **Should show:** "Running" (green)
3. **If it shows:** "Stopped" → Click **Start**

## Step 3: Verify Container Configuration

1. **Deployment Center** → **Containers** tab
2. **Check:**
   - Image source is set
   - Registry is selected
   - Image name is correct
   - Tag is `latest`

## Step 4: Check Logs

1. **Log Stream** (left menu)
2. **Look for errors:**
   - "Image pull failed"
   - "Container failed to start"
   - "Cannot connect to database"

## Step 5: Common Issues

### Issue: Container Not Configured

**Symptoms:**
- Deployment Center → Containers shows no configuration
- App shows default "your web app is running" page

**Fix:**
1. **Deployment Center** → **Containers**
2. **Configure container** (see Step 4 in main guide)
3. **Save**
4. **Wait 2-3 minutes** for container to pull and start

### Issue: Image Pull Failed

**Symptoms:**
- Log Stream shows "Image pull failed"
- "unauthorized" or "not found" errors

**Fix:**
1. **Check ACR admin user is enabled:**
   - ACR → **Settings** → **Access keys** → Admin user = **Enabled**
2. **Verify image exists:**
   ```powershell
   az acr repository show-tags --name esusuhubcontainer --repository esusuhub-backend
   ```
3. **Re-configure container** in Deployment Center

### Issue: Container Crashes on Start

**Symptoms:**
- Log Stream shows container starting then stopping
- "Exit code 1" or similar errors

**Fix:**
1. **Check environment variables are set**
2. **Check Log Stream** for specific error messages
3. **Verify DATABASE_URL is correct**
4. **Check PORT is set to 8080**

### Issue: DNS Not Resolved

**Symptoms:**
- "server IP address could not be found"
- App status shows "Running" but can't access

**Fix:**
1. **Wait 5-10 minutes** (DNS can take time)
2. **Try different browser** or incognito mode
3. **Check exact URL** from Overview → Default domain
4. **Try:** `http://` instead of `https://` (temporarily)

## Step 6: Restart App

If nothing works:

1. **Overview** → **Restart** (top menu)
2. **Wait 2-3 minutes**
3. **Try accessing again**

## Quick Checklist

- [ ] App status = "Running"
- [ ] Container configured in Deployment Center
- [ ] Environment variables set
- [ ] Using correct URL from Overview
- [ ] Checked Log Stream for errors
- [ ] Waited 5-10 minutes after configuration

## Next Steps

1. **Check app status** in Overview
2. **Verify container configuration** in Deployment Center
3. **Check Log Stream** for errors
4. **Share the exact error** from Log Stream if still not working

