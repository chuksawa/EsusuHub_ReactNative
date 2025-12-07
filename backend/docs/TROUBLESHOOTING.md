# Backend Server Troubleshooting

## Network Error: Cannot Connect to Server

### Step 1: Verify Server is Running

**Check if server process is running:**
```powershell
netstat -ano | findstr :5166
```

You should see:
```
TCP    0.0.0.0:5166           0.0.0.0:0              LISTENING       <PID>
```

**If not running, start it:**
```powershell
cd backend
npm run dev
```

### Step 2: Test Server Locally

**Test health endpoint:**
```powershell
curl http://localhost:5166/health
```

Expected response:
```json
{"status":"ok","timestamp":"..."}
```

### Step 3: Check Windows Firewall

The Android emulator uses `10.0.2.2` to access the host machine. Windows Firewall might be blocking connections.

**Temporarily disable Windows Firewall for testing:**
1. Open Windows Defender Firewall
2. Turn off firewall for Private networks (temporarily)
3. Test registration again

**Or add firewall rule:**
```powershell
New-NetFirewallRule -DisplayName "EsusuHub Backend" -Direction Inbound -LocalPort 5166 -Protocol TCP -Action Allow
```

### Step 4: Verify Server Binding

The server should be listening on `0.0.0.0:5166` (all interfaces), not just `127.0.0.1:5166`.

Check `backend/src/server.ts`:
```typescript
const server = app.listen(PORT, '0.0.0.0', () => {
  // Should bind to 0.0.0.0, not localhost
});
```

### Step 5: Test from Emulator

**Option A: Use adb to test from emulator:**
```powershell
adb shell
curl http://10.0.2.2:5166/health
```

**Option B: Check emulator network settings:**
- Emulator should use NAT networking (default)
- `10.0.2.2` is the special IP that maps to host's `127.0.0.1`

### Step 6: Alternative - Use Your Computer's IP

If `10.0.2.2` doesn't work, find your computer's local IP:

```powershell
ipconfig | findstr IPv4
```

Then update `src/config/env.ts`:
```typescript
API_BASE_URL: getEnvVar('API_BASE_URL', __DEV__ 
  ? 'http://<YOUR_IP>:5166/api'  // e.g., http://192.168.1.100:5166/api
  : 'https://api.esusuhub.com/api'),
```

### Step 7: Check Server Logs

Look at the backend terminal for:
- Server startup messages
- Request logs (if morgan is enabled)
- Error messages

### Step 8: Restart Everything

1. Stop the backend server (Ctrl+C)
2. Stop Metro bundler
3. Restart backend: `cd backend && npm run dev`
4. Restart Metro: `npm start`
5. Reload app in emulator

## Quick Fix: Register via Script

If network issues persist, you can register Bob directly:

```powershell
cd backend
npx tsx register-bob.ts
```

This will create Bob's account via the API (if server is accessible from host).

## Common Issues

1. **Server not running**: Start with `npm run dev` in backend folder
2. **Port already in use**: Kill process using port 5166
3. **Firewall blocking**: Disable firewall or add rule
4. **Wrong IP address**: Use `10.0.2.2` for Android emulator
5. **Server crashed**: Check backend terminal for errors

