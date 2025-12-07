# Full App Reload Required

## Problem
The app is still using the old URL (`10.0.2.2:5166`) instead of the new one (`localhost:5166`).

## Solution: Full Reload

The config change requires a **full app reload**, not just a Metro reload.

### Option 1: Force Reload (Quick)
1. **Close the app completely** in the emulator
2. **Shake device** (or press `Ctrl+M` in emulator)
3. Select **"Reload"**

### Option 2: Rebuild App (Most Reliable)
```powershell
# Stop Metro (Ctrl+C in Metro terminal)

# Rebuild and run
npx react-native run-android
```

This will:
- Rebuild the app with the new config
- Install it on the emulator
- Connect to Metro bundler

### Option 3: Clear App Data and Reload
```powershell
# Clear app data
adb shell pm clear com.esusuhub

# Reload app
adb shell am start -n com.esusuhub/.MainActivity
```

## After Reload

The app should now use: `http://localhost:5166/api`

With ADB port forwarding (`adb reverse tcp:5166 tcp:5166`), this will work!

## Verify

After reload, check the logs. You should see:
```
[ApiClient] POST http://localhost:5166/api/auth/register
```

NOT:
```
[ApiClient] POST http://10.0.2.2:5166/api/auth/register
```

