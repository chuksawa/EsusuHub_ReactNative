# Quick Start Guide

## Prerequisites

- Node.js >= 18
- Android Studio (for Android) OR Xcode (for iOS, macOS only)

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Create .env file (see ENV_SETUP.md)

# 3. For iOS only: Install pods
cd ios && pod install && cd ..
```

## Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on Android
```bash
# In a new terminal
npm run android
```

### Run on iOS (macOS only)
```bash
# In a new terminal
npm run ios
```

## Detailed Instructions

For complete setup instructions including:
- Platform-specific setup
- Device configuration
- Troubleshooting
- Debugging

See: **[docs/RUNNING_THE_APP.md](docs/RUNNING_THE_APP.md)**

---

**Quick Troubleshooting:**

- **Port 8081 in use?** Kill the process or use `npm start -- --reset-cache`
- **Build failed?** Try `cd android && ./gradlew clean` (Android) or `cd ios && pod install` (iOS)
- **Device not found?** Check USB debugging (Android) or trust computer (iOS)

