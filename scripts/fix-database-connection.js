// scripts/fix-database-connection.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
  port: process.env.VITE_DB_PORT || 3306
};

async function fixDatabaseConnection() {
  console.log('Fixing database connection issues...');
  console.log('Database configuration:');
  console.log(`- Host: ${dbConfig.host}`);
  console.log(`- Database: ${dbConfig.database}`);
  console.log(`- User: ${dbConfig.user}`);
  console.log(`- Port: ${dbConfig.port}`);
  
  try {
    // Test database connection
    console.log('\nTesting database connection...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');
    
    // Check if tables exist
    console.log('\nChecking database tables...');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('⚠️ No tables found in the database.');
      console.log('You may need to initialize your database schema using:');
      console.log('node scripts/init-dev-database.js');
    } else {
      console.log(`✅ Found ${tables.length} tables in the database:`);
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`- ${tableName}`);
      });
    }
    
    // Close the connection
    await connection.end();
    
    // Update the server code to use the correct database configuration
    console.log('\nUpdating server code to use the correct database configuration...');
    
    // Update auth.js
    const authPath = path.join(__dirname, '..', 'server', 'routes', 'auth.js');
    let authContent = fs.readFileSync(authPath, 'utf8');
    
    // Replace the database configuration
    authContent = authContent.replace(
      /const dbConfig = {[\s\S]*?};/,
      `const dbConfig = {
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
  port: process.env.VITE_DB_PORT || 3306
};`
    );
    
    fs.writeFileSync(authPath, authContent);
    console.log('✅ Updated auth.js with correct database configuration');
    
    // Update achievements.js
    const achievementsPath = path.join(__dirname, '..', 'server', 'routes', 'achievements.js');
    let achievementsContent = fs.readFileSync(achievementsPath, 'utf8');
    
    // Replace the database configuration
    achievementsContent = achievementsContent.replace(
      /const dbConfig = {[\s\S]*?};/,
      `const dbConfig = {
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
  port: process.env.VITE_DB_PORT || 3306
};`
    );
    
    fs.writeFileSync(achievementsPath, achievementsContent);
    console.log('✅ Updated achievements.js with correct database configuration');
    
    // Create a .env.local file with the correct database configuration
    const envLocalPath = path.join(__dirname, '..', '.env.local');
    const envLocalContent = `# Local environment variables that override .env
# This file is used for local development and is not committed to the repository

# Database configuration
VITE_DB_HOST=${dbConfig.host}
VITE_DB_USER=${dbConfig.user}
VITE_DB_PASSWORD=${dbConfig.password}
VITE_DB_NAME=${dbConfig.database}
VITE_DB_PORT=${dbConfig.port}

# Disable Supabase
VITE_USE_SUPABASE=false
`;
    
    fs.writeFileSync(envLocalPath, envLocalContent);
    console.log('✅ Created .env.local file with correct database configuration');
    
    console.log('\n🎉 Database connection issues fixed successfully!');
    console.log('You can now start the server with:');
    console.log('cd server && node index.js');
    
  } catch (error) {
    console.error('\n❌ Failed to fix database connection issues!');
    console.error('Error:', error.message);
    console.error('Stack trace:', error.stack);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nAccess denied error. Please check your database credentials.');
      console.error('Make sure the username and password are correct.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nConnection refused. Please check if:');
      console.error('1. The database server is running');
      console.error('2. The host and port are correct');
      console.error('3. Any firewall is allowing the connection');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\nDatabase does not exist. Please check if:');
      console.error('1. The database name is correct');
      console.error('2. The database has been created');
    }
  }
}

// Run the fix
fixDatabaseConnection();