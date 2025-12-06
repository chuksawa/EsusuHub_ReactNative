# Network Setup for Android Emulator

## Problem
Android emulator cannot connect to backend server at `10.0.2.2:5166`.

## Solution 1: Add Windows Firewall Rule (Recommended)

**Run PowerShell as Administrator:**
```powershell
cd C:\Dev\EsusuHub_ReactNative\backend
powershell -ExecutionPolicy Bypass -File add-firewall-rule.ps1
```

**Or manually:**
```powershell
New-NetFirewallRule -DisplayName "EsusuHub Backend" -Direction Inbound -LocalPort 5166 -Protocol TCP -Action Allow
```

## Solution 2: Use Your Computer's IP Address

If `10.0.2.2` doesn't work, use your computer's actual IP:

1. **Find your IP address:**
   ```powershell
   ipconfig | findstr IPv4
   ```
   Look for something like `192.168.1.100` (NOT 127.0.0.1)

2. **Update `src/config/env.ts` line 33:**
   ```typescript
   API_BASE_URL: getEnvVar('API_BASE_URL', __DEV__ 
     ? 'http://192.168.1.100:5166/api'  // Replace with YOUR IP
     : 'https://api.esusuhub.com/api'),
   ```

3. **Reload the app**

## Solution 3: Temporarily Disable Firewall (Testing Only)

1. Open Windows Defender Firewall
2. Turn off firewall for Private networks (temporarily)
3. Test registration
4. **Remember to turn it back on!**

## Verify Server is Running

**Check if server is listening:**
```powershell
netstat -ano | findstr :5166
```

Should show:
```
TCP    0.0.0.0:5166           0.0.0.0:0              LISTENING       <PID>
```

**Test from browser:**
Open: `http://localhost:5166/health`

Should show: `{"status":"ok","timestamp":"..."}`

## Test from Emulator

If you have `adb` installed:
```powershell
adb shell
curl http://10.0.2.2:5166/health
```

## Quick Test

The app now has a connection test that runs before registration (in dev mode). It will tell you if the server is reachable.

