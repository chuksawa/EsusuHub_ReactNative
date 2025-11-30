# How to Preview EsusuHub React Native App

## Quick Preview Options

### Option 1: Start Metro Bundler (Required First)

```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native start
```

Or using npm script:
```bash
npm start
```

This starts the Metro bundler which serves your JavaScript bundle.

### Option 2: Preview on Android Emulator

**Prerequisites:**
- Android Studio installed
- Android emulator running

**Steps:**
1. Start Metro bundler (from Option 1)
2. In a new terminal:
   ```bash
   npx react-native run-android
   ```
   
   Or:
   ```bash
   npm run android
   ```

### Option 3: Preview on iOS Simulator (macOS only)

**Prerequisites:**
- Xcode installed
- iOS Simulator available

**Steps:**
1. Start Metro bundler (from Option 1)
2. In a new terminal:
   ```bash
   npx react-native run-ios
   ```
   
   Or:
   ```bash
   npm run ios
   ```

### Option 4: Preview on Physical Device

#### Android Device
1. Enable USB debugging on your Android device
2. Connect via USB
3. Verify connection: `adb devices`
4. Run: `npx react-native run-android`

#### iOS Device (macOS only)
1. Connect iPhone/iPad via USB
2. Trust computer on device
3. Open Xcode and select device
4. Run: `npx react-native run-ios --device="Your Device Name"`

## Using npx Commands

### Start Metro Bundler
```bash
npx react-native start
```

### Run on Android
```bash
npx react-native run-android
```

### Run on iOS
```bash
npx react-native run-ios
```

### Run with Specific Options
```bash
# Android with specific device
npx react-native run-android --deviceId=<DEVICE_ID>

# iOS with specific simulator
npx react-native run-ios --simulator="iPhone 14 Pro"

# Reset Metro cache
npx react-native start --reset-cache
```

## Complete Preview Workflow

### Step-by-Step Preview

1. **Install Dependencies** (if not done)
   ```bash
   npm install
   ```

2. **Start Metro Bundler**
   ```bash
   npx react-native start
   ```
   Keep this terminal open.

3. **Run on Platform** (in new terminal)
   
   For Android:
   ```bash
   npx react-native run-android
   ```
   
   For iOS:
   ```bash
   npx react-native run-ios
   ```

4. **View App**
   - Android: App will launch on emulator/device
   - iOS: App will launch on simulator/device

## Troubleshooting Preview Issues

### Metro Bundler Won't Start
```bash
# Clear cache and restart
npx react-native start --reset-cache
```

### App Won't Load
```bash
# Rebuild the app
npx react-native run-android --reset-cache
# or
npx react-native run-ios --reset-cache
```

### Port 8081 Already in Use
```bash
# Kill process on port 8081
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess | Stop-Process

# macOS/Linux:
lsof -ti:8081 | xargs kill -9
```

### Device Not Found
```bash
# Check connected devices
adb devices  # Android
xcrun simctl list devices  # iOS
```

## Development Preview Tips

### Hot Reload
- Enabled by default
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Select "Enable Hot Reloading"

### Debug Menu
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Options:
  - Reload
  - Debug
  - Enable Hot Reloading
  - Show Inspector

### Fast Refresh
- Automatically enabled
- Saves your changes and reloads the app
- Works for most code changes

## Alternative Preview Methods

### Using React Native Debugger
```bash
# Install globally
npm install -g react-native-debugger

# Or use npx
npx react-native-debugger
```

### Using Flipper
1. Download Flipper from https://fbflipper.com/
2. Start Flipper
3. Run your app
4. App will appear in Flipper automatically

## Quick Commands Reference

```bash
# Start Metro
npx react-native start

# Run Android
npx react-native run-android

# Run iOS
npx react-native run-ios

# Clear cache
npx react-native start --reset-cache

# Check React Native version
npx react-native --version

# Get help
npx react-native --help
```

---

**Note:** This is a bare React Native project. For Expo projects, you would use `npx expo start` instead.

**Last Updated:** January 2025

