# Enable Docker After Upgrading to Basic B1

## After Upgrading Plan

The upgrade might still be processing, or you need to change the Stack setting.

## Step 1: Change Stack to Docker

1. **Azure Portal** → Your Web App
2. **Configuration** → **General settings** (tab)
3. **Find "Stack" dropdown** (near the top)
4. **Current:** Probably "Node" or "Code"
5. **Change to:** **"Docker"** or **"Docker Compose"**
6. **Click "Save"** (top of page)
7. **Wait for save to complete**

## Step 2: Wait for Upgrade to Complete

If you just upgraded:
- **Can take 5-10 minutes** for upgrade to fully complete
- **Check Overview** - Should show "Basic B1" plan
- **Wait a few minutes** if upgrade just finished

## Step 3: Configure Docker Deployment

After Stack is set to Docker:

1. **Deployment Center** → **Settings**
2. **Build provider:** Should now show **"Docker Container"** option
3. **Select:** "Docker Container"
4. **Dockerfile path:** `backend/Dockerfile`
5. **Save**

## Step 4: Verify Docker Settings

**Configuration → General settings** should show:
- ✅ **Stack:** Docker (or Docker Compose)
- ✅ **Startup Command:** (can be empty - Dockerfile handles it)

**Deployment Center → Settings** should show:
- ✅ **Build provider:** Docker Container
- ✅ **Dockerfile path:** backend/Dockerfile

## If Docker Option Still Not Available

### Check 1: Verify Plan Upgrade

1. **Overview** → **App Service plan**
2. **Should show:** "Basic B1" (not Free)
3. **If still showing Free:** Upgrade might not be complete yet

### Check 2: Restart Web App

1. **Overview** → **Restart**
2. **Wait for restart**
3. **Check Configuration** again

### Check 3: Check Region

Some regions might have different features. Check if your region supports Docker.

### Check 4: Try Docker Compose

If "Docker" isn't available, try:
1. **Configuration** → **General settings**
2. **Stack:** **"Docker Compose"**
3. **Save**

## Alternative: Use Container Registry

If direct Dockerfile deployment doesn't work:

1. **Deployment Center** → **Settings**
2. **Source:** Container Registry
3. **Configure** your container registry
4. **Deploy** from registry

## What You Should See

### After Stack is "Docker":

**Configuration → General settings:**
- Stack: **Docker** ✅
- Startup Command: (empty or `npm start`)

**Deployment Center → Settings:**
- Build provider: **Docker Container** ✅
- Dockerfile path: `backend/Dockerfile` ✅

## Troubleshooting

### "Docker option still not showing"

1. **Wait 5-10 minutes** after upgrade
2. **Restart** Web App
3. **Refresh** browser page
4. **Check** if Stack is set to "Docker"

### "Stack dropdown doesn't have Docker"

1. **Verify** plan is Basic B1 (not Free)
2. **Check** Overview → App Service plan name
3. **Wait** a few more minutes for upgrade to complete
4. **Try** refreshing the page

## Next Steps

1. ✅ **Change Stack to Docker** (Configuration → General settings)
2. ✅ **Save** and **Restart**
3. ✅ **Check Deployment Center** for Docker Container option
4. ✅ **Configure** Dockerfile path
5. ✅ **Deploy!**

## Summary

- **Upgrade complete:** ✅ Basic B1
- **Next:** Change Stack to "Docker"
- **Then:** Configure Docker deployment
- **Result:** TypeScript will build automatically!

