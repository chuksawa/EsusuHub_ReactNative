# Fix POST_BUILD_COMMAND - Step by Step

## Since Docker Isn't Available

We need to make `POST_BUILD_COMMAND` work properly.

## Step 1: Verify/Create POST_BUILD_COMMAND

1. **Azure Portal** → Your Web App
2. **Configuration** → **Application settings**
3. **Look for:** `POST_BUILD_COMMAND`
4. **If it exists:**
   - Check the **exact value**
   - Should be: `npm run build` (no quotes, no spaces)
   - **Deployment slot setting:** **UNCHECKED**
5. **If it doesn't exist:**
   - Click **"+ New application setting"**
   - **Name:** `POST_BUILD_COMMAND`
   - **Value:** `npm run build`
   - **Deployment slot setting:** **UNCHECKED** (important!)
   - Click **OK**

## Step 2: Add SCM_DO_BUILD_DURING_DEPLOYMENT

This ensures the build process runs:

1. **Configuration** → **Application settings**
2. **Look for:** `SCM_DO_BUILD_DURING_DEPLOYMENT`
3. **If missing:**
   - Click **"+ New application setting"**
   - **Name:** `SCM_DO_BUILD_DURING_DEPLOYMENT`
   - **Value:** `true`
   - **Deployment slot setting:** **UNCHECKED**
   - Click **OK**

## Step 3: Verify All Settings

**Configuration → Application settings** should have:

✅ `SCM_REPOSITORY_PATH = backend`
✅ `SCM_DO_BUILD_DURING_DEPLOYMENT = true`
✅ `POST_BUILD_COMMAND = npm run build`
✅ `NODE_ENV = production`
✅ `PORT = 8080`
✅ `DATABASE_URL = ...`
✅ `JWT_SECRET = ...`
✅ `JWT_REFRESH_SECRET = ...`
✅ `CORS_ORIGIN = *`

**All with "Deployment slot setting" UNCHECKED**

## Step 4: Save and Restart

1. **Click "Save"** (top of Configuration page)
2. **Wait for save to complete**
3. **Overview** → **Restart** (restart your Web App)
4. **Wait for restart to complete**

## Step 5: Trigger New Deployment

1. **Deployment Center** → **Sync**
2. **OR** push to Git: `git push origin main`
3. **Watch Deployment Center → Logs**

## Step 6: Verify Build Logs

In **Deployment Center → Logs**, look for:

```
Installing dependencies...
npm install
[package installation]
Running post-build command...
npm run build
Building TypeScript...
Compiling...
dist/server.js created
Build successful
```

## Step 7: Verify Files After Build

1. **Advanced Tools (Kudu)** → **Go**
2. **Debug console** → **CMD**
3. ```cmd
   cd site\wwwroot
   dir
   dir dist
   ```
4. **Should see:**
   - ✅ `package.json`
   - ✅ `dist/` folder
   - ✅ `dist/server.js`

## If Still Not Working

### Try Alternative: PRE_BUILD_COMMAND

Sometimes `POST_BUILD_COMMAND` doesn't work, but `PRE_BUILD_COMMAND` does:

1. **Configuration** → **Application settings**
2. **Add:**
   - **Name:** `PRE_BUILD_COMMAND`
   - **Value:** `npm run build`
   - **Deployment slot setting:** **UNCHECKED**
3. **Save** → **Restart** → **Redeploy**

### Check Build Logs for Errors

1. **Deployment Center** → **Logs**
2. **Scroll through** - Look for:
   - "Running pre-build command..."
   - "Running post-build command..."
   - Any error messages

## Common Issues

### "POST_BUILD_COMMAND not found in logs"
- Setting might not be applied
- Check exact spelling: `POST_BUILD_COMMAND` (all caps)
- Uncheck "Deployment slot setting"
- Save and restart

### "Build succeeds but dist/ still missing"
- POST_BUILD_COMMAND might be running but failing
- Check build logs for TypeScript errors
- Try PRE_BUILD_COMMAND instead

### "Setting exists but not executing"
- Verify "Deployment slot setting" is UNCHECKED
- Restart Web App after saving
- Trigger new deployment

## Summary

1. ✅ **Add/Verify:** `POST_BUILD_COMMAND = npm run build`
2. ✅ **Add:** `SCM_DO_BUILD_DURING_DEPLOYMENT = true`
3. ✅ **Uncheck:** "Deployment slot setting" for all
4. ✅ **Save** → **Restart** → **Redeploy**
5. ✅ **Verify:** `dist/server.js` exists after build

