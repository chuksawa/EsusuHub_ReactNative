# Quick Deploy to Railway

The fastest way to deploy your backend to Railway.

## Prerequisites

1. **Railway account** - Sign up at [railway.app](https://railway.app)
2. **Supabase connection string** - Get from Supabase Dashboard
3. **JWT secrets** - Generate with `npm run generate-secrets`

## Method 1: Using Deploy Script (Fastest)

1. **Generate secrets:**
   ```powershell
   cd backend
   npm run generate-secrets
   ```
   Save the output!

2. **Get Railway token:**
   - Go to Railway Dashboard → Account Settings → Tokens
   - Create new token
   - Copy it

3. **Set token and deploy:**
   ```powershell
   $env:RAILWAY_TOKEN="your-token-here"
   .\deploy.ps1
   ```

That's it! The script will:
- ✅ Check Railway CLI is installed
- ✅ Initialize Railway project (if needed)
- ✅ Build and deploy your app
- ✅ Show you next steps

## Method 2: Manual Railway CLI (No Docker Needed!)

**Note:** Railway CLI builds Docker in the cloud - you don't need Docker Desktop!

1. **Install Railway CLI:**
   ```powershell
   npm install -g @railway/cli
   ```

2. **Authenticate with Railway:**
   
   **Option A: Use Token (Recommended)**
   ```powershell
   # Get token from Railway Dashboard → Account Settings → Tokens
   $env:RAILWAY_TOKEN="your-token-here"
   railway whoami  # Verify authentication
   ```
   
   **Option B: Browser Login (If token doesn't work)**
   ```powershell
   railway login --browserless
   # Visit URL IMMEDIATELY and enter pairing code quickly!
   railway whoami  # Verify authentication
   ```

3. **Initialize and deploy:**
   ```powershell
   cd backend
   railway init
   railway up  # Railway builds Docker in the cloud - no local Docker needed!
   ```

4. **Set environment variables:**
   ```powershell
   railway variables set NODE_ENV=production
   railway variables set DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require"
   railway variables set JWT_SECRET="your-secret"
   railway variables set JWT_REFRESH_SECRET="your-refresh-secret"
   ```

## Method 3: Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. **New Project** → **Empty Project**
3. **+ New** → **Empty Service**
4. **Settings** → **Source** → Set root directory: `backend`
5. **Variables** → Add all environment variables
6. Railway will auto-deploy

## Get Your Railway Token

1. Go to [railway.app](https://railway.app)
2. Click your profile (top right)
3. **Account Settings** → **Tokens**
4. **New Token** → Name it (e.g., "Local Deploy")
5. **Copy token** (you won't see it again!)

## Environment Variables Needed

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:sieQK72VRwSbZEiJ@db.tsfvtkvkejjbxjuiixgx.supabase.co:5432/postgres?sslmode=require
JWT_SECRET=20bda3ebb3ba9453e0519426ceb078689bf521007e10732820724e4970700b5ddfe1e0b9f10a1a550d5f70311d556d58bb37abb209bc1abe5aaa7c0ee3d1d097
JWT_REFRESH_SECRET=a2a382d6ad6c726c746084eff2a082074c0b0cd3c21b7fb1c94dc44fc2feafa7f296f29272714815369753719a6b77bc4101257f1fba4deb2ecf2e490840d292
API_BASE_URL=https://tsfvtkvkejjbxjuiixgx.supabase.co
CORS_ORIGIN=https://your-frontend.com,http://localhost:3000
```

## After Deployment

1. **Get your URL:**
   ```powershell
   railway domain
   ```
   Or check Railway Dashboard → Settings → Networking

2. **Test it:**
   ```powershell
   curl https://your-app.railway.app/health-quick
   ```

3. **Update frontend:**
   - Update `src/config/env.ts` with your Railway URL

## Troubleshooting

**"Railway CLI not found"**
```powershell
npm install -g @railway/cli
```

**"Authentication failed"**
- Use token method: `$env:RAILWAY_TOKEN="your-token"`
- Get token from Railway Dashboard

**"Build failed"**
- Check Railway logs: `railway logs`
- Verify Dockerfile exists in `backend/`

**"Database connection failed"**
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Supabase password is correct

## Need More Help?

- See [RAILWAY_SIMPLE_DEPLOY.md](./RAILWAY_SIMPLE_DEPLOY.md) for detailed guide
- See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for complete documentation

