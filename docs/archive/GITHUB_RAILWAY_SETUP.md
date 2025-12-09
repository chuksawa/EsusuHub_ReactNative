# Migrate to GitHub and Deploy to Railway

This guide will help you migrate your code from Azure DevOps to GitHub and deploy to Railway.

## Step 1: Create GitHub Repository

1. **Go to GitHub:** https://github.com
2. **Click "+" (top right)** → **"New repository"**
3. **Repository details:**
   - **Name:** `EsusuHub_ReactNative` (or your choice)
   - **Description:** "EsusuHub React Native App with Backend API"
   - **Visibility:** Private (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (we have these)
4. **Click "Create repository"**
5. **Copy the repository URL** (e.g., `https://github.com/yourusername/EsusuHub_ReactNative.git`)

## Step 2: Prepare Your Local Repository

### Check Current Git Status

```powershell
cd C:\Dev\EsusuHub_ReactNative
git status
```

### If Not a Git Repository

If you see "not a git repository", initialize it:

```powershell
git init
git add .
git commit -m "Initial commit - EsusuHub React Native app"
```

### If Already a Git Repository

If you have uncommitted changes:

```powershell
git add .
git commit -m "Prepare for GitHub migration"
```

## Step 3: Add GitHub Remote

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```powershell
# Remove existing remote (if any)
git remote remove origin

# Add GitHub remote
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git

# Verify
git remote -v
```

## Step 4: Push to GitHub

```powershell
# Push all branches
git push -u origin main

# If your default branch is 'master' instead of 'main':
git branch -M main
git push -u origin main
```

**Note:** You may be prompted for GitHub credentials. Use a Personal Access Token (PAT) if 2FA is enabled.

## Step 5: Create GitHub Personal Access Token (If Needed)

If you need to authenticate:

1. **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. **Scopes:** Check `repo` (full control of private repositories)
4. **Generate token**
5. **Copy token** (you won't see it again!)
6. **Use as password** when pushing

## Step 6: Connect GitHub to Railway

1. **Go to Railway Dashboard:** https://railway.app
2. **Your Project** → **Your Service**
3. **Settings** → **Source**
4. **Click "Connect Repo"** or **"Change Source"**
5. **Select "GitHub"**
6. **Authorize Railway** to access your GitHub account
7. **Select your repository:** `EsusuHub_ReactNative`
8. **Set Root Directory:** `backend`
9. **Railway will auto-detect the Dockerfile**

## Step 7: Verify Railway Configuration

1. **Settings** → **Source:**
   - ✅ Repository: `yourusername/EsusuHub_ReactNative`
   - ✅ Branch: `main` (or `master`)
   - ✅ Root Directory: `backend`

2. **Settings** → **Build:**
   - ✅ Dockerfile Path: `backend/Dockerfile` (auto-detected)
   - ✅ Build Command: (empty - Dockerfile handles it)

3. **Variables** tab:
   - ✅ All environment variables are set (from before)

## Step 8: Trigger Deployment

Railway should automatically deploy when you:
- Push to the connected branch, OR
- Click **"Redeploy"** in Settings → General

**Watch the Deployments tab** for build progress!

## Step 9: Verify Deployment

1. **Deployments** tab → Latest deployment
   - Should show: "Building Docker image..."
   - Then: "Deploy successful"

2. **Logs** tab:
   - Look for: "Server running on port..."
   - Look for: "Database connected successfully"

3. **Get your URL:**
   - Settings → Networking → Copy domain
   - Test: `curl https://your-app.railway.app/health`

## Troubleshooting

### "Repository not found"
- Check repository name is correct
- Verify Railway has access to your GitHub account
- Ensure repository is not private (or Railway has access)

### "Build failed"
- Check Deployments tab for errors
- Verify `backend/Dockerfile` exists
- Check Root Directory is set to `backend`

### "Service offline"
- Check Logs tab for runtime errors
- Verify environment variables are set
- Check database connection

## Next Steps

- ✅ Code is now on GitHub
- ✅ Railway auto-deploys on every push
- ✅ Update frontend to use Railway URL
- ✅ Monitor deployments in Railway Dashboard

## Benefits of GitHub + Railway

- ✅ **Auto-deploy** on every Git push
- ✅ **Build logs** visible in Railway
- ✅ **Easy rollback** to previous deployments
- ✅ **Branch deployments** (optional)
- ✅ **Better integration** than Azure DevOps

