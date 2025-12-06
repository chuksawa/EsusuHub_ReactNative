# Check if Emulator Can Reach Server

## The Problem
The app is sending requests to `http://10.0.0.187:5166/api/auth/register` but they're timing out. This means the emulator can't reach the server.

## Check Backend Logs
Look at your backend server terminal. When you try to register, do you see:
- `📥 [REGISTER] Request received:` - If YES, the request is reaching the server
- If NO, the request isn't reaching the server at all

## Solutions

### Solution 1: Use ADB Port Forwarding
This forwards the emulator's port to your computer:

```bash
adb reverse tcp:5166 tcp:5166
```

Then change `src/config/env.ts` back to:
```typescript
return 'http://localhost:5166/api';
```

### Solution 2: Check Windows Network Profile
The firewall rule might only apply to "Private" networks, but your connection might be "Public":

1. Open Windows Settings → Network & Internet → Status
2. Check your network profile (Private/Public)
3. If Public, change it to Private, or add firewall rule for Public profile

### Solution 3: Disable Windows Firewall Temporarily (Testing Only)
1. Windows Defender Firewall → Turn Windows Defender Firewall on or off
2. Turn off for Private networks (temporarily)
3. Test registration
4. **Turn it back on!**

### Solution 4: Use Physical Device
Connect your Android phone via USB and use your computer's IP address.

## Password Requirements
The backend now requires:
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number

Example: `Test1234` ✅

