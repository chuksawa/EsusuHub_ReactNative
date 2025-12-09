# Azure App Service - Page Not Loading Troubleshooting

## Your URL
https://esusuhub-backend-esusuhubpilot-d4a5eud7b6hedrat.canadacentral-01.azurewebsites.net

## Common Issues & Fixes

### 1. Check Log Stream (Most Important!)

1. **Azure Portal** → Your Web App
2. **Log Stream** (left menu)
3. **Look for:**
   - "Server running on port..."
   - "Database connected successfully"
   - Any error messages

### 2. Check Application Logs

1. **Log Stream** → **Application Logging**
2. Look for runtime errors
3. Common errors:
   - "Cannot find module 'dist/server.js'"
   - "Port already in use"
   - "Database connection error"
   - "Missing environment variable"

### 3. Verify Environment Variables

**Configuration** → **Application settings** → Check all are set:

✅ `NODE_ENV=production`
✅ `PORT=8080` (Azure uses 8080, not 5166)
✅ `DATABASE_URL=...` (with `?sslmode=require`)
✅ `JWT_SECRET=...`
✅ `JWT_REFRESH_SECRET=...`
✅ `CORS_ORIGIN=*`

### 4. Check Port Configuration

Azure App Service uses port 8080 by default. Your code should use:
```typescript
const PORT = process.env.PORT || 8080;
```

Verify:
- **Configuration** → **Application settings** → `PORT=8080` is set
- Your code uses `process.env.PORT` (which it does)

### 5. Test Health Endpoint

Try these URLs:

```
https://esusuhub-backend-esusuhubpilot-d4a5eud7b6hedrat.canadacentral-01.azurewebsites.net/health
https://esusuhub-backend-esusuhubpilot-d4a5eud7b6hedrat.canadacentral-01.azurewebsites.net/api/health
https://esusuhub-backend-esusuhubpilot-d4a5eud7b6hedrat.canadacentral-01.azurewebsites.net/
```

### 6. Check Startup Command

If using Docker:
- **Configuration** → **General settings**
- **Startup Command:** Should be empty (Dockerfile CMD handles it)
- OR: `npm start` or `node dist/server.js`

### 7. Verify Server is Running

**Log Stream** should show:
```
🚀 Server running on port 8080
📡 API available at http://localhost:8080/api
```

If you see errors instead, that's the issue.

## Quick Diagnostic Steps

### Step 1: Check Log Stream
- **Most important!** Shows real-time server output
- Look for startup messages or errors

### Step 2: Test Health Endpoint
```powershell
curl https://esusuhub-backend-esusuhubpilot-d4a5eud7b6hedrat.canadacentral-01.azurewebsites.net/health
```

Should return: `1` or a JSON response

### Step 3: Check Environment Variables
- All required variables are set
- `PORT=8080` is set
- `DATABASE_URL` is correct

### Step 4: Check Deployment Type
- If using Docker: Verify Dockerfile is being used
- If using Code: Verify TypeScript was compiled

## Common Error Messages

### "Cannot find module 'dist/server.js'"
**Fix:** TypeScript wasn't compiled. Use Docker or add `POST_BUILD_COMMAND=npm run build`

### "Port 8080 already in use"
**Fix:** Azure sets PORT automatically. Don't hardcode it. Use `process.env.PORT`

### "Database connection error"
**Fix:** 
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Supabase allows Azure IPs
- Test connection string locally

### "Missing environment variable"
**Fix:** Check all variables from `backend/RAILWAY_VALUES.md` are set

## Still Not Working?

1. **Copy the exact error** from Log Stream
2. **Check Application Insights** (if enabled) for more details
3. **Try restarting** the Web App:
   - **Overview** → **Restart**

## Next Steps

1. ✅ Check **Log Stream** for errors
2. ✅ Test health endpoint
3. ✅ Verify environment variables
4. ✅ Share error messages if found

