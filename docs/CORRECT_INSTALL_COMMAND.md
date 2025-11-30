# Correct Command to Install APK

## ❌ Wrong Way
```bash
android/app/build/outputs/apk/debug/app-debug.apk
```
This tries to run the file directly, which Windows can't do.

## ✅ Correct Way

You need to use the `adb install` command:

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Step-by-Step Instructions

### Step 1: Open Terminal/PowerShell
Make sure you're in the project directory:
```bash
cd C:\Dev\EsusuHub_ReactNative
```

### Step 2: Check if Device is Connected
```bash
adb devices
```
**You should see a device listed.** If not, you need to:
- Start an Android emulator, OR
- Connect a physical Android device

### Step 3: Install the APK
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Expected output:**
```
Performing Streamed Install
Success
```

### Step 4: Launch the App
```bash
adb shell am start -n com.esusuhub/.MainActivity
```

### Step 5: Start Metro Bundler (in separate terminal)
```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native start
```

## Complete Command Sequence

Copy and paste these commands one by one:

```bash
# 1. Navigate to project
cd C:\Dev\EsusuHub_ReactNative

# 2. Check device connection
adb devices

# 3. Install APK (THE CORRECT COMMAND)
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 4. Launch app
adb shell am start -n com.esusuhub/.MainActivity
```

## Important Notes

1. **You must have a device/emulator connected first**
   - Run `adb devices` to check
   - If empty, start an emulator or connect a phone

2. **The command is `adb install`** (not just the file path)
   - `adb` = Android Debug Bridge tool
   - `install` = the install command
   - `android/app/build/outputs/apk/debug/app-debug.apk` = the APK file path

3. **Make sure you're in the project root directory**
   - The path is relative to `C:\Dev\EsusuHub_ReactNative`

## If You Get "no devices/emulators found"

You need to connect a device first:

### Option A: Start Android Emulator
1. Open Android Studio
2. Tools → Device Manager
3. Click play button on an emulator
4. Wait for it to boot
5. Then run `adb devices` again

### Option B: Connect Physical Phone
1. Enable Developer Options (tap Build Number 7 times)
2. Enable USB Debugging
3. Connect via USB
4. Allow USB debugging on phone
5. Then run `adb devices` again

---

**Remember:** The command is `adb install` followed by the file path, not just the file path alone!

