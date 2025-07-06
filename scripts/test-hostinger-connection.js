/**
 * Script to test connection to Hostinger database
 * 
 * Usage:
 * node scripts/test-hostinger-connection.js
 */

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found!');
  console.log('Please create a .env file with your Hostinger database credentials.');
  process.exit(1);
}

// Database configuration from environment variables
const dbConfig = {
  host: process.env.VITE_DB_HOST || process.env.HOSTINGER_DB_HOST,
  user: process.env.VITE_DB_USER || process.env.HOSTINGER_DB_USER,
  password: process.env.VITE_DB_PASSWORD || process.env.HOSTINGER_DB_PASSWORD,
  database: process.env.VITE_DB_NAME || process.env.HOSTINGER_DB_NAME,
  port: process.env.VITE_DB_PORT || 3306
};

// Check if all required environment variables are set
const missingVars = [];
if (!dbConfig.host) missingVars.push('VITE_DB_HOST or HOSTINGER_DB_HOST');
if (!dbConfig.user) missingVars.push('VITE_DB_USER or HOSTINGER_DB_USER');
if (!dbConfig.password) missingVars.push('VITE_DB_PASSWORD or HOSTINGER_DB_PASSWORD');
if (!dbConfig.database) missingVars.push('VITE_DB_NAME or HOSTINGER_DB_NAME');

if (missingVars.length > 0) {
  console.error('Error: Missing environment variables:');
  missingVars.forEach(variable => console.error(`- ${variable}`));
  console.log('\nPlease add these variables to your .env file.');
  process.exit(1);
}

async function testConnection() {
  console.log('Testing connection to Hostinger database...');
  console.log('Connection details:');
  console.log(`- Host: ${dbConfig.host}`);
  console.log(`- Database: ${dbConfig.database}`);
  console.log(`- User: ${dbConfig.user}`);
  console.log(`- Port: ${dbConfig.port}`);
  
  let connection;
  
  try {
    // Try to connect to the database
    console.log('\nAttempting to connect...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully!');
    
    // Test a simple query
    console.log('\nTesting query execution...');
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('✅ Query executed successfully!');
    
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
      
      // Check if achievements table exists
      const achievementsTable = tables.find(table => Object.values(table)[0] === 'achievements');
      if (!achievementsTable) {
        console.log('\n⚠️ Achievements table not found!');
        console.log('You need to create the achievements table for the dynamic achievements feature.');
      } else {
        console.log('\n✅ Achievements table exists.');
        
        // Check achievements table structure
        const [columns] = await connection.query('DESCRIBE achievements');
        console.log(`Found ${columns.length} columns in the achievements table.`);
      }
    }
    
    console.log('\n🎉 Database connection test completed successfully!');
    console.log('Your website should be able to connect to the Hostinger database.');
    
  } catch (error) {
    console.error('\n❌ Error connecting to database:');
    console.error(error);
    
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if your database credentials are correct');
    console.log('2. Make sure your database exists on Hostinger');
    console.log('3. Verify that remote MySQL access is enabled (if connecting remotely)');
    console.log('4. Check if your IP is whitelisted in Hostinger');
    console.log('5. Ensure your Hostinger hosting plan includes MySQL databases');
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the test
testConnection().catch(console.error);