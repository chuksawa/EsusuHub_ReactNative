# How to Reload the React Native App

## Quick Reload (Fast Refresh)
1. **Press `R` twice** in the Metro bundler terminal window
2. Or shake the emulator device and select "Reload"

## Full Reload (If Fast Refresh Doesn't Work)

### Option 1: Restart Metro Bundler
1. Stop Metro bundler (Ctrl+C in the terminal)
2. Run: `npm start` or `npx react-native start`
3. In a new terminal, run: `npx react-native run-android`

### Option 2: Clear Cache and Reload
```bash
# Stop Metro bundler first (Ctrl+C)

# Clear Metro cache
npx react-native start --reset-cache

# In another terminal, rebuild and run
npx react-native run-android
```

### Option 3: Full Clean Rebuild
```bash
# Stop Metro bundler

# Clean Android build
cd android
./gradlew clean
cd ..

# Clear Metro cache
npx react-native start --reset-cache

# In another terminal
npx react-native run-android
```

## Verify Config Change
After reloading, the app should now use:
- **API URL**: `http://10.0.0.187:5166/api` (your computer's IP)

If you still see `10.0.2.2` in error messages, the app hasn't reloaded yet.

