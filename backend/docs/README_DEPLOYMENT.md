# Deployment Overview

This backend is ready for deployment to Railway with Docker support and Supabase integration.

## 📁 Files Created for Deployment

- **`Dockerfile`** - Multi-stage Docker build for production
- **`.dockerignore`** - Excludes unnecessary files from Docker build
- **`railway.json`** - Railway configuration (optional, auto-detected)
- **`railway.toml`** - Alternative Railway configuration
- **`RAILWAY_DEPLOYMENT.md`** - Complete deployment guide
- **`DEPLOYMENT_QUICK_START.md`** - Quick reference guide
- **`scripts/generate-secrets.js`** - Utility to generate secure JWT secrets

## 🐳 Docker Support

The backend uses a multi-stage Docker build:

1. **Builder stage**: Compiles TypeScript to JavaScript
2. **Production stage**: Minimal runtime image with only production dependencies

### Key Features:
- ✅ Uses Node.js 18 Alpine (small image size)
- ✅ Non-root user for security
- ✅ Health check endpoint
- ✅ Proper signal handling with dumb-init
- ✅ Optimized layer caching

## 🚂 Railway Deployment

Railway will automatically:
- Detect the Dockerfile
- Build the Docker image
- Deploy and scale your service
- Provide a public URL
- Set the `PORT` environment variable

### Git Provider Support

Railway supports multiple Git providers:
- ✅ GitHub (native support)
- ✅ GitLab
- ✅ Bitbucket
- ✅ Azure DevOps (see [AZURE_DEVOPS_RAILWAY.md](./AZURE_DEVOPS_RAILWAY.md))

For Azure DevOps deployments, see the detailed guide: [AZURE_DEVOPS_RAILWAY.md](./AZURE_DEVOPS_RAILWAY.md)

## 🔗 Supabase Connection

The backend is configured to work with Supabase:
- ✅ SSL connections automatically enabled
- ✅ Connection pooling support
- ✅ 10-second timeout for Supabase
- ✅ Uses `DATABASE_URL` connection string

## 📋 Required Environment Variables

### Minimum Required:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing (min 32 chars)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (min 32 chars)
- `NODE_ENV` - Set to `production`

### Recommended:
- `API_BASE_URL` - Your Railway app URL
- `CORS_ORIGIN` - Allowed frontend origins

## 🚀 Quick Deploy

**For simple deployment (no CI/CD):**
1. See [RAILWAY_SIMPLE_DEPLOY.md](./RAILWAY_SIMPLE_DEPLOY.md) - easiest method using Railway CLI

**Or follow these steps:**
1. Generate secrets: `npm run generate-secrets`
2. Get Supabase connection string from dashboard
3. Deploy to Railway (see `DEPLOYMENT_QUICK_START.md` or `RAILWAY_SIMPLE_DEPLOY.md`)
4. Set environment variables in Railway
5. Test: `curl https://your-app.railway.app/health-quick`

## 📚 Documentation

- **Quick Start**: [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)
- **Full Guide**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

## ✅ Pre-Deployment Checklist

- [ ] Generated secure JWT secrets
- [ ] Have Supabase connection string ready
- [ ] Railway account created
- [ ] GitHub repository connected (optional)
- [ ] Environment variables documented
- [ ] Frontend API URL ready to update

## 🔍 Testing Locally with Docker

You can test the Docker build locally:

```bash
# Build the image
docker build -t esusuhub-api .

# Run with environment variables
docker run -p 5166:5166 \
  -e DATABASE_URL="your-supabase-url" \
  -e JWT_SECRET="your-secret" \
  -e JWT_REFRESH_SECRET="your-refresh-secret" \
  -e NODE_ENV=production \
  esusuhub-api

# Test health endpoint
curl http://localhost:5166/health-quick
```

## 🛠️ Maintenance

### View Logs
- Railway Dashboard → Service → Logs
- Or CLI: `railway logs`

### Update Environment Variables
- Railway Dashboard → Service → Variables
- Or CLI: `railway variables set KEY=value`

### Redeploy
- Push to connected branch (auto-deploy)
- Or Railway Dashboard → Deploy → Redeploy

## 📞 Support

- Railway: https://docs.railway.app
- Supabase: https://supabase.com/docs
- Issues: Check logs in Railway dashboard

