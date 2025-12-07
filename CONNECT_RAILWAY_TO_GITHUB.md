# Connect Railway to GitHub - Step by Step

Your code is now on GitHub! ✅
Repository: https://github.com/chuksawa/EsusuHub_ReactNative

## Step 1: Connect GitHub to Railway

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Sign in to your account

2. **Open Your Project**
   - Click on your EsusuHub project
   - Click on your service (or create a new one)

3. **Connect Repository**
   - Go to **Settings** → **Source**
   - Click **"Connect Repo"** or **"Change Source"**
   - Select **"GitHub"**

4. **Authorize Railway**
   - You'll be redirected to GitHub
   - Click **"Authorize Railway"** or **"Install Railway"**
   - Grant Railway access to your repositories
   - You may need to select which repositories Railway can access
   - Select: **"chuksawa/EsusuHub_ReactNative"** or **"All repositories"**

5. **Select Repository**
   - After authorization, you'll return to Railway
   - Select: **chuksawa/EsusuHub_ReactNative**
   - Branch: **main** (should be auto-selected)

6. **Set Root Directory**
   - **Root Directory:** `backend`
   - This tells Railway where your Dockerfile is

7. **Save/Deploy**
   - Railway should automatically detect the Dockerfile
   - It will start building immediately!

## Step 2: Verify Configuration

Check these settings:

**Settings → Source:**
- ✅ Repository: `chuksawa/EsusuHub_ReactNative`
- ✅ Branch: `main`
- ✅ Root Directory: `backend`

**Settings → Build:**
- ✅ Dockerfile Path: `backend/Dockerfile` (auto-detected)
- ✅ Build Command: (empty - Dockerfile handles it)

**Variables Tab:**
- ✅ All environment variables are set (from before)

## Step 3: Watch the Deployment

1. **Deployments Tab**
   - Click on the latest deployment
   - Watch the build logs:
     - "Building Docker image..."
     - "Installing dependencies..."
     - "Compiling TypeScript..."
     - "Deploy successful" ✅

2. **Logs Tab** (after build)
   - Look for: "Server running on port..."
   - Look for: "Database connected successfully"

## Step 4: Get Your URL

1. **Settings** → **Networking**
2. Click **"Generate Domain"** (if not auto-generated)
3. Copy your URL: `https://your-app.railway.app`
4. Test it:
   ```powershell
   curl https://your-app.railway.app/health
   ```

## Success! 🎉

Railway will now:
- ✅ **Auto-deploy** on every `git push` to `main`
- ✅ **Show build logs** in Dashboard
- ✅ **Keep your service online**

## Future Deployments

Every time you push to GitHub:
```powershell
git add .
git commit -m "Your changes"
git push github main
```

Railway will automatically:
1. Detect the push
2. Build a new Docker image
3. Deploy the new version
4. Keep the old version running until the new one is ready

## Troubleshooting

**"Repository not found"**
- Make sure you authorized Railway to access your GitHub account
- Check repository name: `chuksawa/EsusuHub_ReactNative`

**"Build failed"**
- Check Deployments tab for errors
- Verify Root Directory is `backend`
- Check that `backend/Dockerfile` exists

**"Service offline"**
- Check Logs tab for runtime errors
- Verify environment variables are set
- Check database connection

