# How to View Backend Server Logs

## Where Are the Logs?

The backend server logs are displayed in the **terminal/console** where you started the server.

## Starting the Server (to see logs)

1. **Open a new terminal/PowerShell window**
2. **Navigate to the backend directory:**
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

## What to Look For

When you try to register from the app, you should see logs like:

### If Request Reaches Server:
```
[2025-12-05T...] POST /api/auth/register from ::ffff:10.0.0.187
📥 [REGISTER] Request received: { ip: '::ffff:10.0.0.187', ... }
```

### If Request Doesn't Reach Server:
- **No logs at all** - The request is timing out before reaching the server
- This means it's a network/firewall issue

## Log Format

- **Morgan logs**: `POST /api/auth/register 200 123ms` (method, path, status, time)
- **Custom logs**: `📥 [REGISTER] Request received:` (our custom logging)
- **Error logs**: `Error: { message, code, statusCode, ... }`

## Quick Check

Run this to see if the server is running:
```powershell
netstat -ano | findstr :5166
```

If you see `LISTENING`, the server is running. Find the terminal where you started it to see the logs.

