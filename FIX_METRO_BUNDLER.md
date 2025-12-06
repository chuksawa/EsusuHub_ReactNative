# Fix Metro Bundler Connection Issue

## Problem
Emulator can't connect to Metro bundler on `10.0.2.2:8081` - "compiling js failed"

## Solution

### Step 1: Stop Metro Bundler
If Metro is running, stop it (Ctrl+C in the Metro terminal)

### Step 2: Clear Metro Cache and Restart
```powershell
cd C:\Dev\EsusuHub_ReactNative
npx react-native start --reset-cache
```

### Step 3: In Another Terminal, Rebuild the App
```powershell
cd C:\Dev\EsusuHub_ReactNative
npx react-native run-android
```

## Alternative: Use ADB Port Forwarding

If `10.0.2.2:8081` still doesn't work:

```powershell
adb reverse tcp:8081 tcp:8081
```

Then reload the app in the emulator.

## Check Metro is Running

You should see in the Metro terminal:
```
Metro waiting on exp://10.0.2.2:8081
```

If you see errors, share them and we'll fix them.

