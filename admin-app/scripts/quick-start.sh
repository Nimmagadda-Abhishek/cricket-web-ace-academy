#!/bin/bash

# Cricket Academy Admin App Quick Start Script
# This script helps you get the admin app running quickly for development

set -e

echo "🚀 Cricket Academy Admin App Quick Start"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the admin-app directory."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Error: Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check for .env file
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  No .env file found. Creating a template..."
    cat > .env << EOF
# Database Configuration (if using Hostinger)
VITE_DB_HOST=your_hostinger_db_host
VITE_DB_USER=your_db_username
VITE_DB_PASSWORD=your_db_password
VITE_DB_NAME=your_db_name
VITE_DB_PORT=3306

# Supabase Configuration (if using Supabase)
VITE_USE_SUPABASE=false
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
EOF
    echo "✅ Created .env template. Please update it with your actual configuration."
else
    echo "✅ .env file found."
fi

# Check if backend is running
echo ""
echo "🔍 Checking backend connection..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is running at http://localhost:5000"
else
    echo "⚠️  Backend is not running at http://localhost:5000"
    echo "   Please start your backend server first."
fi

# Start development server
echo ""
echo "🌐 Starting development server..."
echo "   The admin app will be available at: http://localhost:3001"
echo "   Default credentials:"
echo "   - Email: admin@kalyancricketacademy.com"
echo "   - Password: Admin@123456"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev 