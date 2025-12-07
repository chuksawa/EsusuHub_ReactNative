# Ready for Emulator - Checklist

## Status Check

When the emulator boots up, verify:

### ✅ Metro Bundler
- Should be running on port 8081
- Terminal should show: "Dev server ready"
- If not running: `npx react-native start --reset-cache`

### ✅ Backend Server
- Should be running on port 5166
- If not running: `cd backend && npm run dev`

### ✅ ADB Port Forwarding
When emulator is ready, run:
```powershell
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5166 tcp:5166
```

### ✅ Verify Emulator Connection
```powershell
adb devices
```
Should show: `emulator-5554   device`

## After Emulator Boots

1. **Verify ADB connection:**
   ```powershell
   adb devices
   ```

2. **Set up port forwarding:**
   ```powershell
   adb reverse tcp:8081 tcp:8081  # Metro bundler
   adb reverse tcp:5166 tcp:5166  # Backend API
   ```

3. **Reload the app:**
   - Shake device (or `Ctrl+M` in emulator)
   - Select "Reload"
   - Or: `adb shell input keyevent 82` → Select "Reload"

4. **If app isn't installed:**
   ```powershell
   npx react-native run-android
   ```

## Quick Test

Once emulator is ready:
```powershell
# Check emulator connection
adb devices

# Forward ports
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5166 tcp:5166

# Reload app
adb shell input keyevent 82
# Then select "Reload" from menu
```

## Expected Result

- App loads successfully
- No "compiling js failed" error
- Can connect to backend API
- Can register Bob Test user

