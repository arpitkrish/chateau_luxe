# Certificate Import Helper for Windows
# Run this script as Administrator in PowerShell

$certPath = "$PSScriptRoot\certificates\cert.pem"

Write-Host "🔍 Checking certificate file..." -ForegroundColor Cyan

if (Test-Path $certPath) {
    Write-Host "✅ Certificate file found: $certPath" -ForegroundColor Green

    # Get file info
    $fileInfo = Get-Item $certPath
    Write-Host "📄 File size: $($fileInfo.Length) bytes" -ForegroundColor Yellow
    Write-Host "📅 Created: $($fileInfo.CreationTime)" -ForegroundColor Yellow

    Write-Host "`n🔧 Importing certificate to Trusted Root store..." -ForegroundColor Cyan

    try {
        # Import certificate to Trusted Root Certification Authorities
        $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
        $cert.Import($certPath)

        $store = Get-Item Cert:\LocalMachine\Root
        $store.Open("ReadWrite")
        $store.Add($cert)
        $store.Close()

        Write-Host "✅ Certificate imported successfully!" -ForegroundColor Green
        Write-Host "`n🌐 Now restart Chrome and visit: https://localhost:3000" -ForegroundColor Green
        Write-Host "⚠️  You may need to restart your browser for changes to take effect" -ForegroundColor Yellow

    } catch {
        Write-Host "❌ Error importing certificate: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "`n🔧 Manual import instructions:" -ForegroundColor Yellow
        Write-Host "1. Press Win + R, type 'certlm.msc', press Enter" -ForegroundColor White
        Write-Host "2. Go to Trusted Root Certification Authorities → Certificates" -ForegroundColor White
        Write-Host "3. Right-click → All Tasks → Import..." -ForegroundColor White
        Write-Host "4. Browse to: $certPath" -ForegroundColor White
        Write-Host "5. Complete the import wizard" -ForegroundColor White
    }

} else {
    Write-Host "❌ Certificate file not found: $certPath" -ForegroundColor Red
    Write-Host "🔧 Please run 'node generate-cert.js' first" -ForegroundColor Yellow
}

Write-Host "`n📂 Certificate location: $PSScriptRoot\certificates\" -ForegroundColor Cyan