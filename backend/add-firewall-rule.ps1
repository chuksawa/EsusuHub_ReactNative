# Add Windows Firewall Rule for EsusuHub Backend
# Run this script as Administrator

Write-Host "🔧 Adding Windows Firewall Rule for EsusuHub Backend..." -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell" -ForegroundColor White
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Or run this command manually:" -ForegroundColor Yellow
    Write-Host "New-NetFirewallRule -DisplayName 'EsusuHub Backend' -Direction Inbound -LocalPort 5166 -Protocol TCP -Action Allow" -ForegroundColor White
    exit 1
}

try {
    # Check if rule already exists
    $existingRule = Get-NetFirewallRule -DisplayName "EsusuHub Backend" -ErrorAction SilentlyContinue
    
    if ($existingRule) {
        Write-Host "⚠️  Firewall rule already exists" -ForegroundColor Yellow
        Write-Host "   Removing old rule..." -ForegroundColor Gray
        Remove-NetFirewallRule -DisplayName "EsusuHub Backend"
    }
    
    # Add new firewall rule
    New-NetFirewallRule -DisplayName "EsusuHub Backend" -Direction Inbound -LocalPort 5166 -Protocol TCP -Action Allow -Profile Private, Domain
    
    Write-Host "✅ Firewall rule added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The backend server should now be accessible from:" -ForegroundColor Cyan
    Write-Host "  - Android Emulator: http://10.0.2.2:5166" -ForegroundColor White
    Write-Host "  - Localhost: http://localhost:5166" -ForegroundColor White
    Write-Host ""
    Write-Host "Try registering again in the app!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error adding firewall rule:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

