/**
 * Script to initialize the Hostinger database with the schema
 * 
 * Usage:
 * node scripts/init-hostinger-database.js
 */

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env
dotenv.config();

// Get current file directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration from environment variables
const dbConfig = {
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
  port: process.env.VITE_DB_PORT || 3306,
  multipleStatements: true // Important for running multiple SQL statements
};

async function initializeDatabase() {
  console.log('Initializing Hostinger database...');
  console.log(`Host: ${dbConfig.host}`);
  console.log(`Database: ${dbConfig.database}`);
  
  let connection;
  
  try {
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'hostinger-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Connect to the database
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected successfully!');
    
    // Execute the schema SQL
    console.log('Executing schema SQL...');
    await connection.query(schemaSql);
    console.log('Schema created successfully!');
    
    // Insert sample data for testing
    console.log('Inserting sample data...');
    
    console.log('\nHostinger database initialized successfully!');
    console.log('You can now start the application with:');
    console.log('npm run dev');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the initialization
initializeDatabase();