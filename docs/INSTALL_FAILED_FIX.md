# Fix: Installation Failed - "Can't find service: package"

## ✅ Build Status
**Build succeeded!** APK was created successfully at:
`android/app/build/outputs/apk/debug/app-debug.apk`

## Issue
Installation failed with: `Can't find service: package`

This means the device/emulator isn't fully ready or ADB connection is unstable.

## Solutions

### Solution 1: Wait for Device to Fully Boot
**Problem:** Emulator/device is still booting.

**Fix:**
1. Wait for device to show home screen (not just lock screen)
2. Wait 30-60 seconds after boot
3. Try again:
   ```bash
   npx react-native run-android
   ```

### Solution 2: Restart ADB Connection
**Problem:** ADB connection is unstable.

**Fix:**
```bash
adb kill-server
adb start-server
adb devices
```

Then try installing again:
```bash
npx react-native run-android
```

### Solution 3: Install APK Manually
**Since build succeeded, you can install the APK directly:**

```bash
# Install the APK manually:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Or transfer the APK to your device and install it manually:
- Location: `C:\Dev\EsusuHub_ReactNative\android\app\build\outputs\apk\debug\app-debug.apk`
- Copy to device and tap to install

### Solution 4: Check Device State
**Verify device is ready:**

```bash
# Check if device is fully booted:
adb shell getprop sys.boot_completed
# Should return: 1

# Check if package manager is available:
adb shell pm list packages | findstr android
# Should list packages

# Check device state:
adb devices -l
# Should show: device (not offline, unauthorized, etc.)
```

### Solution 5: Restart Emulator/Device
**If device is in bad state:**

1. **For Emulator:**
   - Close emulator completely
   - Restart from Android Studio
   - Wait for full boot

2. **For Physical Device:**
   - Disconnect and reconnect USB
   - Or restart device

### Solution 6: Uninstall Old Version First
**If app was previously installed:**

```bash
# Uninstall existing version:
adb uninstall com.esusuhub

# Then install:
npx react-native run-android
```

## Quick Fix Sequence

Try these in order:

```bash
# 1. Restart ADB
adb kill-server
adb start-server

# 2. Check device is ready
adb shell getprop sys.boot_completed

# 3. Wait if needed (if returns empty or 0)
# Wait 30 seconds, then:

# 4. Install manually
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 5. Launch app
adb shell am start -n com.esusuhub/.MainActivity
```

## Alternative: Build Only (No Install)

If you just want the APK without installing:

```bash
cd C:\Dev\EsusuHub_ReactNative\android
.\gradlew.bat assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## After Successful Installation

Once installed, start Metro bundler and launch:

```bash
# Terminal 1: Start Metro
cd C:\Dev\EsusuHub_ReactNative
npx react-native start

# Terminal 2: Launch app
adb shell am start -n com.esusuhub/.MainActivity
```

---

**Most Likely Fix:** Wait for device to fully boot, then install APK manually with `adb install`.

