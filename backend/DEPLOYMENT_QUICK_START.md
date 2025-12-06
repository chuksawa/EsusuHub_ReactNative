# Quick Start: Deploy to Railway

This is a quick reference guide. For detailed instructions, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md).

## 🚀 Quick Deployment Steps

### 1. Prepare Your Secrets

Generate secure JWT secrets:
```bash
cd backend
npm run generate-secrets
```

Save the output - you'll need these for Railway environment variables.

### 2. Get Your Supabase Connection String

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Under **Connection string**, select **Transaction** mode
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your actual database password

Example:
```
postgresql://postgres:your_password@db.abcdefghijklmnop.supabase.co:5432/postgres?sslmode=require
```

### 3. Deploy to Railway

#### Option A: Via Railway Dashboard (Easiest)

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from Git repo"**
3. Select your Git provider:
   - **GitHub**: Select repository directly
   - **Azure DevOps**: See [AZURE_DEVOPS_RAILWAY.md](./AZURE_DEVOPS_RAILWAY.md) for detailed instructions
   - **GitLab/Bitbucket**: Similar process
4. Railway will auto-detect the `backend` folder and Dockerfile
5. Go to your service → **Variables** tab
6. Add these environment variables:

```env
NODE_ENV=production
PORT=5166
DATABASE_URL=postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres?sslmode=require
JWT_SECRET=paste_your_generated_secret_here
JWT_REFRESH_SECRET=paste_your_generated_secret_here
API_BASE_URL=https://your-app.railway.app/api
CORS_ORIGIN=https://your-frontend.com,http://localhost:3000
```

7. Railway will automatically deploy!

#### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize (in backend directory)
cd backend
railway init

# Set environment variables
railway variables set NODE_ENV=production
railway variables set DATABASE_URL="postgresql://..."
railway variables set JWT_SECRET="your-secret"
railway variables set JWT_REFRESH_SECRET="your-refresh-secret"

# Deploy
railway up
```

### 4. Get Your Railway URL

After deployment:
1. Go to your service in Railway dashboard
2. Click on **Settings** → **Networking**
3. Copy your public URL (e.g., `https://your-app.railway.app`)
4. Update `API_BASE_URL` in Railway variables if needed

### 5. Test Your Deployment

```bash
# Health check
curl https://your-app.railway.app/health-quick

# Should return: {"status":"ok","timestamp":"...","server":"EsusuHub Backend"}
```

### 6. Update Frontend

Update your React Native app's API URL in `src/config/env.ts`:

```typescript
API_BASE_URL: process.env.API_BASE_URL || 'https://your-app.railway.app/api'
```

## ✅ Checklist

- [ ] Generated JWT secrets
- [ ] Got Supabase connection string
- [ ] Deployed to Railway
- [ ] Set all environment variables
- [ ] Tested health endpoint
- [ ] Updated frontend API URL

## 🔧 Troubleshooting

**Build fails?**
- Check Railway logs: Service → Logs
- Ensure Dockerfile is in `backend/` directory
- Verify all dependencies are in `package.json`

**Database connection fails?**
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Supabase allows connections from Railway IPs
- Ensure password is correct (no special characters need encoding)

**Port issues?**
- Railway sets `PORT` automatically - don't hardcode it
- Server already uses `process.env.PORT || 5166`

## 📚 More Help

- Full guide: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs

