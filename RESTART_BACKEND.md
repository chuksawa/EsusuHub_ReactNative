# Restart Backend Server to See Logs

## The server is already running, but you need to see the logs

### Option 1: Find the Existing Terminal
Look for a terminal/PowerShell window that shows:
```
🚀 Server running on port 5166
📡 API available at http://localhost:5166/api
```

That's where your logs are!

### Option 2: Kill and Restart (to see logs)

**Step 1: Stop the current server**
```powershell
# Find the process
netstat -ano | findstr :5166

# Kill it (replace <PID> with the actual process ID)
Stop-Process -Id <PID> -Force
```

**Step 2: Start it again in a visible terminal**
```powershell
cd C:\Dev\EsusuHub_ReactNative\backend
npm run dev
```

Now you'll see all the logs when you try to register!

### Quick Kill Script
```powershell
# Kill any node process on port 5166
$process = Get-NetTCPConnection -LocalPort 5166 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) {
    Stop-Process -Id $process -Force
    Write-Host "✅ Killed process $process on port 5166"
}
```

