# How to Enable Docker in Azure App Service

## If "Docker Container" Option Not Available

### Option 1: Enable Docker Support

1. **Configuration** → **General settings**
2. **Stack:** Change to **"Docker"** or **"Docker Compose"**
3. **Save**
4. **Deployment Center** → **Settings** should now show Docker options

### Option 2: Check App Service Plan

Some App Service plans don't support Docker:
- **Free tier:** May not support Docker
- **Basic tier:** Should support Docker
- **Standard/Premium:** Full Docker support

**Check:**
- **Overview** → Look at your **App Service plan**
- If it's **Free**, you might need to upgrade

### Option 3: Use Docker Compose

1. **Configuration** → **General settings**
2. **Stack:** Select **"Docker Compose"**
3. **Docker Compose file:** `backend/docker-compose.yml` (if you have one)
4. **Save**

## Alternative: Fix POST_BUILD_COMMAND

Since Docker option isn't available, let's fix the build command:

### Step 1: Verify POST_BUILD_COMMAND

1. **Configuration** → **Application settings**
2. **Look for:** `POST_BUILD_COMMAND`
3. **If it exists:**
   - Check the exact value
   - Should be: `npm run build` (no quotes)
4. **If it doesn't exist:**
   - **Add new application setting**
   - **Name:** `POST_BUILD_COMMAND`
   - **Value:** `npm run build`
   - **Deployment slot setting:** **UNCHECKED**
   - **Save**

### Step 2: Try Alternative Build Commands

If `POST_BUILD_COMMAND` doesn't work, try:

**Option A: PRE_BUILD_COMMAND**
- **Name:** `PRE_BUILD_COMMAND`
- **Value:** `npm run build`

**Option B: SCM_DO_BUILD_DURING_DEPLOYMENT**
- **Name:** `SCM_DO_BUILD_DURING_DEPLOYMENT`
- **Value:** `true`
- **Also add:** `POST_BUILD_COMMAND = npm run build`

### Step 3: Check Build Provider Settings

1. **Deployment Center** → **Settings**
2. **What build provider is currently selected?**
3. **Check if there are other options** in the dropdown

## Manual Build Alternative

If build commands don't work, you could:

1. **Build locally:**
   ```powershell
   cd backend
   npm run build
   ```
2. **Commit the `dist/` folder** to Git
3. **Push to Azure DevOps**
4. **Azure will deploy the pre-built files**

**Note:** This isn't ideal, but it works if build commands fail.

## Check Your Current Configuration

1. **Configuration** → **General settings**
   - **What Stack is selected?** (Node, Docker, Docker Compose?)
   - **What Startup Command is set?**

2. **Deployment Center** → **Settings**
   - **What Build provider is selected?**
   - **What options are available in the dropdown?**

3. **Configuration** → **Application settings**
   - **Is POST_BUILD_COMMAND set?**
   - **What's the exact value?**

## Next Steps

1. **Check your App Service plan** (Free/Basic/Standard)
2. **Check Stack setting** (Configuration → General settings)
3. **Verify POST_BUILD_COMMAND** is set correctly
4. **Share what you find** so we can determine the best approach

