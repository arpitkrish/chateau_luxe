#Requires -RunAsAdministrator

param(
    [string]$CertPath = "$PSScriptRoot\certificates\cert.pem",
    [string]$KeyPath = "$PSScriptRoot\certificates\key.pem"
)

Write-Host "🔐 SSL Certificate Installation for HTTPS" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
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

# Import certificate to Trusted Root Certification Authorities
Write-Host "🔧 Importing certificate to Windows Certificate Store..." -ForegroundColor Yellow
Write-Host "   Store: Trusted Root Certification Authorities" -ForegroundColor White
Write-Host ""

try {
    # Load the certificate
    $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
    $cert.Import($CertPath)

    # Open the Trusted Root store
    $store = Get-Item Cert:\LocalMachine\Root
    $store.Open("ReadWrite")

    # Check if certificate already exists
    $existingCert = $store.Certificates | Where-Object { $_.Thumbprint -eq $cert.Thumbprint }
    if ($existingCert) {
        Write-Host "⚠️  Certificate already exists in store" -ForegroundColor Yellow
    } else {
        # Add the certificate
        $store.Add($cert)
        Write-Host "✅ Certificate imported successfully!" -ForegroundColor Green
    }

    $store.Close()

    Write-Host ""
    Write-Host "🎉 Certificate Installation Complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Certificate Details:" -ForegroundColor Cyan
    Write-Host "   Subject: $($cert.Subject)" -ForegroundColor White
    Write-Host "   Issuer: $($cert.Issuer)" -ForegroundColor White
    Write-Host "   Thumbprint: $($cert.Thumbprint)" -ForegroundColor White
    Write-Host "   Valid From: $($cert.NotBefore)" -ForegroundColor White
    Write-Host "   Valid To: $($cert.NotAfter)" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "❌ Error importing certificate: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Manual Import Instructions:" -ForegroundColor Yellow
    Write-Host "1. Press Win + R, type 'certlm.msc', press Enter" -ForegroundColor White
    Write-Host "2. Navigate: Trusted Root Certification Authorities → Certificates" -ForegroundColor White
    Write-Host "3. Right-click → All Tasks → Import..." -ForegroundColor White
    Write-Host "4. Select file: $CertPath" -ForegroundColor White
    Write-Host "5. Complete the import wizard" -ForegroundColor White
    exit 1
}

Write-Host "🚀 Next Steps:" -ForegroundColor Green
Write-Host "1. ✅ Certificate installed in Windows trust store" -ForegroundColor White
Write-Host "2. 🔄 Restart Chrome completely (close all windows)" -ForegroundColor White
Write-Host "3. 🌐 Visit: https://localhost:3000" -ForegroundColor White
Write-Host "4. 🎉 No more security warnings!" -ForegroundColor White
Write-Host ""

Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "• If Chrome still shows warnings, try incognito mode" -ForegroundColor White
Write-Host "• You can also use Firefox - it accepts the certificate immediately" -ForegroundColor White
Write-Host "• Certificate is valid for local development only" -ForegroundColor White

Write-Host ""
Write-Host "🔒 Your application is now SECURE with HTTPS!" -ForegroundColor Green
Write-Host "   URL: https://localhost:3000" -ForegroundColor Cyan