# How to See Complete Build Logs in Azure

## The Problem

The logs you're seeing are just the **beginning** of the build. We need to see the **complete** build output to diagnose the issue.

## How to See Full Logs

### Method 1: Scroll in Deployment Center

1. **Deployment Center** → **Logs**
2. **Click on the failed deployment**
3. **Scroll down** - Keep scrolling!
4. **Look for:**
   - Scroll bar on the right
   - "Load more" button at bottom
   - Keep scrolling until you reach the end

### Method 2: Download Logs

1. **Deployment Center** → **Logs**
2. **Click on failed deployment**
3. **Look for "Download" or "Export" button**
4. **Download the full log file**
5. **Open in text editor** to see everything

### Method 3: Check Build Debug Log

The build command shows:
```
--log-file /tmp/build-debug.log
```

This means there's a detailed log file. To access it:

1. **Advanced Tools (Kudu)** → **Go**
2. **Debug console** → **CMD**
3. ```cmd
   type /tmp/build-debug.log
   ```
   OR
   ```cmd
   type /tmp/oryx-build.log
   ```

## What to Look For

### After "Detecting platforms...":

**Should see:**
```
Installing dependencies...
npm install
[package installation output]
```

**If missing:** Build might be failing early

### After npm install:

**Should see:**
```
Running post-build command...
npm run build
Building TypeScript...
Compiling...
```

**If missing:** POST_BUILD_COMMAND not running

### At the End:

**Success:**
```
Build successful
Deployment successful
```

**Failure:**
```
Build failed
Error: [specific error message]
```

## Common Log Locations

1. **Deployment Center → Logs** (main location)
2. **Advanced Tools (Kudu) → Log Files** (if available)
3. **Configuration → Logging → Application Logging** (runtime logs, not build)

## If You Can't Scroll

1. **Try downloading** the log file
2. **Check Kudu console** for `/tmp/build-debug.log`
3. **Take a screenshot** of the error section
4. **Copy the last 50-100 lines** of the log

## What to Share

To help diagnose, share:

1. **The last 20-30 lines** of the build log
2. **Any error messages** (red text)
3. **Final status:** "Build successful" or "Build failed"
4. **Whether you see:** "npm run build" anywhere

## Quick Check

In the deployment logs, scroll all the way to the bottom and tell me:
- What's the **last line** you see?
- Is it "Build successful" or "Build failed"?
- What **error message** (if any) appears?

