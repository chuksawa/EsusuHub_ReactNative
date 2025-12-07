# Start the Backend Server

## The server isn't running - that's why you're getting network errors!

## Quick Fix:

**Open a new terminal/PowerShell window and run:**

```powershell
cd C:\Dev\EsusuHub_ReactNative\backend
npm run dev
```

**You should see:**
```
🚀 Server running on port 5166
📡 API available at http://localhost:5166/api
📱 For Android emulator: http://10.0.2.2:5166/api
🌍 Environment: development
✅ Database connected successfully
```

**Keep this terminal visible** - this is where you'll see all the registration logs!

## Then:

1. **Reload the React Native app** (press `R` twice in Metro bundler)
2. **Try registering Bob again**

The config is now set to `http://10.0.2.2:5166/api` which is the standard Android emulator address for accessing the host machine.

## If You Still Get Network Errors:

Even with firewall disabled, try:
1. **Use ADB port forwarding:**
   ```powershell
   adb reverse tcp:5166 tcp:5166
   ```
   Then change config back to `http://localhost:5166/api`

2. **Or use your computer's IP:**
   Change `src/config/env.ts` line 36 to:
   ```typescript
   return 'http://10.0.0.187:5166/api';
   ```

