# How to Install and Run the APK

## ⚠️ Important: APK Files Don't Run on Windows

APK files are **Android package files** - they can only run on:
- Android phones/tablets
- Android emulators (on your computer)

**You cannot run an APK directly on Windows.**

## Option 1: Install on Android Emulator (Recommended)

### Step 1: Start Android Emulator
1. **Open Android Studio**
2. **Go to:** Tools → Device Manager
3. **Start an emulator:**
   - Click the ▶️ play button next to an emulator
   - Wait for it to fully boot (1-2 minutes)

### Step 2: Verify Emulator is Connected
```bash
adb devices
```
Should show: `emulator-5554    device`

### Step 3: Install the APK
```bash
cd C:\Dev\EsusuHub_ReactNative
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 4: Launch the App
```bash
adb shell am start -n com.esusuhub/.MainActivity
```

### Step 5: Start Metro Bundler (for live reload)
In a **separate terminal**:
```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native start
```

## Option 2: Install on Physical Android Phone

### Step 1: Enable Developer Options
1. Go to: **Settings → About Phone**
2. Tap **"Build Number"** 7 times
3. You'll see: "You are now a developer"

### Step 2: Enable USB Debugging
1. Go to: **Settings → Developer Options**
2. Turn on **"USB Debugging"**

### Step 3: Connect Phone
1. Connect phone to computer via USB
2. On phone: **Allow USB debugging** when prompted
3. Check **"Always allow from this computer"**

### Step 4: Install APK
```bash
cd C:\Dev\EsusuHub_ReactNative
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 5: Launch App
```bash
adb shell am start -n com.esusuhub/.MainActivity
```

### Step 6: Start Metro Bundler
In a **separate terminal**:
```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native start
```

## Option 3: Transfer APK to Phone Manually

If you prefer not to use ADB:

### Step 1: Copy APK to Phone
- **APK Location:** `C:\Dev\EsusuHub_ReactNative\android\app\build\outputs\apk\debug\app-debug.apk`
- Transfer via:
  - USB file transfer
  - Email to yourself
  - Cloud storage (Google Drive, Dropbox, etc.)
  - Bluetooth

### Step 2: Install on Phone
1. On your phone, open the APK file
2. If prompted: **Allow installation from unknown sources**
3. Tap **"Install"**
4. Tap **"Open"** to launch

### Step 3: Start Metro Bundler (for live reload)
```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native start
```

Then on your phone, shake it (or press Ctrl+M in emulator) and select "Reload" to connect to Metro.

## Quick Command Reference

```bash
# Check if device/emulator connected:
adb devices

# Install APK:
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Launch app:
adb shell am start -n com.esusuhub/.MainActivity

# Start Metro bundler:
npx react-native start
```

## Troubleshooting

### "adb: no devices/emulators found"
- Start an emulator in Android Studio, OR
- Connect a physical device with USB debugging enabled

### "device offline"
```bash
adb kill-server
adb start-server
adb devices
```

### "INSTALL_FAILED"
- Wait for device to fully boot
- Uninstall old version: `adb uninstall com.esusuhub`
- Try installing again

---

**Remember:** APK files are Android-specific. You need an Android device or emulator to run them!

