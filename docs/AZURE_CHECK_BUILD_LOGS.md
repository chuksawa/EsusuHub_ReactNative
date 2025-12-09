# How to Check Azure Build Logs

## Where to Find Build Logs

1. **Azure Portal** → Your Web App
2. **Deployment Center** (left menu)
3. **Logs** tab
4. **Click on the latest deployment**
5. **Scroll through the logs**

## What to Look For

### ✅ Good Signs (Build Successful):

```
Detecting platforms...
Installing dependencies...
npm install
Running post-build command...
npm run build
Building TypeScript...
Compiling...
dist/server.js created
Build successful
Deployment successful
```

### ❌ Bad Signs (Build Failed):

```
Build failed
Error: ...
npm error
TypeScript compilation errors
Cannot find module
```

## Key Sections in Logs

### 1. Platform Detection
```
Detecting platforms...
Requesting metadata for platform nodejs
```
✅ Should show Node.js 20

### 2. Dependency Installation
```
Installing dependencies...
npm install
```
✅ Should complete without errors

### 3. Post-Build Command (TypeScript)
```
Running post-build command...
npm run build
Building TypeScript...
Compiling...
```
✅ **CRITICAL:** Must see this section!
✅ If missing, `POST_BUILD_COMMAND` isn't working

### 4. Build Output
```
Build successful
Deployment successful
```
✅ Should see success message

## If TypeScript Not Compiling

If you DON'T see "npm run build" in the logs:

1. **Check Configuration:**
   - **Application settings** → `POST_BUILD_COMMAND = npm run build`
   - Make sure it's saved

2. **Trigger New Build:**
   - **Deployment Center** → **Sync**
   - OR push to Git: `git push origin main`

3. **Watch the logs** for the post-build command

## Common Issues

### "Build successful" but no TypeScript compilation
- `POST_BUILD_COMMAND` not set or not working
- Check Application settings

### "Build failed" with TypeScript errors
- TypeScript compilation errors
- Check the specific error in logs
- Fix TypeScript errors locally, then redeploy

### "Build successful" but server not starting
- Check startup command
- Check Log Stream (not build logs)
- Verify files are in right place (Kudu Console)

## After Build Completes

1. ✅ **Check build status:** Should be "Deployment successful"
2. ✅ **Check Log Stream:** Should show server starting
3. ✅ **Test endpoint:** `/health` should return JSON

## Next Steps

1. **Scroll to bottom** of Deployment Center logs
2. **Look for:** "Build successful" or "Deployment successful"
3. **Check for:** "npm run build" in the logs
4. **Share:** What you see at the end of the logs

