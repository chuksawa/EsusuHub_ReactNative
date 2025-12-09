# How to Find Application Logs in Azure App Service

## The Problem

The logs you're seeing are **container infrastructure logs** (Kudu), not your **Node.js application logs**. We need to find where your actual server output is.

## Where to Find Application Logs

### Option 1: Log Stream - Application Logging

1. **Azure Portal** → Your Web App
2. **Log Stream** (left menu)
3. **Look for tabs:**
   - **"Application Logging"** - This shows your Node.js output
   - **"Web Server Logging"** - HTTP request logs
   - **"Failed Request Tracing"** - Error logs

4. **If Application Logging is empty:**
   - Enable it: **Configuration** → **Logging**
   - **Application Logging (Filesystem):** ON
   - **Level:** Information or Verbose
   - **Save** and **Restart**

### Option 2: Advanced Tools (Kudu) - Debug Console

1. **Advanced Tools (Kudu)** → **Go** (opens in new tab)
2. **Debug console** → **CMD** or **PowerShell**
3. **Navigate to your app:**
   ```
   cd site\wwwroot
   ```
4. **Check if files exist:**
   ```
   dir
   ```
5. **Look for:**
   - `dist/server.js` (should exist if TypeScript compiled)
   - `package.json`
   - `node_modules`

### Option 3: Deployment Center - Build Logs

1. **Deployment Center** → **Logs**
2. **Click on latest deployment**
3. **Look for:**
   - "Building TypeScript..."
   - "npm run build"
   - "Compiling..."
   - Any errors during build

### Option 4: SSH Console (If Enabled)

1. **SSH** (left menu) - if available
2. **Connect** to your app
3. **Check running processes:**
   ```
   ps aux | grep node
   ```
4. **Check if server is running:**
   ```
   netstat -tulpn | grep 8080
   ```

## What to Look For

### Good Signs (Server Running):
```
🚀 Server running on port 8080
📡 API available at http://localhost:8080/api
Database connected successfully
```

### Bad Signs (Server Not Starting):
```
Error: Cannot find module 'dist/server.js'
Error: Port 8080 already in use
Database connection error
Missing environment variable
```

## Enable Application Logging

If Application Logging is disabled:

1. **Configuration** → **Logging**
2. **Application Logging (Filesystem):** **On**
3. **Level:** **Information** (or Verbose for more details)
4. **Save**
5. **Restart** the Web App
6. **Check Log Stream** again

## Quick Diagnostic Commands (Kudu Console)

In **Advanced Tools (Kudu)** → **Debug console** → **CMD**:

```cmd
cd site\wwwroot
dir
type package.json
node --version
npm --version
```

Check if:
- ✅ `dist/server.js` exists
- ✅ `node_modules` exists
- ✅ Node.js version is correct

## Most Likely Issue

Based on the empty logs, your server probably isn't starting because:

1. **TypeScript not compiled** → No `dist/server.js`
2. **Wrong startup command** → Server not being launched
3. **Missing files** → Code not deployed correctly

## Next Steps

1. ✅ **Enable Application Logging** (if not enabled)
2. ✅ **Check Kudu Console** to see what files exist
3. ✅ **Check Deployment Center logs** for build errors
4. ✅ **Share what you find** so we can fix it!

