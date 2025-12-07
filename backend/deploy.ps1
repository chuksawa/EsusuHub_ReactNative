# Quick Deploy Script for Railway
# Usage: .\deploy.ps1

Write-Host "🚀 EsusuHub Backend - Railway Deployment" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "⚠️  Railway CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @railway/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Railway CLI" -ForegroundColor Red
        exit 1
    }
}

# Check if Railway token is set
if (-not $env:RAILWAY_TOKEN) {
    Write-Host "⚠️  RAILWAY_TOKEN not set." -ForegroundColor Yellow
    Write-Host "   Get your token from: Railway Dashboard → Account Settings → Tokens" -ForegroundColor Gray
    Write-Host ""
    $token = Read-Host "Enter your Railway token (or press Enter to try browser login)"
    if ($token) {
        $env:RAILWAY_TOKEN = $token
        Write-Host "✅ Token set for this session" -ForegroundColor Green
        Write-Host "   Note: Railway CLI v4.12.0 uses token via environment variable automatically" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  No token provided. Attempting browser login..." -ForegroundColor Yellow
        Write-Host "   If this fails, get a token from Railway Dashboard and set RAILWAY_TOKEN" -ForegroundColor Gray
    }
}

# Verify authentication before proceeding
Write-Host "🔐 Verifying Railway authentication..." -ForegroundColor Cyan
$authCheck = railway whoami 2>&1
if ($LASTEXITCODE -ne 0 -and -not $env:RAILWAY_TOKEN) {
    Write-Host "❌ Not authenticated with Railway" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 To authenticate, choose one:" -ForegroundColor Yellow
    Write-Host "   1. Get token from Railway Dashboard → Account Settings → Tokens" -ForegroundColor Gray
    Write-Host "   2. Set it: `$env:RAILWAY_TOKEN='your-token'`" -ForegroundColor Gray
    Write-Host "   3. Then run this script again" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   OR try browser login:" -ForegroundColor Gray
    Write-Host "   railway login --browserless" -ForegroundColor Gray
    Write-Host "   (Visit URL immediately and enter pairing code quickly!)" -ForegroundColor Gray
    exit 1
} elseif ($LASTEXITCODE -ne 0 -and $env:RAILWAY_TOKEN) {
    Write-Host "⚠️  Token set but authentication still failing." -ForegroundColor Yellow
    Write-Host "   Railway CLI v4.12.0 may not support token auth directly." -ForegroundColor Gray
    Write-Host "   Try browser login: railway login --browserless" -ForegroundColor Gray
    Write-Host "   Or use Railway Dashboard for deployment." -ForegroundColor Gray
    exit 1
} else {
    Write-Host "✅ Authenticated: $authCheck" -ForegroundColor Green
}

# Check if we're in the backend directory
if (-not (Test-Path "package.json")) {
    Write-Host "⚠️  Not in backend directory. Changing to backend..." -ForegroundColor Yellow
    Set-Location backend
}

# Verify we're in the right place
if (-not (Test-Path "package.json") -or -not (Test-Path "Dockerfile")) {
    Write-Host "❌ Error: Must run from backend directory with Dockerfile" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Preparing deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if Railway project is initialized
if (-not (Test-Path ".railway")) {
    Write-Host "🔧 Initializing Railway project..." -ForegroundColor Yellow
    railway init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to initialize Railway project" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
        Write-Host "   - Make sure you're authenticated: railway whoami" -ForegroundColor Gray
        Write-Host "   - See backend/docs/RAILWAY_AUTH_FIX.md for authentication help" -ForegroundColor Gray
        Write-Host "   - Or use Railway Dashboard for deployment (no CLI needed)" -ForegroundColor Gray
        exit 1
    }
}

# Deploy
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Cyan
Write-Host ""
railway up

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Check Railway Dashboard for your service URL" -ForegroundColor Gray
    Write-Host "   2. Set environment variables in Railway Dashboard" -ForegroundColor Gray
    Write-Host "   3. Test: curl https://your-app.railway.app/health-quick" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔗 View logs: railway logs" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed. Check the error messages above." -ForegroundColor Red
    Write-Host "   See backend/docs/RAILWAY_SIMPLE_DEPLOY.md for troubleshooting" -ForegroundColor Gray
    exit 1
}

