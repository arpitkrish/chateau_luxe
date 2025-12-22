# SSL Certificate Installation for HTTPS (User Mode)
# This version works without administrator privileges

param(
    [string]$CertPath = "$PSScriptRoot\certificates\cert.pem",
    [string]$KeyPath = "$PSScriptRoot\certificates\key.pem"
)

Write-Host "🔐 SSL Certificate Setup Guide" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

# Check if certificate files exist
Write-Host "📁 Checking certificate files..." -ForegroundColor Yellow

if (!(Test-Path $CertPath)) {
    Write-Host "❌ Certificate file not found: $CertPath" -ForegroundColor Red
    Write-Host "🔧 Run 'node generate-cert.js' to create certificates first." -ForegroundColor Yellow
    exit 1
}

if (!(Test-Path $KeyPath)) {
    Write-Host "❌ Private key file not found: $KeyPath" -ForegroundColor Red
    Write-Host "🔧 Run 'node generate-cert.js' to create certificates first." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Certificate files found:" -ForegroundColor Green
Write-Host "   📜 Certificate: $CertPath" -ForegroundColor White
Write-Host "   🔑 Private Key: $KeyPath" -ForegroundColor White
Write-Host ""

# Show certificate details
try {
    $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
    $cert.Import($CertPath)

    Write-Host "📋 Certificate Details:" -ForegroundColor Cyan
    Write-Host "   Subject: $($cert.Subject)" -ForegroundColor White
    Write-Host "   Issuer: $($cert.Issuer)" -ForegroundColor White
    Write-Host "   Thumbprint: $($cert.Thumbprint)" -ForegroundColor White
    Write-Host "   Valid From: $($cert.NotBefore)" -ForegroundColor White
    Write-Host "   Valid To: $($cert.NotAfter)" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "❌ Error reading certificate: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 To install the certificate (requires Administrator):" -ForegroundColor Yellow
Write-Host ""
Write-Host "OPTION 1 - Automatic Installation:" -ForegroundColor Green
Write-Host "1. Right-click 'install-ssl-cert.bat'" -ForegroundColor White
Write-Host "2. Select 'Run as administrator'" -ForegroundColor White
Write-Host "3. Follow the prompts" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 2 - Manual Installation:" -ForegroundColor Green
Write-Host "1. Press Win + R, type 'certlm.msc', press Enter" -ForegroundColor White
Write-Host "2. Go to: Trusted Root Certification Authorities → Certificates" -ForegroundColor White
Write-Host "3. Right-click → All Tasks → Import..." -ForegroundColor White
Write-Host "4. Browse to: $CertPath" -ForegroundColor White
Write-Host "5. Complete the import wizard" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 3 - Use Firefox (No Installation Needed):" -ForegroundColor Green
Write-Host "1. Open Firefox" -ForegroundColor White
Write-Host "2. Visit: https://localhost:3000" -ForegroundColor White
Write-Host "3. Click 'Advanced' → 'Accept the Risk and Continue'" -ForegroundColor White
Write-Host "4. ✅ Works immediately!" -ForegroundColor White
Write-Host ""

Write-Host "🌐 Your HTTPS Server is Running:" -ForegroundColor Green
Write-Host "   URL: https://localhost:3000" -ForegroundColor Cyan
Write-Host "   Status: 🔒 Secure with SSL certificates" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  Note: Chrome requires certificate installation for no warnings." -ForegroundColor Yellow
Write-Host '💡 Firefox works immediately without any extra steps!' -ForegroundColor Cyan