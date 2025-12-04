# How to Run EsusuHub React Native App

## Prerequisites

1. ✅ **Backend Server Running** - Make sure your backend API is running on `http://localhost:5166`
2. ✅ **Android Studio** - Installed with an emulator set up
3. ✅ **Dependencies** - `npm install` completed

## Step-by-Step Guide

### Step 1: Start Backend Server (Required First!)

Open a terminal and start the backend:

```powershell
cd backend
npm run dev
```

Keep this running! The app needs the backend API.

### Step 2: Start Android Emulator

1. Open **Android Studio**
2. Go to **Tools → Device Manager**
3. Click the **▶️ Play** button next to an emulator
4. Wait for it to fully boot (1-2 minutes)

Verify it's running:
```powershell
adb devices
```
Should show: `emulator-5554    device`

### Step 3: Start Metro Bundler

Open a **NEW terminal** (keep backend running in the first one):

```powershell
cd C:\Dev\EsusuHub_ReactNative
npm start
```

This starts the Metro bundler. Keep this terminal open!

### Step 4: Run the App

Open **ANOTHER terminal** and run:

```powershell
cd C:\Dev\EsusuHub_ReactNative
npm run android
```

Or:
```powershell
npx react-native run-android
```

## Quick Commands Summary

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Metro:**
```powershell
npm start
```

**Terminal 3 - Run App:**
```powershell
npm run android
```

## Troubleshooting

### "Could not connect to development server"
- Make sure Metro bundler is running (`npm start`)
- Check that backend server is running on port 5166
- Try: `adb reverse tcp:8081 tcp:8081` (for Metro)
- Try: `adb reverse tcp:5166 tcp:5166` (for backend API)

### "SDK location not found"
Set environment variable:
```powershell
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
```

### "Device not found"
```powershell
adb devices
adb kill-server
adb start-server
```

### App can't connect to backend
- Verify backend is running: `http://localhost:5166/health`
- Check `.env` file has: `API_BASE_URL=http://localhost:5166/api`
- For emulator, use `10.0.2.2` instead of `localhost`:
  - Update `.env`: `API_BASE_URL=http://10.0.2.2:5166/api`

## Important Notes

- **Android Emulator**: Use `10.0.2.2` instead of `localhost` to access your computer's localhost
- **Physical Device**: Use your computer's IP address (e.g., `http://192.168.1.100:5166/api`)
- **Backend must be running** before starting the app

