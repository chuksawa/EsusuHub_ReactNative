# Azure Deployment Slot Setting - Explained

## What It Means

The **"Deployment slot setting"** checkbox controls whether a setting is:
- **Checked (Slot-specific):** Only applies to the current deployment slot
- **Unchecked (App-level):** Applies to all deployment slots

## Recommendation

### For Production: **Uncheck It** ✅

**Why:**
- Makes the setting apply to all slots (production, staging, etc.)
- More reliable and consistent
- Easier to manage
- Prevents issues if you switch slots

### When to Check It

Only check it if you want:
- Different build commands for different slots
- Staging to use different settings than production
- Slot-specific testing configurations

## For Your Case

**Uncheck "Deployment slot setting"** for:
- ✅ `POST_BUILD_COMMAND`
- ✅ `SCM_REPOSITORY_PATH`
- ✅ `NODE_ENV`
- ✅ `PORT`
- ✅ All environment variables

This ensures consistent behavior across all slots.

## After Unchecking

1. **Save** all settings
2. **Restart** your Web App
3. **Trigger new deployment:**
   - **Deployment Center** → **Sync**
   - OR push to Git: `git push origin main`

## Verify It's Working

### Check Build Logs:

1. **Deployment Center** → **Logs**
2. **Latest deployment** → Scroll through logs
3. **Look for:**
   ```
   Running post-build command...
   npm run build
   Building TypeScript...
   Compiling...
   ```

### Check Files:

1. **Advanced Tools (Kudu)** → **Go**
2. **Debug console** → **CMD**
3. ```cmd
   cd site\wwwroot
   dir dist
   ```
4. **Should see:** `server.js` in the `dist` folder

## Summary

- ✅ **Uncheck "Deployment slot setting"** for all settings
- ✅ **Save** and **Restart**
- ✅ **Trigger new deployment**
- ✅ **Verify** TypeScript compiled in build logs

