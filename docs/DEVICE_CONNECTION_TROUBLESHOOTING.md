# Troubleshooting: No Android Device/Emulator Found

## Error
```
adb.exe: no devices/emulators found
```

## Solutions

### Option 1: Start Android Emulator

If you want to use an emulator:

1. **Open Android Studio**
2. **Go to:** Tools → Device Manager (or AVD Manager)
3. **Start an emulator:**
   - Click the ▶️ play button next to an emulator
   - Or create a new one if none exist

4. **Wait for emulator to boot** (may take 1-2 minutes)

5. **Verify connection:**
   ```bash
   adb devices
   ```
   Should show: `emulator-5554    device`

### Option 2: Connect Physical Device via USB

If you want to use a physical Android phone:

1. **Enable Developer Options:**
   - Go to: Settings → About Phone
   - Tap "Build Number" 7 times
   - You'll see "You are now a developer"

2. **Enable USB Debugging:**
   - Go to: Settings → Developer Options
   - Enable "USB Debugging"
   - Enable "Install via USB" (if available)

3. **Connect Phone:**
   - Connect phone to computer via USB cable
   - On phone: Allow USB debugging when prompted
   - Check "Always allow from this computer"

4. **Verify connection:**
   ```bash
   adb devices
   ```
   Should show: `[device-id]    device`

### Option 3: Connect Physical Device via WiFi (Advanced)

1. **First connect via USB:**
   ```bash
   adb devices
   ```

2. **Get device IP:**
   - Settings → About Phone → Status → IP Address
   - Or: `adb shell ip addr show wlan0`

3. **Connect via WiFi:**
   ```bash
   adb tcpip 5555
   adb connect [device-ip]:5555
   ```

4. **Disconnect USB** (optional)

5. **Verify:**
   ```bash
   adb devices
   ```

## Quick Checks

### Check if ADB is working:
```bash
adb version
```
Should show ADB version number.

### Check if any devices are connected:
```bash
adb devices
```

### Restart ADB server (if needed):
```bash
adb kill-server
adb start-server
adb devices
```

## Common Issues

### Issue: Device shows as "unauthorized"
**Solution:**
- On device: Check "Always allow from this computer"
- Revoke USB debugging authorizations and reconnect

### Issue: Device shows as "offline"
**Solution:**
```bash
adb kill-server
adb start-server
adb devices
```

### Issue: No devices even though emulator is running
**Solution:**
- Restart ADB: `adb kill-server && adb start-server`
- Restart emulator
- Check if emulator is fully booted (wait for home screen)

### Issue: USB device not recognized
**Solution:**
- Install device drivers (Google USB Driver)
- Try different USB cable
- Try different USB port
- Enable "USB Debugging" in Developer Options

## Next Steps After Device is Connected

Once `adb devices` shows a device:

1. **Start Metro bundler:**
   ```bash
   cd C:\Dev\EsusuHub_ReactNative
   npx react-native start
   ```

2. **Forward port (if using USB):**
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

3. **Run the app:**
   ```bash
   npx react-native run-android
   ```

Or manually:
```bash
adb shell am start -n com.esusuhub/.MainActivity
```

## Alternative: Run Without Device Connection

If you just want to build the APK without running:

```bash
cd C:\Dev\EsusuHub_ReactNative\android
.\gradlew.bat assembleDebug
```

APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

You can install this APK manually on your device later.

---

**Most Common Solution:** Start an Android emulator from Android Studio, or connect a physical device with USB debugging enabled.

