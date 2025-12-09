# Deploy to Azure Container Registry (ACR)
# ACR Name: esusuhubcontainer

Write-Host "`n🚀 Deploying to Azure Container Registry..." -ForegroundColor Cyan
Write-Host "ACR: esusuhubcontainer" -ForegroundColor Gray
Write-Host ""

# Step 1: Check if Azure CLI is installed
Write-Host "📋 Step 1: Checking Azure CLI..." -ForegroundColor Yellow
try {
    $azVersion = az --version 2>&1
    Write-Host "✅ Azure CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI not found. Install from: https://aka.ms/installazurecliwindows" -ForegroundColor Red
    exit 1
}

# Step 2: Check if Docker is running
Write-Host "`n📋 Step 2: Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found or not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Step 3: Login to Azure
Write-Host "`n📋 Step 3: Logging in to Azure..." -ForegroundColor Yellow
az login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Azure login failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged in to Azure" -ForegroundColor Green

# Step 4: Login to ACR
Write-Host "`n📋 Step 4: Logging in to ACR (esusuhubcontainer)..." -ForegroundColor Yellow
az acr login --name esusuhubcontainer
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ACR login failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged in to ACR" -ForegroundColor Green

# Step 5: Build Docker image
Write-Host "`n📋 Step 5: Building Docker image..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
$imageName = "esusuhubcontainer.azurecr.io/esusuhub-backend:latest"
docker build -t $imageName -f backend/Dockerfile backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker image built successfully" -ForegroundColor Green

# Step 6: Push to ACR
Write-Host "`n📋 Step 6: Pushing image to ACR..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
docker push $imageName
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker push failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Image pushed to ACR successfully" -ForegroundColor Green

# Step 7: Summary
Write-Host "`n✅ Deployment Complete!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to Azure Portal → Your App Service (esusuhubappserver)" -ForegroundColor Gray
Write-Host "2. Click 'Restart' (Overview → Restart)" -ForegroundColor Gray
Write-Host "3. Check Log Stream for: '✅ Database connected successfully'" -ForegroundColor Gray
Write-Host "`n🔗 Image: $imageName" -ForegroundColor Cyan
Write-Host ""

