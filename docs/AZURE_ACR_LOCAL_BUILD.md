# Build and Push Docker Image from Local Machine

## Important: Use Your Local Windows Terminal

**Azure Cloud Shell doesn't support Docker!** You need to run these commands on your **local Windows machine** where Docker Desktop is installed.

## Step 1: Open Local PowerShell

1. **Open PowerShell** on your Windows machine (not Azure Cloud Shell)
2. **Navigate to your project:**
   ```powershell
   cd C:\Dev\EsusuHub_ReactNative
   ```

## Step 2: Verify Docker is Running

```powershell
docker --version
```

**If Docker is not installed:**
- Download Docker Desktop: https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop
- Make sure it's running (icon in system tray)

## Step 3: Login to Azure

```powershell
az login
```

This will open a browser - sign in with your Azure account.

## Step 4: Login to ACR

```powershell
az acr login --name esusuhubcontainer
```

**Your ACR name:** `esusuhubcontainer`

## Step 5: Build Docker Image

```powershell
docker build -t esusuhubcontainer.azurecr.io/esusuhub-backend:latest -f backend/Dockerfile backend
```

**This will:**
- Build your Docker image locally
- Tag it for your ACR
- Take a few minutes

## Step 6: Push to ACR

```powershell
docker push esusuhubcontainer.azurecr.io/esusuhub-backend:latest
```

**This will:**
- Upload your image to Azure Container Registry
- Show progress as it uploads
- Take a few minutes depending on image size

## Alternative: If You Must Use Cloud Shell

If you can't use your local machine, you can:

1. **Get ACR token:**
   ```bash
   az acr login -n esusuhubcontainer --expose-token
   ```

2. **Use the token** to authenticate Docker on your local machine:
   ```powershell
   # On your local machine
   docker login esusuhubcontainer.azurecr.io -u 00000000-0000-0000-0000-000000000000 -p <TOKEN>
   ```

But it's **much easier** to just use your local Windows PowerShell!

## Summary

✅ **Use local Windows PowerShell** (not Azure Cloud Shell)
✅ **Make sure Docker Desktop is running**
✅ **Run the commands above**
✅ **Then configure your app** (Step 4 in Azure Portal)

