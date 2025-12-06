# Railway Deployment Guide

This guide will help you deploy the EsusuHub backend API to Railway while maintaining connections to Supabase.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. A Supabase project with database credentials
3. GitHub repository (optional, but recommended for automatic deployments)

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

1. **Create a New Project**
   - Go to [railway.app](https://railway.app) and create a new project
   - Click "New Project" → "Deploy from GitHub repo" (or "Empty Project" if deploying manually)

2. **Add Your Backend Service**
   - If using GitHub: Connect your repository and select the `backend` folder
   - If manual: Click "New" → "GitHub Repo" or "Empty Service"
   - Railway will auto-detect the Dockerfile

3. **Configure Environment Variables**
   - Go to your service → "Variables" tab
   - Add the following environment variables:

   ```env
   # Server Configuration
   PORT=5166
   NODE_ENV=production

   # Database (Supabase)
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require

   # JWT Secrets (Generate strong random strings)
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-min-32-chars
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d

   # API Configuration
   API_BASE_URL=https://[YOUR-RAILWAY-APP].railway.app/api
   CORS_ORIGIN=https://your-frontend-domain.com,http://localhost:3000

   # File Upload
   MAX_FILE_SIZE=5242880
   UPLOAD_DIR=./uploads

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Get Your Supabase Connection String**
   - Go to your Supabase project dashboard
   - Navigate to Settings → Database
   - Copy the "Connection string" under "Connection pooling"
   - Use the "Transaction" mode connection string
   - Replace `[YOUR-PASSWORD]` with your actual database password

5. **Deploy**
   - Railway will automatically build and deploy when you push to your connected branch
   - Or click "Deploy" in the Railway dashboard

6. **Get Your Railway URL**
   - After deployment, Railway will provide a public URL
   - Format: `https://[service-name].up.railway.app`
   - Update your `API_BASE_URL` environment variable with this URL

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Railway in your project**
   ```bash
   cd backend
   railway init
   ```

4. **Link to existing project or create new**
   ```bash
   railway link [project-id]  # or create new project
   ```

5. **Set environment variables**
   ```bash
   railway variables set DATABASE_URL="postgresql://..."
   railway variables set JWT_SECRET="your-secret"
   railway variables set JWT_REFRESH_SECRET="your-refresh-secret"
   railway variables set NODE_ENV="production"
   railway variables set PORT="5166"
   ```

6. **Deploy**
   ```bash
   railway up
   ```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | `postgresql://postgres:password@...supabase.co:5432/postgres?sslmode=require` |
| `JWT_SECRET` | Secret key for JWT token signing (min 32 chars) | `your-super-secret-jwt-key` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens (min 32 chars) | `your-super-secret-refresh-key` |
| `NODE_ENV` | Environment mode | `production` |

### Optional Variables (with defaults)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5166` | Server port (Railway sets this automatically) |
| `JWT_EXPIRES_IN` | `24h` | JWT token expiration |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token expiration |
| `API_BASE_URL` | `http://localhost:5166/api` | Base URL for API (update with Railway URL) |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origins (comma-separated) |
| `MAX_FILE_SIZE` | `5242880` | Max upload file size in bytes (5MB) |
| `UPLOAD_DIR` | `./uploads` | Directory for file uploads |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |

## Supabase Connection

The backend is already configured to work with Supabase:

1. **SSL Connection**: Automatically enabled when `DATABASE_URL` contains "supabase"
2. **Connection Pooling**: Uses PostgreSQL connection pooling
3. **Timeout**: Set to 10 seconds for Supabase connections

### Getting Your Supabase Connection String

1. Go to Supabase Dashboard → Your Project
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, select **Transaction** mode
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. The connection string should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   ```

## Verifying Deployment

1. **Check Health Endpoint**
   ```bash
   curl https://[YOUR-RAILWAY-APP].railway.app/health-quick
   ```
   Should return: `{"status":"ok"}`

2. **Check Full Health**
   ```bash
   curl https://[YOUR-RAILWAY-APP].railway.app/health
   ```
   Should return database connection status

3. **Test API Endpoint**
   ```bash
   curl https://[YOUR-RAILWAY-APP].railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!","fullName":"Test User"}'
   ```

## Updating Frontend Configuration

After deployment, update your React Native app's API URL:

1. Update `src/config/env.ts`:
   ```typescript
   API_BASE_URL: process.env.API_BASE_URL || 'https://[YOUR-RAILWAY-APP].railway.app/api'
   ```

2. Or set it via environment variable in your React Native app

## Troubleshooting

### Database Connection Issues

- **Error: "Connection timeout"**
  - Verify `DATABASE_URL` is correct
  - Check that Supabase allows connections from Railway IPs
  - Ensure SSL mode is set to `require` in connection string

- **Error: "SSL required"**
  - Make sure your `DATABASE_URL` includes `?sslmode=require`
  - Supabase requires SSL connections

### Build Issues

- **Error: "Cannot find module"**
  - Ensure `npm ci --only=production` runs successfully
  - Check that all dependencies are in `package.json`

- **Error: "TypeScript compilation failed"**
  - Check `tsconfig.json` is valid
  - Ensure all source files are in `src/` directory

### Runtime Issues

- **Error: "Port already in use"**
  - Railway sets `PORT` automatically, don't hardcode it
  - Use `process.env.PORT || 5166` in your code

- **Error: "Uploads directory not writable"**
  - Railway provides ephemeral storage
  - Consider using Railway Volumes for persistent storage if needed
  - Or use external storage (S3, Cloudinary) for production

## Railway-Specific Features

### Custom Domain

1. Go to your service → Settings → Domains
2. Add a custom domain
3. Update `API_BASE_URL` with your custom domain

### Environment Variables

- Railway automatically provides `PORT` variable
- Use Railway's environment variable management for secrets
- Variables are encrypted at rest

### Logs

- View logs in Railway dashboard → Service → Logs
- Or use Railway CLI: `railway logs`

### Monitoring

- Railway provides basic metrics in the dashboard
- Consider adding application monitoring (Sentry, DataDog, etc.)

## Next Steps

1. Set up continuous deployment from GitHub
2. Configure custom domain (optional)
3. Set up monitoring and alerts
4. Configure backup strategy for uploads (if using file storage)
5. Update frontend to use production API URL

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Supabase Docs: https://supabase.com/docs

