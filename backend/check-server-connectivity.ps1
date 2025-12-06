# Check Backend Server Connectivity
Write-Host "🔍 Checking Backend Server Connectivity..." -ForegroundColor Cyan
Write-Host ""

# Check if server is listening
Write-Host "1. Checking if server is listening on port 5166..." -ForegroundColor Yellow
$listening = netstat -ano | Select-String ":5166.*LISTENING"
if ($listening) {
    Write-Host "   ✅ Server is listening on port 5166" -ForegroundColor Green
    $listening | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "   ❌ Server is NOT listening on port 5166" -ForegroundColor Red
    Write-Host "   💡 Start server with: cd backend && npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test localhost connection
Write-Host "2. Testing localhost connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5166/health" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Server responds on localhost:5166" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Cannot connect to localhost:5166" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Get local IP address
Write-Host "3. Finding your computer's IP address..." -ForegroundColor Yellow
$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 3
if ($ipAddresses) {
    Write-Host "   Your computer's IP addresses:" -ForegroundColor Green
    $ipAddresses | ForEach-Object { 
        Write-Host "   - $($_.IPAddress)" -ForegroundColor Cyan
        Write-Host "     Try using: http://$($_.IPAddress):5166/api" -ForegroundColor Gray
    }
} else {
    Write-Host "   ⚠️  Could not find IP address" -ForegroundColor Yellow
}

Write-Host ""

# Check Windows Firewall
Write-Host "4. Checking Windows Firewall..." -ForegroundColor Yellow
$firewallRule = Get-NetFirewallRule -DisplayName "EsusuHub Backend" -ErrorAction SilentlyContinue
if ($firewallRule) {
    Write-Host "   ✅ Firewall rule exists for EsusuHub Backend" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  No firewall rule found for port 5166" -ForegroundColor Yellow
    Write-Host "   💡 Windows Firewall may be blocking connections" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   To add firewall rule, run as Administrator:" -ForegroundColor Cyan
    Write-Host "   New-NetFirewallRule -DisplayName 'EsusuHub Backend' -Direction Inbound -LocalPort 5166 -Protocol TCP -Action Allow" -ForegroundColor White
}

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   - Android emulator should use: http://10.0.2.2:5166/api" -ForegroundColor White
Write-Host "   - Or use your computer's IP: http://<YOUR_IP>:5166/api" -ForegroundColor White
Write-Host "   - Update src/config/env.ts if needed" -ForegroundColor White

