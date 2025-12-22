@echo off
echo 🔍 Checking certificate file...
if exist "%~dp0certificates\cert.pem" (
    echo ✅ Certificate file found: %~dp0certificates\cert.pem
    echo.
    echo 🔧 Opening Certificate Import Wizard...
    echo.
    echo Please follow these steps:
    echo 1. Select "Local Machine" when prompted
    echo 2. Choose "Place all certificates in the following store"
    echo 3. Select "Trusted Root Certification Authorities"
    echo 4. Complete the wizard
    echo.
    certlm.msc
    echo.
    echo ✅ Certificate Manager opened!
    echo 📄 Now import: %~dp0certificates\cert.pem
) else (
    echo ❌ Certificate file not found: %~dp0certificates\cert.pem
    echo 🔧 Please run 'node generate-cert.js' first
)
pause