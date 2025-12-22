@echo off
echo.
echo 🔐 SSL Certificate Installation for HTTPS Security
echo ====================================================
echo.
echo Your HTTPS server is running at: https://localhost:3000
echo.
echo To eliminate browser security warnings, you need to install the SSL certificate.
echo.
echo CHOOSE YOUR OPTION:
echo.
echo [1] Install Certificate (Requires Administrator)
echo [2] Use Firefox (Works Immediately - No Installation)
echo [3] Manual Chrome Setup Instructions
echo [4] Check Certificate Status
echo.
echo Press the number of your choice or any other key for help...
echo.

choice /c 1234 /n
if errorlevel 4 goto check_cert
if errorlevel 3 goto manual_chrome
if errorlevel 2 goto firefox_option
if errorlevel 1 goto install_cert

:install_cert
echo.
echo 🔧 Installing SSL Certificate...
echo.
echo ⚠️  This requires Administrator privileges.
echo    Right-click this batch file and select "Run as administrator"
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0install-ssl-cert.ps1"
goto end

:firefox_option
echo.
echo 🦊 FIREFOX OPTION - Works Immediately!
echo ======================================
echo.
echo 1. Open Mozilla Firefox
echo 2. Go to: https://localhost:3000
echo 3. Click "Advanced"
echo 4. Click "Accept the Risk and Continue"
echo.
echo ✅ That's it! Firefox will accept your certificate.
echo.
echo 🌐 Visit: https://localhost:3000
echo.
goto end

:manual_chrome
echo.
echo 🔧 MANUAL CHROME CERTIFICATE INSTALLATION
echo ==========================================
echo.
echo Step 1: Open Certificate Manager
echo    Press Win + R, type 'certlm.msc', press Enter
echo.
echo Step 2: Navigate to Store
echo    Trusted Root Certification Authorities → Certificates
echo.
echo Step 3: Import Certificate
echo    Right-click empty space → All Tasks → Import...
echo.
echo Step 4: Select Certificate File
echo    Browse to: %~dp0certificates\cert.pem
echo.
echo Step 5: Complete Import
echo    Click Next through all prompts (accept defaults)
echo.
echo Step 6: Restart Chrome
echo    Close all Chrome windows, then reopen
echo.
echo ✅ Done! Visit: https://localhost:3000
echo.
goto end

:check_cert
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0setup-ssl-cert.ps1"
goto end

:end
echo.
echo Press any key to exit...
pause >nul