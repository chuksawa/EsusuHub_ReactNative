# Quick Guide: Migrate to GitHub

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `EsusuHub_ReactNative`
3. Description: "EsusuHub React Native App with Backend API"
4. Choose: **Private** (recommended) or Public
5. **DO NOT** check "Initialize with README" (we already have files)
6. Click **"Create repository"**
7. **Copy the repository URL** (e.g., `https://github.com/YOUR_USERNAME/EsusuHub_ReactNative.git`)

## Step 2: Add GitHub Remote

After creating the repo, run these commands (replace YOUR_USERNAME):

```powershell
# Add GitHub as a new remote (keep Azure DevOps as backup)
git remote add github https://github.com/YOUR_USERNAME/EsusuHub_ReactNative.git

# Or replace origin with GitHub:
# git remote set-url origin https://github.com/YOUR_USERNAME/EsusuHub_ReactNative.git
```

## Step 3: Push to GitHub

```powershell
# Push to GitHub
git push -u github main

# If prompted for credentials:
# - Username: your GitHub username
# - Password: Use a Personal Access Token (see Step 4)
```

## Step 4: Create GitHub Personal Access Token (If Needed)

If GitHub asks for a password:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `Railway Deployment`
4. Expiration: 90 days (or your choice)
5. Scopes: Check **`repo`** (full control)
6. Click **"Generate token"**
7. **Copy the token** (you won't see it again!)
8. Use this token as your password when pushing

## Step 5: Connect to Railway

1. Railway Dashboard → Your Service
2. Settings → Source
3. Click **"Connect Repo"** or **"Change Source"**
4. Select **"GitHub"**
5. Authorize Railway
6. Select: `YOUR_USERNAME/EsusuHub_ReactNative`
7. Set **Root Directory:** `backend`
8. Railway will auto-deploy!

## Done! 🎉

Railway will now:
- ✅ Auto-deploy on every `git push`
- ✅ Show build logs in Dashboard
- ✅ Keep your service online

