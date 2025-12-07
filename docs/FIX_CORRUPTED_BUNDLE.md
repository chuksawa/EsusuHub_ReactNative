# Fix Corrupted Bundle Error

## Error
```
compiling js failed: 148192:40:)' expected at end of function call
buffer size 7911086 starts with: 766172205f5f42554e444c455f535441
```

This is a **corrupted Metro bundle cache** issue.

## Solution: Complete Cache Clear

### Step 1: Stop Metro Bundler
Press `Ctrl+C` in the Metro terminal (if running)

### Step 2: Clear All Caches
```powershell
cd C:\Dev\EsusuHub_ReactNative

# Clear Metro caches
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP/metro-* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP/haste-* -ErrorAction SilentlyContinue

# Clear Android build cache
cd android
.\gradlew.bat clean
cd ..
```

### Step 3: Restart Metro with Fresh Cache
```powershell
npx react-native start --reset-cache
```

### Step 4: Rebuild App
In another terminal:
```powershell
cd C:\Dev\EsusuHub_ReactNative
npx react-native run-android
```

## If Still Fails: Nuclear Option

```powershell
# 1. Stop Metro (Ctrl+C)

# 2. Clear everything
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force $env:TEMP/metro-* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $env:TEMP/haste-* -ErrorAction SilentlyContinue
cd android && .\gradlew.bat clean && cd ..

# 3. Reinstall
npm install

# 4. Restart Metro
npx react-native start --reset-cache

# 5. Rebuild app (in another terminal)
npx react-native run-android
```

