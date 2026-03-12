@echo off
echo Starting Backend Server...
cd /d "e:\adi\frontend\backend"
echo Installing dependencies if needed...
call npm install
echo.
echo Starting server on port 3001...
echo Server will be available at: http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo.
node server.js
pause
