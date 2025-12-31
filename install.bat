@echo off
echo Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Client installation failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Installing server dependencies...
cd ..\server
call npm install
if %errorlevel% neq 0 (
    echo Server installation failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo All dependencies installed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Configure server/.env file
echo 2. Run 'cd client && npm run dev' in one terminal
echo 3. Run 'cd server && npm run dev' in another terminal
echo.
pause
