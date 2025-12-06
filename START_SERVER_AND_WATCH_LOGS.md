# Start Server and Watch Logs

## Steps

1. **Open a new terminal/PowerShell window** (keep it visible)

2. **Navigate to backend directory:**
   ```powershell
   cd C:\Dev\EsusuHub_ReactNative\backend
   ```

3. **Start the server:**
   ```powershell
   npm run dev
   ```

4. **You should see:**
   ```
   🚀 Server running on port 5166
   📡 API available at http://localhost:5166/api
   📱 For Android emulator: http://10.0.2.2:5166/api
   🌍 Environment: development
   ```

5. **Keep this terminal visible** - this is where all logs will appear!

6. **Now try registering Bob in the app**

7. **Watch the terminal for:**
   - `[2025-12-05T...] POST /api/auth/register from ...` (request received)
   - `📥 [REGISTER] Request received: { ... }` (our custom log)
   - Any error messages

## What the Logs Tell Us

- **If you see `📥 [REGISTER] Request received:`** → Request reached server (good!)
  - Then it's likely a database timeout issue
  - The server will show database errors if any

- **If you see NOTHING** → Request never reached server
  - Network/firewall issue
  - Emulator can't connect to `10.0.0.187:5166`

## Quick Start Command
```powershell
cd C:\Dev\EsusuHub_ReactNative\backend && npm run dev
```

