# Railway CLI Login Troubleshooting

If you're having issues logging into Railway CLI, try these solutions:

## Issue: "Login session does not exist"

This happens when:
- The pairing code expires (they expire quickly)
- Browser authentication wasn't completed
- Network issues

### Solution 1: Try Login Again (Quick)

```bash
# Close any existing Railway CLI processes
# Then try login again
railway login

# Visit the URL immediately when it appears
# Complete authentication in browser quickly
```

### Solution 2: Use Browser Login

```bash
# Force browser to open
railway login --browserless=false

# Or try with explicit browser
railway login --browserless=false --browser chrome
```

### Solution 3: Use Token Authentication (Recommended)

Instead of interactive login, use a token:

1. **Get Railway Token from Dashboard:**
   - Go to [railway.app](https://railway.app)
   - Sign in to your account
   - Go to **Account Settings** → **Tokens** (or **Developer Settings**)
   - Click **"New Token"** or **"Create Token"**
   - Give it a name (e.g., "CLI Access")
   - Copy the token (save it securely - you won't see it again!)

2. **Login with Token:**
   ```bash
   railway login --token YOUR_TOKEN_HERE
   ```

3. **Or Set Token as Environment Variable:**
   ```bash
   # Windows PowerShell
   $env:RAILWAY_TOKEN="your-token-here"
   
   # Windows CMD
   set RAILWAY_TOKEN=your-token-here
   
   # Linux/Mac
   export RAILWAY_TOKEN=your-token-here
   ```

### Solution 4: Clear Railway CLI Cache

```bash
# Clear Railway CLI cache and try again
# Windows
Remove-Item -Recurse -Force $env:APPDATA\.railway

# Linux/Mac
rm -rf ~/.railway

# Then try login again
railway login
```

### Solution 5: Update Railway CLI

```bash
# Uninstall and reinstall
npm uninstall -g @railway/cli
npm install -g @railway/cli@latest

# Try login again
railway login
```

## Alternative: Deploy Without CLI Login

If CLI login continues to fail, you can deploy using other methods:

### Option A: Railway Dashboard (No CLI needed)

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect your Azure DevOps repo (if supported)
4. Or use Railway's web-based deployment

### Option B: Use Railway API Directly

You can use Railway's REST API with your token:

```bash
# Set your token
$env:RAILWAY_TOKEN="your-token"

# Use Railway API via curl or HTTP client
# See Railway API docs: https://docs.railway.app/reference/api
```

### Option C: Docker Build & Push

Build locally and push to Railway registry:

```bash
# Build Docker image
docker build -t esusuhub-api ./backend

# Get Railway registry credentials from dashboard
# Service → Settings → Registry

# Tag and push
docker tag esusuhub-api:latest registry.railway.app/your-service:latest
docker login registry.railway.app
docker push registry.railway.app/your-service:latest
```

## Verify Login

After successful login, verify:

```bash
# Check if you're logged in
railway whoami

# Should show your Railway username/email
```

## Common Issues

### "Command not found: railway"
- Install: `npm install -g @railway/cli`
- Verify: `railway --version`

### "Permission denied"
- On Windows: Run PowerShell as Administrator
- On Linux/Mac: May need `sudo` for global install

### "Network timeout"
- Check internet connection
- Try again later (Railway servers might be busy)
- Use token authentication instead

## Getting Help

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- Railway Support: https://railway.app/support

