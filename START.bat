@echo off
echo ============================================
echo  Sri Charan Portfolio - Local Dev
echo ============================================
echo.
echo [1/3] Cleaning build cache...
if exist .next rmdir /s /q .next
if exist package-lock.json del package-lock.json
echo.
echo [2/3] Installing packages...
call npm install --legacy-peer-deps
if errorlevel 1 ( echo ERROR: install failed & pause & exit /b 1 )
echo.
echo [3/3] Starting...
echo  Open http://localhost:3000
echo.
call npm run dev
