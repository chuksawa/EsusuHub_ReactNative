# Troubleshooting: App Not Displaying on Android Emulator

## Issue
Metro bundler started successfully and Android emulator opened, but EsusuHub app is not displaying.

## Root Cause Analysis

### Most Likely Cause
**`npx react-native start` only starts Metro bundler - it does NOT build or install the app on the emulator.**

When you run `npx react-native start`:
- ✅ Metro bundler starts
- ✅ Emulator may open (if configured to auto-launch)
- ❌ App is NOT built
- ❌ App is NOT installed on emulator
- ❌ App is NOT launched

### What's Happening
1. Metro bundler is running and waiting for a connection
2. Android emulator is running but has no app installed
3. The app needs to be built and installed separately

## Solution

### Step 1: Keep Metro Running
Keep the terminal with `npx react-native start` running.

### Step 2: Build and Install App (New Terminal)
Open a **NEW terminal window** and run:

```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native run-android
```

This command will:
- Build the Android app
- Install it on the emulator
- Launch the app
- Connect to Metro bundler

### Alternative: Use npm scripts
```bash
# Terminal 1: Start Metro
npm start

# Terminal 2: Build and run
npm run android
```

## Verification Steps

### Check if App is Installed
```bash
adb shell pm list packages | findstr esusu
```

Should show: `package:com.esusuhub` (or similar)

### Check Metro Connection
In Metro bundler terminal, you should see:
- "Metro waiting on..."
- When app launches: "Bundling JavaScript bundle..."

### Check for Errors

#### Metro Bundler Errors
Look in the Metro terminal for:
- Red error messages
- Bundle failed errors
- Module not found errors

#### Android Logcat Errors
```bash
adb logcat | findstr "ReactNative\|ERROR\|FATAL"
```

Common errors:
- `Unable to load script` - Metro connection issue
- `Module not found` - Missing dependency
- `Invariant Violation` - JavaScript error

## Common Issues and Fixes

### Issue 1: "Unable to load script"
**Cause:** Metro bundler not connected  
**Fix:** 
1. Ensure Metro is running
2. Shake device → Reload
3. Or: `adb shell input keyevent 82` (menu) → Reload

### Issue 2: "App crashes on startup"
**Cause:** JavaScript error or missing dependency  
**Fix:**
1. Check Metro bundler for errors
2. Check `adb logcat` for crash logs
3. Verify all dependencies installed: `npm install`

### Issue 3: "Blank white screen"
**Cause:** App loaded but not rendering  
**Fix:**
1. Check Metro for bundle errors
2. Check React Native logs
3. Verify `App.tsx` is correct
4. Check ErrorBoundary for caught errors

### Issue 4: "App name mismatch"
**Cause:** `app.json` name doesn't match Android package  
**Fix:**
- Verify `app.json` has: `"name": "EsusuHub"`
- Verify AndroidManifest.xml package matches

## Debugging Commands

### Check App Installation
```bash
# List installed packages
adb shell pm list packages | findstr esusu

# Check app info
adb shell dumpsys package com.esusuhub
```

### View Real-time Logs
```bash
# React Native logs
adb logcat *:S ReactNative:V ReactNativeJS:V

# All errors
adb logcat *:E

# Clear logs and watch
adb logcat -c && adb logcat
```

### Reload App
```bash
# Method 1: Shake device → Reload
# Method 2: Press R twice in Metro terminal
# Method 3: Command
adb shell input keyevent 82  # Open menu
# Then select Reload
```

### Check Metro Connection
```bash
# Test if Metro is accessible
curl http://localhost:8081/status

# Should return: {"status":"running"}
```

## Expected Workflow

### Correct Sequence:
1. **Terminal 1:** Start Metro
   ```bash
   npx react-native start
   ```
   Wait for: "Metro waiting on..."

2. **Terminal 2:** Build and run
   ```bash
   npx react-native run-android
   ```
   This will:
   - Build the app
   - Install on emulator
   - Launch the app
   - Connect to Metro

3. **Result:** App should display on emulator

## Quick Fix

If Metro is already running:

1. **Open new terminal**
2. **Run:**
   ```bash
   cd C:\Dev\EsusuHub_ReactNative
   npx react-native run-android
   ```

This will build, install, and launch the app while Metro is running.

## Verification Checklist

After running `npx react-native run-android`:

- [ ] App appears on emulator screen
- [ ] Metro bundler shows "Bundling JavaScript bundle..."
- [ ] No red errors in Metro terminal
- [ ] App shows EsusuHub interface (or loading screen)
- [ ] Can interact with app

## If Still Not Working

### Check These:

1. **Metro is running?**
   - Terminal shows "Metro waiting on..."
   - Port 8081 is accessible

2. **Emulator is running?**
   - `adb devices` shows device
   - Emulator screen is visible

3. **App is installed?**
   - `adb shell pm list packages | findstr esusu`

4. **No build errors?**
   - Check Terminal 2 for Gradle errors
   - Check for missing dependencies

5. **JavaScript bundle loads?**
   - Metro shows bundle progress
   - No "Unable to load script" errors

---

**Most Common Solution:** Run `npx react-native run-android` in a new terminal while Metro is running.

