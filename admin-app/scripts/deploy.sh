#!/bin/bash

# Cricket Academy Admin App Deployment Script
# This script builds and deploys the admin app to a subdomain

set -e

echo "🚀 Starting Cricket Academy Admin App Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the admin-app directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check environment variables
echo "🔍 Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Please create one with your configuration."
    echo "   See README.md for required environment variables."
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Display deployment information
echo ""
echo "📋 Deployment Information:"
echo "   - Build output: dist/"
echo "   - Files to upload: All contents of dist/ directory"
echo "   - Target: Your subdomain (e.g., admin.yourdomain.com)"
echo ""
echo "🌐 Next Steps:"
echo "   1. Upload the contents of dist/ to your subdomain's web root"
echo "   2. Configure your web server to serve the SPA correctly"
echo "   3. Set up SSL certificate for your subdomain"
echo "   4. Configure CORS on your backend API to allow requests from the subdomain"
echo ""
echo "🔧 For Vercel/Netlify deployment:"
echo "   - Push this code to a GitHub repository"
echo "   - Connect to your preferred platform"
echo "   - Set build command: npm run build"
echo "   - Set output directory: dist"
echo "   - Configure environment variables"
echo "   - Set up custom domain/subdomain"
echo ""
echo "🎉 Deployment script completed!" 