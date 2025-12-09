# Deploy to Railway via Dashboard (No CLI Needed!)

Since Railway CLI authentication is having issues, use the Dashboard method - it's actually easier!

## Step 1: Prepare Your Environment Variables

First, let's get all the values you'll need:

### 1. Generate JWT Secrets (if not done already)

```powershell
cd backend
npm run generate-secrets
```

**Save the output!** You'll need:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

### 2. Get Your Database URL

Your Supabase connection string should be in `backend/.env`:
```
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require
```

## Step 2: Create Railway Project via Dashboard

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Sign in to your account

2. **Create New Project**
   - Click **"New Project"** (top right)
   - Select **"Empty Project"**
   - Give it a name: `EsusuHub Backend` (or your choice)

3. **Add Service**
   - Click **"+ New"** in your project
   - Select **"Empty Service"**

## Step 3: Connect Your Code

### Option A: Deploy from Git (Recommended if Azure DevOps is supported)

1. In your service, go to **Settings** → **Source**
2. Click **"Connect Repo"**
3. If Azure DevOps is listed, connect it
4. Set **Root Directory**: `backend`
5. Railway will auto-detect the Dockerfile

### Option B: Deploy from GitHub (If you have a GitHub mirror)

1. Push your code to GitHub (if not already)
2. In Railway service, go to **Settings** → **Source**
3. Click **"Connect Repo"** → Select GitHub
4. Choose your repository
5. Set **Root Directory**: `backend`

### Option C: Manual Deploy (If Git not available)

1. In Railway service, go to **Settings** → **Deploy**
2. You can upload files or use Railway CLI later (once auth is fixed)

## Step 4: Set Environment Variables

In your Railway service:

1. Go to **Variables** tab
2. Click **"+ New Variable"** for each:

```
NODE_ENV=production
```

```
DATABASE_URL=postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres?sslmode=require
```
*(Replace with your actual Supabase connection string)*

```
JWT_SECRET=your-generated-secret-here
```
*(From Step 1)*

```
JWT_REFRESH_SECRET=your-generated-refresh-secret-here
```
*(From Step 1)*

```
PORT=5166
```

```
CORS_ORIGIN=*
```
*(Or specific origins like: https://your-frontend.com,http://localhost:3000)*

## Step 5: Deploy

1. Railway will automatically start building when you:
   - Connect a Git repo, OR
   - Save environment variables (if using manual deploy)

2. **Watch the build:**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Watch the logs

3. **Wait for "Deploy successful"** ✅

## Step 6: Get Your URL

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"** (if not auto-generated)
3. Copy your URL: `https://your-app.railway.app`

## Step 7: Test Your Deployment

```powershell
# Replace with your actual Railway URL
curl https://your-app.railway.app/health
```

Should return: `1` (or a health check response)

## Step 8: Update Frontend (Later)

Once deployed, update your React Native app to use the Railway URL:

1. Update `src/config/env.ts`:
   ```typescript
   API_BASE_URL: process.env.API_BASE_URL || 'https://your-app.railway.app/api'
   ```

## Troubleshooting

**"Build failed"**
- Check Railway logs in **Deployments** tab
- Verify Dockerfile exists in `backend/` directory
- Check environment variables are set correctly

**"Database connection failed"**
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Supabase password is correct
- Ensure Supabase allows connections from Railway IPs

**"Service not responding"**
- Check **Logs** tab for errors
- Verify `PORT` environment variable matches your code (5166)
- Check **Networking** tab to ensure domain is generated

## Next Steps

- ✅ Your backend is now live on Railway!
- 🔗 Share the URL with your frontend team
- 📊 Monitor usage in Railway Dashboard
- 🔄 Railway auto-deploys on every Git push (if connected)

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check `backend/docs/RAILWAY_SIMPLE_DEPLOY.md` for more details

