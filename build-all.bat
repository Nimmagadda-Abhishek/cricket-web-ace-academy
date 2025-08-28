@echo off
echo Building Cricket Academy for Production...
echo.

echo 🔨 Installing Backend Dependencies...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)

echo 🔨 Building Backend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Backend build failed!
    pause
    exit /b 1
)

echo 🔨 Installing Frontend Dependencies...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

echo 🔨 Building Frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo 🔨 Installing Admin Dashboard Dependencies...
cd ..\cricket-admin-dash
if not exist node_modules (
    echo Installing admin dependencies...
    call npm install
)

echo 🔨 Building Admin Dashboard...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Admin dashboard build failed!
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ All builds completed successfully!
echo.
echo 📁 Build outputs:
echo   • Backend: backend/dist/
echo   • Frontend: frontend/dist/
echo   • Admin: cricket-admin-dash/dist/
echo.
echo 🚀 To start production server:
echo   cd backend && npm start
echo.
pause
