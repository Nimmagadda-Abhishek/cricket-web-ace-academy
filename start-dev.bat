@echo off
echo Starting Cricket Academy Development Environment...
echo.

echo 🚀 Starting Backend Server (Port 5000)...
start "Backend Server" cmd /c "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo 🌐 Starting Frontend (Port 5173)...
start "Frontend" cmd /c "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo 🛠️ Starting Admin Dashboard (Port 4173)...
start "Admin Dashboard" cmd /c "cd cricket-admin-dash && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ✅ All services starting up!
echo.
echo 📍 Available URLs:
echo   • Backend API: http://localhost:5000
echo   • Frontend: http://localhost:5173  
echo   • Admin Dashboard: http://localhost:4173
echo.
echo 📋 Default Admin Login:
echo   • Username: admin
echo   • Password: password
echo.
echo Press any key to close this window or Ctrl+C to stop services...
pause >nul
