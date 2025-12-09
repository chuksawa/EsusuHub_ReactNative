# Setup New Container-Based Web App

## Your New App: esusuhubappserver

✅ **Container deployment** - Perfect! This will use Docker automatically.

## Step 1: Connect to Azure DevOps

1. **Azure Portal** → Your new Web App (`esusuhubappserver`)
2. **Deployment Center** (left menu)
3. **Source:** Select **"Azure Repos"**
4. **Organization:** Your Azure DevOps organization
5. **Project:** EsusuHub
6. **Repository:** EsusuHub_ReactNative
7. **Branch:** main
8. **Click "Save"**

## Step 2: Configure Docker Settings

1. **Deployment Center** → **Settings** (after connecting repo)
2. **Build provider:** Should show **"Docker Container"** (since you selected container)
3. **Dockerfile path:** `backend/Dockerfile`
4. **Save**

## Step 3: Set Environment Variables

1. **Configuration** → **Application settings**
2. **Add all variables** from `backend/RAILWAY_VALUES.md`:

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

## Step 4: Configure Startup (Optional)

Since you're using Docker:
- **Configuration** → **General settings**
- **Startup Command:** Leave **EMPTY** (Dockerfile CMD handles it)
- OR: `npm start` (if needed)

## Step 5: Deploy

1. **Deployment Center** → **Sync**
2. **OR** push to Git: `git push origin main`
3. **Watch Deployment Center → Logs**

## What Happens with Docker

Docker will automatically:
1. **Copy** files** from `backend/`
2. **Install dependencies** (`npm ci`)
3. **Build TypeScript** (`npm run build`)
4. **Start server** (`node dist/server.js`)

No need for `POST_BUILD_COMMAND` - Dockerfile handles everything!

## Verify Deployment

### Check Build Logs:

1. **Deployment Center** → **Logs**
2. **Look for:**
   - "Building Docker image..."
   - "Installing dependencies..."
   - "Building TypeScript..."
   - "Build successful"

### Check Files:

1. **Advanced Tools (Kudu)** → **Go**
2. **Debug console** → **CMD**
3. ```cmd
   cd site\wwwroot
   dir dist
   ```
4. **Should see:** `dist/server.js`

### Check Server:

1. **Log Stream** (left menu)
2. **Should see:**
   ```
   🚀 Server running on port 8080
   📡 API available at http://localhost:8080/api
   ```

## Get Your URL

1. **Overview** → **Default domain**
2. **Copy the URL** (e.g., `https://esusuhubappserver.azurewebsites.net`)
3. **Test:** `https://your-app.azurewebsites.net/health`

## Configuration Checklist

- [ ] **Deployment Center** → Connected to Azure DevOps
- [ ] **Deployment Center** → **Settings** → Dockerfile path: `backend/Dockerfile`
- [ ] **Configuration** → **Application settings** → All env vars set
- [ ] **Configuration** → **General settings** → Stack: Docker
- [ ] **Deployment Center** → **Sync** (trigger deployment)

## Differences from Old App

✅ **No POST_BUILD_COMMAND needed** - Docker handles it
✅ **No SCM_REPOSITORY_PATH needed** - Docker handles it
✅ **No startup command issues** - Dockerfile CMD handles it
✅ **More reliable** - Docker builds everything correctly

## Next Steps

1. ✅ **Connect Azure DevOps** (Deployment Center)
2. ✅ **Set Dockerfile path** (`backend/Dockerfile`)
3. ✅ **Add environment variables**
4. ✅ **Deploy!**

Your new container-based app should work much better! 🎉

