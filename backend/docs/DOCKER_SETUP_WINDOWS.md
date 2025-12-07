# Docker Setup for Windows

## The Problem

You're seeing this error:
```
ERROR: error during connect: in the default daemon configuration on Windows, the docker client must be run with elevated privileges to connect
```

This means Docker Desktop is not running or not installed.

## Solution 1: Start Docker Desktop

### Check if Docker Desktop is Installed

```powershell
docker --version
```

If you see a version number, Docker is installed but not running.

### Start Docker Desktop

1. **Open Docker Desktop:**
   - Press `Win` key
   - Type "Docker Desktop"
   - Click to open

2. **Wait for Docker to start:**
   - Look for Docker icon in system tray (bottom right)
   - Wait until it shows "Docker Desktop is running"
   - This can take 1-2 minutes

3. **Verify Docker is running:**
   ```powershell
   docker ps
   ```
   Should show an empty list (not an error)

### If Docker Desktop Won't Start

- **Check Windows requirements:**
  - Windows 10 64-bit: Pro, Enterprise, or Education (Build 15063+)
  - Windows 11 64-bit: Home or Pro
  - WSL 2 feature enabled
  - Virtualization enabled in BIOS

- **Enable WSL 2:**
  ```powershell
  # Run PowerShell as Administrator
  wsl --install
  ```

- **Restart your computer** after enabling WSL 2

## Solution 2: Install Docker Desktop

If Docker is not installed:

1. **Download Docker Desktop:**
   - Go to https://www.docker.com/products/docker-desktop
   - Download Docker Desktop for Windows

2. **Install:**
   - Run the installer
   - Follow the setup wizard
   - Restart your computer when prompted

3. **Start Docker Desktop:**
   - Open Docker Desktop from Start menu
   - Wait for it to fully start

4. **Verify:**
   ```powershell
   docker --version
   docker ps
   ```

## Solution 3: Deploy Without Docker (Railway Dashboard)

If you don't want to set up Docker locally, use Railway Dashboard:

### Railway Dashboard Deployment

1. **Go to Railway Dashboard:**
   - [railway.app](https://railway.app)
   - Sign in

2. **Create Project:**
   - **New Project** → **Empty Project**

3. **Add Service:**
   - **+ New** → **Empty Service**

4. **Connect Git (if Azure DevOps supported):**
   - **Settings** → **Source** → Connect repository
   - Set root directory: `backend`

5. **Or Upload Code:**
   - Railway can build from your Git repository
   - Or use Railway's web editor

6. **Set Environment Variables:**
   - Go to **Variables** tab
   - Add all required variables

7. **Deploy:**
   - Railway will build using Dockerfile automatically
   - No local Docker needed!

## Solution 4: Use Railway CLI (No Local Docker)

You can deploy without building Docker locally:

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Authenticate (get token from Railway Dashboard)
$env:RAILWAY_TOKEN="your-token"
railway whoami

# Deploy (Railway builds in the cloud)
cd backend
railway init
railway up
```

Railway will build the Docker image in the cloud - you don't need Docker locally!

## Recommended Approach

**For quickest deployment without Docker setup:**

1. ✅ Use Railway Dashboard (Method 3 above)
   - No Docker needed locally
   - No CLI authentication issues
   - Works immediately

2. ✅ Or use Railway CLI (Method 4 above)
   - Railway builds Docker in the cloud
   - No local Docker needed
   - Just need Railway CLI and token

## Verify Docker is Working

After starting Docker Desktop:

```powershell
# Check Docker version
docker --version

# Check Docker is running
docker ps

# Test Docker build (optional)
cd backend
docker build -t esusuhub-api .
```

## Troubleshooting

### "Docker daemon not running"
- Start Docker Desktop
- Wait for it to fully start (check system tray)
- Restart terminal after starting Docker

### "Access denied" or "Permission denied"
- Run PowerShell as Administrator
- Or ensure Docker Desktop is running with proper permissions

### "WSL 2 installation is incomplete"
- Install WSL 2: `wsl --install` (as Administrator)
- Restart computer
- Start Docker Desktop again

### "Virtualization not enabled"
- Enable virtualization in BIOS
- Restart computer
- Start Docker Desktop

## Quick Check Commands

```powershell
# Check if Docker is installed
docker --version

# Check if Docker is running
docker ps

# Check Docker Desktop process
Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue
```

## Next Steps

Once Docker is running (or if using Railway Dashboard):

1. ✅ Deploy to Railway
2. ✅ Set environment variables
3. ✅ Test your deployment

See [RAILWAY_SIMPLE_DEPLOY.md](./RAILWAY_SIMPLE_DEPLOY.md) for deployment steps.

