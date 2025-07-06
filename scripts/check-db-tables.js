/**
 * Script to check if all required tables exist in the Hostinger database
 * and create missing tables if needed
 */

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const dbConfig = {
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
  port: process.env.VITE_DB_PORT || 3306
};

// Required tables with their creation SQL
const requiredTables = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role ENUM('admin', 'coach', 'student') NOT NULL DEFAULT 'student',
      status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  students: `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      date_of_birth DATE,
      address TEXT,
      emergency_contact VARCHAR(255),
      emergency_phone VARCHAR(20),
      medical_info TEXT,
      status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `,
  coaches: `
    CREATE TABLE IF NOT EXISTS coaches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      bio TEXT,
      specialization VARCHAR(255),
      experience INT,
      certifications TEXT,
      image_url VARCHAR(255),
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `,
  programs: `
    CREATE TABLE IF NOT EXISTS programs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      age_group VARCHAR(50),
      duration VARCHAR(100),
      price DECIMAL(10, 2) NOT NULL,
      max_students INT,
      current_students INT DEFAULT 0,
      features JSON,
      status ENUM('active', 'inactive', 'coming_soon') NOT NULL DEFAULT 'active',
      coach VARCHAR(255),
      schedule TEXT,
      equipment TEXT,
      level VARCHAR(50),
      category VARCHAR(100),
      start_date DATE,
      icon VARCHAR(255),
      color VARCHAR(50),
      image VARCHAR(255),
      prerequisites JSON,
      certification_provided BOOLEAN DEFAULT FALSE,
      discount DECIMAL(5, 2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  contacts: `
    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      message TEXT NOT NULL,
      status ENUM('new', 'in_progress', 'completed', 'spam') NOT NULL DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  enrollments: `
    CREATE TABLE IF NOT EXISTS enrollments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      program_id INT NOT NULL,
      student_info JSON NOT NULL,
      payment_intent_id VARCHAR(255),
      amount_paid DECIMAL(10, 2) NOT NULL,
      payment_status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
    )
  `,
  achievements: `
    CREATE TABLE IF NOT EXISTS achievements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      achievement_date DATE,
      icon VARCHAR(50),
      color VARCHAR(50),
      image_url VARCHAR(255),
      category VARCHAR(100),
      display_order INT DEFAULT 0,
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  testimonials: `
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      rating INT NOT NULL DEFAULT 5,
      image_url VARCHAR(255) NOT NULL,
      is_featured TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  facilities: `
    CREATE TABLE IF NOT EXISTS facilities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      features JSON,
      status ENUM('available', 'maintenance', 'upcoming') NOT NULL DEFAULT 'available',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  gallery: `
    CREATE TABLE IF NOT EXISTS gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      url VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL DEFAULT 'general',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
};

// Main function
async function checkAndCreateTables() {
  console.log('Checking database tables...');
  
  try {
    // Connect to the database
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database:', dbConfig.database);
    
    // Get existing tables
    const [rows] = await connection.query('SHOW TABLES');
    const existingTables = rows.map(row => Object.values(row)[0]);
    
    console.log('Existing tables:', existingTables);
    
    // Check for missing tables
    const missingTables = Object.keys(requiredTables).filter(table => !existingTables.includes(table));
    
    if (missingTables.length === 0) {
      console.log('All required tables exist!');
    } else {
      console.log('Missing tables:', missingTables);
      
      // Create missing tables
      for (const table of missingTables) {
        console.log(`Creating table: ${table}`);
        
        try {
          // Get the SQL for the table
          const createTableSQL = requiredTables[table];
          
          // Execute the SQL
          await connection.query(createTableSQL);
          console.log(`Table ${table} created successfully!`);
          
          // Insert default data if needed
          if (table === 'users' && !existingTables.includes('users')) {
            // Insert default admin user
            const adminInsertSQL = `
              INSERT INTO users (email, password, name, role)
              VALUES ('admin@kalyancricketacademy.com', '$2b$10$XdEfGgDJKy6oNs0zQvQYh.XG9Z3QqzQp.eQCgwwLzrRsAQpvXJUjm', 'Admin User', 'admin')
            `;
            await connection.query(adminInsertSQL);
            console.log('Default admin user created');
          }
          
        } catch (tableError) {
          console.error(`Error creating table ${table}:`, tableError);
        }
      }
    }
    
    // Close the connection
    await connection.end();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
checkAndCreateTables();