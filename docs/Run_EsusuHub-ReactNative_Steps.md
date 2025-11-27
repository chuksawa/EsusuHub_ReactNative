# How to Run EsusuHub React Native App

This guide provides step-by-step instructions for running the EsusuHub React Native application on Android and iOS devices/emulators.

---

## 📋 Prerequisites

### Required Software

#### For All Platforms
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** ([Download](https://git-scm.com/))
- **React Native CLI** (install globally: `npm install -g react-native-cli`)

#### For Android Development
- **Java Development Kit (JDK)** 11 or higher ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Android Studio** ([Download](https://developer.android.com/studio))
- **Android SDK** (installed via Android Studio)
- **Android Emulator** or physical Android device

#### For iOS Development (macOS only)
- **macOS** (required for iOS development)
- **Xcode** 14.0 or higher ([Download from App Store](https://apps.apple.com/us/app/xcode/id497799835))
- **CocoaPods** (install: `sudo gem install cocoapods`)
- **iOS Simulator** (included with Xcode) or physical iOS device
- **Xcode Command Line Tools** (`xcode-select --install`)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd EsusuHub_ReactNative
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```bash
cp ENV_SETUP.md .env
# Edit .env with your configuration
```

Minimum required variables:
```env
API_BASE_URL=http://localhost:5166/api
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 4. Start Metro Bundler

```bash
npm start
```

Keep this terminal window open. Metro bundler will start and show a QR code.

---

## 📱 Running on Android

### Option 1: Android Emulator

#### Step 1: Set Up Android Studio

1. **Install Android Studio**
   - Download from [developer.android.com/studio](https://developer.android.com/studio)
   - Run the installer and follow the setup wizard
   - Install Android SDK, Android SDK Platform, and Android Virtual Device

2. **Configure Android SDK**
   - Open Android Studio
   - Go to **Tools** → **SDK Manager**
   - Install:
     - Android SDK Platform 33 (or latest)
     - Android SDK Build-Tools
     - Android Emulator
     - Intel x86 Atom_64 System Image (or Google APIs System Image)

3. **Set Environment Variables** (Windows)
   ```powershell
   # Add to System Environment Variables
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   # Add to PATH
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

   (macOS/Linux)
   ```bash
   # Add to ~/.bash_profile or ~/.zshrc
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```

#### Step 2: Create Android Virtual Device (AVD)

1. Open Android Studio
2. Go to **Tools** → **Device Manager**
3. Click **Create Device**
4. Select a device (e.g., Pixel 5)
5. Select a system image (e.g., Android 13 - API 33)
6. Click **Finish**

#### Step 3: Start the Emulator

1. In Android Studio Device Manager, click the **Play** button next to your AVD
2. Or from command line:
   ```bash
   emulator -avd <AVD_NAME>
   ```

#### Step 4: Run the App

```bash
npm run android
```

Or with specific device:
```bash
npm run android -- --deviceId=<DEVICE_ID>
```

### Option 2: Physical Android Device

#### Step 1: Enable Developer Options

1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times
3. Go back to **Settings** → **Developer Options**
4. Enable **USB Debugging**

#### Step 2: Connect Device

1. Connect your Android device via USB
2. Accept the USB debugging prompt on your device
3. Verify connection:
   ```bash
   adb devices
   ```
   You should see your device listed.

#### Step 3: Run the App

```bash
npm run android
```

### Android Troubleshooting

#### Issue: "SDK location not found"
```bash
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS/Linux
# or
set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk  # Windows
```

#### Issue: "Gradle build failed"
```bash
cd android
./gradlew clean
cd ..
npm run android
```

#### Issue: "Metro bundler not found"
```bash
npm start
# In another terminal
npm run android
```

#### Issue: "Device not found"
```bash
# Check connected devices
adb devices

# Restart ADB
adb kill-server
adb start-server
```

---

## 🍎 Running on iOS

### Option 1: iOS Simulator

#### Step 1: Install Xcode

1. Open **App Store** on macOS
2. Search for **Xcode**
3. Click **Install** (this may take a while, ~10GB)

#### Step 2: Install Xcode Command Line Tools

```bash
xcode-select --install
```

#### Step 3: Install CocoaPods

```bash
sudo gem install cocoapods
```

#### Step 4: Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

#### Step 5: Start iOS Simulator

```bash
# List available simulators
xcrun simctl list devices

# Open Simulator app
open -a Simulator

# Or start specific simulator
xcrun simctl boot "iPhone 14"
```

#### Step 6: Run the App

```bash
npm run ios
```

Or with specific simulator:
```bash
npm run ios -- --simulator="iPhone 14 Pro"
```

### Option 2: Physical iOS Device

#### Step 1: Configure Signing

1. Open `ios/EsusuHub.xcworkspace` in Xcode
2. Select your project in the navigator
3. Go to **Signing & Capabilities** tab
4. Select your **Team** (Apple Developer account)
5. Xcode will automatically manage signing

#### Step 2: Connect Device

1. Connect your iOS device via USB
2. Trust the computer on your device
3. In Xcode, select your device from the device dropdown

#### Step 3: Run the App

```bash
npm run ios -- --device="Your Device Name"
```

Or build and run from Xcode:
1. Select your device in Xcode
2. Click the **Play** button

### iOS Troubleshooting

#### Issue: "Pod install failed"
```bash
cd ios
pod deintegrate
pod install
cd ..
```

#### Issue: "No such module"
```bash
# Clean build folder in Xcode
# Product → Clean Build Folder (Shift + Cmd + K)
# Then rebuild
```

#### Issue: "Code signing error"
1. Open Xcode
2. Go to **Signing & Capabilities**
3. Select your team
4. Ensure "Automatically manage signing" is checked

#### Issue: "Simulator not found"
```bash
# List available simulators
xcrun simctl list devices available

# Boot a simulator
xcrun simctl boot "iPhone 14"
```

#### Issue: "Build failed - Command PhaseScriptExecution failed"
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

---

## 🔧 Development Commands

### Start Metro Bundler
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS
```bash
npm run ios
```

### Clear Cache and Restart
```bash
# Clear Metro bundler cache
npm start -- --reset-cache

# Clear React Native cache
npm start -- --reset-cache
# Or
watchman watch-del-all  # If watchman is installed
rm -rf node_modules
npm install
```

### Run Tests
```bash
npm test
npm run test:watch
npm run test:coverage
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npm run type-check
```

---

## 📱 Platform-Specific Notes

### Android

#### Supported Versions
- **Minimum:** Android 5.0 (API 21)
- **Target:** Android 13+ (API 33+)
- **Tested on:** Android 5.0 through Android 13

#### Device Requirements
- **RAM:** Minimum 2GB
- **Storage:** 100MB free space
- **Screen:** Any size (responsive design)

#### Permissions
The app requests these permissions:
- **Internet** - For API calls
- **Storage** - For image uploads (Android 12 and below)
- **Camera** - For taking photos
- **Notifications** - For push notifications (Android 13+)

### iOS

#### Supported Versions
- **Minimum:** iOS 13.0
- **Target:** iOS 17.0+
- **Tested on:** iOS 13.0 through iOS 17.0

#### Device Requirements
- **iPhone:** iPhone 6s or newer
- **iPad:** iPad Air 2 or newer
- **Storage:** 100MB free space

#### Permissions
The app requests these permissions:
- **Camera** - For taking photos
- **Photo Library** - For selecting images
- **Notifications** - For push notifications

---

## 🐛 Common Issues and Solutions

### Metro Bundler Issues

#### Port 8081 already in use
```bash
# Kill process on port 8081
# macOS/Linux
lsof -ti:8081 | xargs kill -9

# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

#### Metro bundler not starting
```bash
npm start -- --reset-cache
```

### Build Issues

#### Android: Gradle sync failed
```bash
cd android
./gradlew clean
./gradlew --stop
cd ..
npm run android
```

#### iOS: Build failed
```bash
cd ios
rm -rf build
pod install
cd ..
npm run ios
```

### Device Connection Issues

#### Android: Device not recognized
```bash
# Check USB debugging is enabled
# Restart ADB
adb kill-server
adb start-server
adb devices
```

#### iOS: Device not trusted
1. On iOS device: Settings → General → Device Management
2. Trust your computer
3. Reconnect device

### Dependency Issues

#### Node modules corrupted
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

#### iOS Pods corrupted
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

---

## 🔍 Debugging

### React Native Debugger

1. **Install React Native Debugger**
   ```bash
   # Download from: https://github.com/jhen0409/react-native-debugger/releases
   ```

2. **Enable Debug Mode**
   - Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
   - Select **Debug**

### Chrome DevTools

1. Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
2. Select **Debug**
3. Chrome will open with DevTools

### Flipper (Recommended)

1. **Install Flipper**
   ```bash
   # Download from: https://fbflipper.com/
   ```

2. **Start Flipper**
   - Launch Flipper
   - Connect device
   - App will appear in Flipper

### Logs

#### View Android Logs
```bash
adb logcat *:S ReactNative:V ReactNativeJS:V
```

#### View iOS Logs
```bash
# In Xcode: Window → Devices and Simulators → View Device Logs
# Or
xcrun simctl spawn booted log stream --level=debug
```

---

## 📦 Building for Production

### Android Release Build

```bash
cd android
./gradlew assembleRelease
# APK will be in: android/app/build/outputs/apk/release/
```

### iOS Release Build

```bash
# In Xcode:
# Product → Archive
# Then distribute via App Store or Ad Hoc
```

See `docs/DEPLOYMENT.md` for detailed production build instructions.

---

## ✅ Verification Checklist

Before running, ensure:

- [ ] Node.js >= 18 installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env` file)
- [ ] Metro bundler can start (`npm start`)
- [ ] Android Studio installed (for Android)
- [ ] Xcode installed (for iOS, macOS only)
- [ ] Device/emulator connected and recognized
- [ ] No port conflicts (8081, 8082)

---

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** - Look for error messages in terminal
2. **Clear cache** - Try `npm start -- --reset-cache`
3. **Reinstall dependencies** - `rm -rf node_modules && npm install`
4. **Check documentation** - Review `README.md` and other docs
5. **Search issues** - Check GitHub issues or Stack Overflow
6. **Ask for help** - Open an issue with:
   - Error messages
   - Steps to reproduce
   - Platform and version
   - Device/emulator details

---

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Android Studio Setup](https://developer.android.com/studio)
- [Xcode Setup](https://developer.apple.com/xcode/)
- [Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)

---

**Last Updated:** January 2025

