# Fix: "Requiring Unknown Module" Error

## Error
```
requiring unknown module 3496. if you are sure the module exists, try restarting metro. you may also want to run yarn or npm install
```

## Solution: Clear Metro Cache and Restart

### Step 1: Stop Metro Bundler
If Metro is running, press `Ctrl+C` to stop it.

### Step 2: Clear Metro Cache and Restart
```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native start --reset-cache
```

The `--reset-cache` flag clears Metro's cache and rebuilds it.

### Step 3: Reload the App
On your device/emulator:
- **Shake device** (or press `Ctrl+M` in emulator)
- Select **"Reload"**

Or use command:
```bash
adb shell input keyevent 82
# Then select "Reload"
```

## If That Doesn't Work: Full Clean

### Option 1: Clear All Caches
```bash
cd C:\Dev\EsusuHub_ReactNative

# Clear Metro cache
npx react-native start --reset-cache

# In another terminal, also try:
npm start -- --reset-cache
```

### Option 2: Reinstall Dependencies
```bash
cd C:\Dev\EsusuHub_ReactNative

# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Then restart Metro
npx react-native start --reset-cache
```

### Option 3: Clear Watchman Cache (if installed)
```bash
watchman watch-del-all
```

### Option 4: Complete Clean Rebuild
```bash
cd C:\Dev\EsusuHub_ReactNative

# 1. Clear node_modules
Remove-Item -Recurse -Force node_modules

# 2. Clear Metro cache
Remove-Item -Recurse -Force $env:TEMP/metro-* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP/haste-* -ErrorAction SilentlyContinue

# 3. Reinstall dependencies
npm install

# 4. Clear Android build cache
cd android
.\gradlew.bat clean
cd ..

# 5. Start Metro with reset cache
npx react-native start --reset-cache
```

## Quick Fix (Try This First)

**Stop Metro** (Ctrl+C), then:

```bash
cd C:\Dev\EsusuHub_ReactNative
npx react-native start --reset-cache
```

Wait for Metro to fully start, then **reload the app** on your device.

## Common Causes

1. **Corrupted Metro cache** - Fixed by `--reset-cache`
2. **Missing dependencies** - Fixed by `npm install`
3. **Stale bundle** - Fixed by clearing cache and reloading
4. **Module resolution issues** - Fixed by reinstalling node_modules

## After Fixing

Once Metro starts successfully:
1. You should see "Metro waiting on port 8081..."
2. Reload the app on your device
3. You should see "BUNDLE" progress in Metro terminal
4. App should load properly

---

**Most likely fix:** Stop Metro and restart with `npx react-native start --reset-cache`

