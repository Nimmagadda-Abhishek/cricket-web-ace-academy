/**
 * Script to initialize the development database with the schema
 * 
 * Usage:
 * node scripts/init-dev-database.js
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
  console.log('Initializing development database...');
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
    
    // Sample programs
    await connection.query(`
      INSERT INTO programs (
        title, description, age_group, duration, price, max_students, 
        features, status, coach, schedule, level, category
      ) VALUES 
      ('Advanced Batting Technique', 'Master the art of batting with advanced techniques', '13-16 years', '2 months', 7500.00, 15, 
       '["Advanced footwork", "Shot selection", "Power hitting", "Playing spin"]', 'active', 'Coach Patel', 'Tuesday, Thursday (5:00 PM - 7:00 PM)', 'Advanced', 'Specialized'),
      ('Cricket Summer Camp', 'Comprehensive cricket training during summer vacation', '8-15 years', '1 month', 10000.00, 30, 
       '["All-round training", "Match practice", "Fitness sessions", "Video analysis"]', 'coming_soon', 'Multiple Coaches', 'Monday to Friday (9:00 AM - 12:00 PM)', 'All Levels', 'Camp');
    `);
    
    // Sample contacts
    await connection.query(`
      INSERT INTO contacts (name, email, phone, message, status)
      VALUES 
      ('John Parent', 'john@example.com', '9876543210', 'Interested in enrolling my son in the beginner program', 'new'),
      ('Priya Sharma', 'priya@example.com', '8765432109', 'Would like to know more about the advanced batting program', 'in_progress');
    `);
    
    console.log('Sample data inserted successfully!');
    
    console.log('\nDevelopment database initialized successfully!');
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