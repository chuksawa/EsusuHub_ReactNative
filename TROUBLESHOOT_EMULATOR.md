# Troubleshooting Android Emulator Connection

## Current Status
- Server is running on port 5166
- Server is accessible from localhost
- Server is accessible from network IP (10.0.0.187)
- **Issue**: Android emulator cannot connect

## Solutions to Try

### Solution 1: Use Your Computer's IP (Currently: 10.0.0.187)
The config is set to use `http://10.0.2.2:5166/api` but your computer's IP is `10.0.0.187`.

**Update `src/config/env.ts` line 33:**
```typescript
return 'http://10.0.0.187:5166/api';  // Use your actual IP
```

Then reload the app.

### Solution 2: Verify Firewall Rule
The firewall rule should allow inbound connections on port 5166.

**Check rule:**
```powershell
Get-NetFirewallRule -DisplayName 'EsusuHub Backend' | Select-Object DisplayName, Enabled, Direction
```

**If not enabled, add it:**
```powershell
New-NetFirewallRule -DisplayName "EsusuHub Backend" -Direction Inbound -LocalPort 5166 -Protocol TCP -Action Allow
```

### Solution 3: Test from Emulator Directly
If you have `adb` installed:
```bash
adb shell
curl http://10.0.2.2:5166/health-quick
# or
curl http://10.0.0.187:5166/health-quick
```

### Solution 4: Check Emulator Network Settings
1. Open Android Studio
2. Go to AVD Manager
3. Edit your emulator
4. Check "Advanced Settings" → "Network"
5. Ensure it's using the default network configuration

### Solution 5: Try Both IPs
The app now has connection testing. Try:
1. First with `10.0.2.2:5166` (standard emulator address)
2. If that fails, switch to `10.0.0.187:5166` (your computer's IP)

### Solution 6: Use Physical Device
If emulator continues to fail:
1. Connect your Android phone via USB
2. Enable USB debugging
3. Find your computer's IP on your local network
4. Update config to use that IP
5. Ensure phone and computer are on same WiFi network

## Current Configuration
- **API URL**: `http://10.0.2.2:5166/api` (for emulator)
- **Alternative**: `http://10.0.0.187:5166/api` (your computer's IP)
- **Server**: Running on `0.0.0.0:5166` (all interfaces)
- **Firewall**: Rule exists and enabled

## Next Steps
1. Try switching to `10.0.0.187` in the config
2. Reload the app completely (clear cache)
3. Check Metro bundler logs for connection attempts
4. Check backend server logs for incoming requests

