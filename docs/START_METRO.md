# Fix: "Unable to Load Script" Error

## ✅ Good News!
Your app **installed and opened successfully!** The error just means Metro bundler isn't running.

## Solution: Start Metro Bundler

### Step 1: Open a NEW Terminal Window
Keep your current terminal open, and open a **second terminal window**.

### Step 2: Start Metro Bundler
In the **new terminal**, run:
```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native start
```

### Step 3: Wait for Metro to Start
You should see:
```
Metro waiting on port 8081...
```

### Step 4: Reload the App
On your device/emulator:
- **Shake the device** (or press `Ctrl+M` in emulator)
- Select **"Reload"**

Or use command:
```bash
adb shell input keyevent 82
# Then select "Reload" from the menu
```

## Alternative: Forward Port (if using USB)

If you're using a physical device via USB, you may also need:

```bash
adb reverse tcp:8081 tcp:8081
```

## Complete Setup (Two Terminals)

### Terminal 1: Metro Bundler
```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native start
```
**Keep this running!** This serves your JavaScript code.

### Terminal 2: Commands
```bash
# Forward port (if needed):
adb reverse tcp:8081 tcp:8081

# Reload app:
adb shell input keyevent 82
# Then select "Reload"
```

## What Metro Bundler Does

Metro bundler:
- Serves your JavaScript/TypeScript code
- Provides hot reloading
- Enables live development

**You need it running whenever you're developing!**

## Quick Reference

```bash
# Start Metro (in separate terminal):
npx react-native start

# Forward port (USB devices):
adb reverse tcp:8081 tcp:8081

# Reload app:
# Shake device → Select "Reload"
# OR: adb shell input keyevent 82
```

## Expected Result

After starting Metro and reloading:
- App should load properly
- You'll see "BUNDLE" progress in Metro terminal
- App should display your screens

---

**The app is working!** You just need Metro bundler running to serve the JavaScript code.

