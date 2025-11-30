# Troubleshooting: App Built Successfully But Not Loading

## Build Status
✅ **Build completed successfully!** All compilation errors resolved.

## Issue
The app installed on the Android device but doesn't display/load.

## Common Causes & Solutions

### 1. Metro Bundler Not Running
**Problem:** The JavaScript bundle isn't being served to the app.

**Solution:**
```bash
# In a separate terminal, start Metro bundler:
cd C:\Dev\EsusuHub_ReactNative
npx react-native start
```

**Verify:** You should see Metro bundler running on port 8081.

### 2. App Installed But Not Launched
**Problem:** The app was installed but not automatically opened.

**Solution:**
```bash
# Manually launch the app:
adb shell am start -n com.esusuhub/.MainActivity
```

Or manually open the app from the device's app drawer.

### 3. Check App Installation
**Verify the app is installed:**
```bash
adb shell pm list packages | findstr esusu
```

Should show: `package:com.esusuhub`

### 4. Check Logs for Errors
**View real-time logs:**
```bash
# Clear old logs and watch for new ones:
adb logcat -c
adb logcat | findstr "ReactNative\|EsusuHub\|ERROR\|FATAL"
```

**Common errors to look for:**
- "Unable to load script"
- "Metro bundler connection failed"
- "Network request failed"
- JavaScript errors

### 5. Network/Connection Issues
**Problem:** Device can't connect to Metro bundler.

**Check:**
- Is the device on the same network as your computer?
- Is port 8081 accessible?
- Try: `adb reverse tcp:8081 tcp:8081` (for USB debugging)

**Solution:**
```bash
# Forward Metro port to device:
adb reverse tcp:8081 tcp:8081
```

### 6. Reload the App
**Force reload:**
- Shake the device (or press `Ctrl+M` in emulator)
- Select "Reload"
- Or: `adb shell input keyevent 82` (opens dev menu)

### 7. Clear App Data
**Fresh start:**
```bash
# Uninstall and reinstall:
adb uninstall com.esusuhub
npx react-native run-android
```

### 8. Check MainActivity Registration
**Verify the app name matches:**
- `app.json`: `"name": "EsusuHub"`
- `MainActivity.java`: `getMainComponentName()` returns `"EsusuHub"`
- `AndroidManifest.xml`: Package name is `com.esusuhub`

## Step-by-Step Debugging Process

### Step 1: Start Metro Bundler
```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native start
```
Wait for: "Metro waiting on..."

### Step 2: Forward Port (if using USB)
```bash
adb reverse tcp:8081 tcp:8081
```

### Step 3: Launch App
```bash
adb shell am start -n com.esusuhub/.MainActivity
```

### Step 4: Check Logs
```bash
adb logcat | findstr "ReactNative\|EsusuHub"
```

### Step 5: If Still Not Working
Try a complete rebuild:
```bash
cd C:\Dev\EsusuHub_ReactNative\android
.\gradlew.bat clean
cd ..
npx react-native run-android
```

## Expected Behavior

When working correctly:
1. Metro bundler shows "Loading dependency graph..."
2. App opens on device
3. You see "BUNDLE" progress in Metro
4. App displays (either login screen or main screen)

## Quick Test

Run this command to see if everything is connected:
```bash
# Check if app is installed:
adb shell pm list packages | findstr esusu

# Check if Metro is accessible:
curl http://localhost:8081/status

# Launch app:
adb shell am start -n com.esusuhub/.MainActivity

# Watch logs:
adb logcat -c && adb logcat | findstr "ReactNative"
```

---

**Next Steps:** Try the solutions above in order. Most likely issue is Metro bundler not running or network connection problem.

