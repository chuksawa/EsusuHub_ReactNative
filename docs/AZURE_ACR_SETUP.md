# Azure Container Registry (ACR) Setup

## Step-by-Step Guide for Container Deployment

### Step 1: Create Azure Container Registry

1. **Azure Portal** → **Create a resource** (top left)
2. **Search:** "Container Registry"
3. **Click "Container Registry"** → **Create**
4. **Fill in:**
   - **Registry name:** `esusuhubcontainer` (must be globally unique, lowercase, alphanumeric)
   - **Resource group:** Same as your web app (or create new)
   - **Location:** Same region as your web app (recommended)
   - **SKU:** **Basic** (cheapest, $5/month)
5. **Review + Create** → **Create**
6. **Wait for deployment** (1-2 minutes)

### Step 2: Enable Admin User (Required for Push)

1. **Azure Portal** → Your Container Registry (`esusuhubcontainer`)
2. **Settings** → **Access keys** (left menu)
3. **Admin user:** Click **Enable**
4. **Save** the username and password (you'll need them!)

### Step 3: Install Azure CLI (If Not Already Installed)

**Check if installed:**
```powershell
az --version
```

**If not installed:**
```powershell
# Install via winget
winget install -e --id Microsoft.AzureCLI
```

**Or download from:** https://aka.ms/installazurecliwindows

### Step 4: Login to Azure CLI

```powershell
az login
```

This will open a browser - sign in with your Azure account.

### Step 5: Login to ACR

```powershell
az acr login --name esusuhubcontainer
```

Replace `esusuhubcontainer` with your actual registry name if different.

### Step 6: Build Docker Image Locally

```powershell
# Navigate to project root
cd C:\Dev\EsusuHub_ReactNative

# Build the image
docker build -t esusuhubcontainer.azurecr.io/esusuhub-backend:latest -f backend/Dockerfile backend
```

**Note:** Replace `esusuhubcontainer` with your actual registry name.

### Step 7: Push Image to ACR

```powershell
docker push esusuhubcontainer.azurecr.io/esusuhub-backend:latest
```

**This will:**
- Upload your Docker image to Azure Container Registry
- Take a few minutes depending on image size
- Show progress as it uploads

### Step 8: Configure App Service to Use ACR

1. **Azure Portal** → Your Web App (`esusuhubappserver`)
2. **Deployment Center** → **Containers** tab
3. **Configure:**
   - **Image source:** Azure Container Registry
   - **Registry:** Select your registry (`esusuhubcontainer`)
   - **Image:** `esusuhub-backend`
   - **Tag:** `latest`
   - **Continuous Deployment:** Enable (optional, for auto-updates)
4. **Click "Save"**

**Note:** Azure will automatically use the admin credentials you enabled in Step 2.

### Step 9: Set Environment Variables

1. **Configuration** → **Application settings**
2. **Add new application setting** for each:

```
NODE_ENV = production
PORT = 8080
DATABASE_URL = postgresql://postgres:sieQK72VRwSbZEiJ@db.tsfvtkvkejjbxjuiixgx.supabase.co:5432/postgres?sslmode=require
JWT_SECRET = ede315d278c155c2f594397365395d1d1b36fc70ff2ce50c3b03cc67b60fe169a9c68d44cd3fd16b858b4a753adedba204eaf102700694de0fb678883d91474d
JWT_REFRESH_SECRET = 5f836eeeefdd17d622eaa0c1c2a3b19944b6d6bef8daf0c7b0813b361f8b45bf0211038291354854d7457a0c4214a381fbb113917ade191b8ec01c86203b9d28
CORS_ORIGIN = *
```

3. **Deployment slot setting:** **UNCHECKED** for all
4. **Save**

### Step 10: Verify Deployment

1. **Overview** → **Default domain** (copy the URL)
2. **Test:** Open `https://your-app.azurewebsites.net/health` in browser
3. **Should see:** `{"status":"ok","timestamp":"..."}`

### Step 11: Check Logs (If Issues)

1. **Log Stream** (left menu)
2. **Should see:**
   ```
   🚀 Server running on port 8080
   📡 API available at http://localhost:8080/api
   ```

## Troubleshooting

### "az: command not found"
- Install Azure CLI (Step 3)
- Restart PowerShell after installation

### "unauthorized: authentication required"
- Make sure you enabled admin user (Step 2)
- Try logging in again: `az acr login --name esusuhubcontainer`

### "docker: command not found"
- Install Docker Desktop: https://www.docker.com/products/docker-desktop
- Make sure Docker is running

### "Image pull failed" in App Service
- Check ACR admin user is enabled
- Verify image name and tag are correct
- Check **Deployment Center** → **Logs** for detailed error

### "Registry name already taken"
- Try a different name (must be globally unique)
- Use lowercase, alphanumeric, 5-50 characters

## Quick Reference Commands

```powershell
# Login to Azure
az login

# Login to ACR
az acr login --name esusuhubcontainer

# Build image
docker build -t esusuhubcontainer.azurecr.io/esusuhub-backend:latest -f backend/Dockerfile backend

# Push image
docker push esusuhubcontainer.azurecr.io/esusuhub-backend:latest

# List images in ACR
az acr repository list --name esusuhubcontainer

# View image tags
az acr repository show-tags --name esusuhubcontainer --repository esusuhub-backend
```

## Next Steps (Optional): Set Up CI/CD Pipeline

After manual deployment works, you can set up automatic deployments:

1. **Azure DevOps** → Create pipeline
2. **Build and push** on every Git push
3. **Auto-update** app service

See `docs/AZURE_CONTAINER_DEPLOYMENT.md` for pipeline setup.

## Summary

✅ **Create ACR** → Enable admin user
✅ **Build image** → Push to ACR
✅ **Configure app** → Pull from ACR
✅ **Set env vars** → Test!

Your app should now be running! 🎉

