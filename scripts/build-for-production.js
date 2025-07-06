/**
 * Script to build the project for production
 * This script:
 * 1. Runs the database check to ensure all tables exist
 * 2. Builds the frontend
 * 3. Prepares the server for production
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Function to run a command and log the output
function runCommand(command, description) {
  console.log(`\n--- ${description} ---`);
  try {
    execSync(command, { stdio: 'inherit', cwd: rootDir });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

// Main build function
async function buildForProduction() {
  console.log('🚀 Starting production build process...');
  
  // 1. Check if .env file exists
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Please create one based on .env.example');
    process.exit(1);
  }
  
  // 2. Check database tables
  if (!runCommand('node scripts/check-db-tables.js', 'Database table check')) {
    console.warn('⚠️ Database check failed, but continuing with build...');
  }
  
  // 3. Install dependencies if needed
  if (!runCommand('npm install', 'Installing dependencies')) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
  
  // 4. Build the frontend
  if (!runCommand('npm run build', 'Building frontend')) {
    console.error('❌ Frontend build failed');
    process.exit(1);
  }
  
  // 5. Copy server files to dist folder
  const serverDistDir = path.join(rootDir, 'dist', 'server');
  if (!fs.existsSync(serverDistDir)) {
    fs.mkdirSync(serverDistDir, { recursive: true });
  }
  
  // Copy server files
  const serverFiles = [
    'fixed-server.js',
    'routes/auth.js',
    'routes/achievements.js'
  ];
  
  for (const file of serverFiles) {
    const sourcePath = path.join(rootDir, 'server', file);
    const destPath = path.join(serverDistDir, file);
    
    // Create directory if it doesn't exist
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy file
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied ${file} to dist/server`);
    } catch (error) {
      console.error(`❌ Failed to copy ${file}:`, error.message);
    }
  }
  
  // 6. Create a production server file
  const prodServerPath = path.join(rootDir, 'dist', 'server.js');
  const prodServerContent = `
// Production server file
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 80;

// Serve static files from the dist directory
app.use(express.static(__dirname));

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Production server running on port \${PORT}\`);
});
`;
  
  try {
    fs.writeFileSync(prodServerPath, prodServerContent);
    console.log('✅ Created production server.js');
  } catch (error) {
    console.error('❌ Failed to create production server.js:', error.message);
  }
  
  // 7. Create a package.json for production
  const prodPackageJsonPath = path.join(rootDir, 'dist', 'package.json');
  const prodPackageJsonContent = {
    name: "cricket-academy-production",
    version: "1.0.0",
    type: "module",
    scripts: {
      start: "node server.js"
    },
    dependencies: {
      express: "^4.18.2",
      dotenv: "^17.0.0"
    }
  };
  
  try {
    fs.writeFileSync(prodPackageJsonPath, JSON.stringify(prodPackageJsonContent, null, 2));
    console.log('✅ Created production package.json');
  } catch (error) {
    console.error('❌ Failed to create production package.json:', error.message);
  }
  
  // 8. Copy .env file to dist
  try {
    fs.copyFileSync(envPath, path.join(rootDir, 'dist', '.env'));
    console.log('✅ Copied .env file to dist');
  } catch (error) {
    console.error('❌ Failed to copy .env file:', error.message);
  }
  
  console.log('\n🎉 Production build completed!');
  console.log('The dist folder now contains everything needed for deployment.');
  console.log('To deploy, upload the contents of the dist folder to your hosting provider.');
}

// Run the build process
buildForProduction();