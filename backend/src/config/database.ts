import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cricket_academy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Test database connection
export async function connectDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    const tempPool = mysql.createPool({
      ...dbConfig,
      database: undefined
    });
    
    await tempPool.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await tempPool.end();
    
    // Create tables
    await createTables();
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function createTables() {
  const queries = [
    // Admin users table
    `CREATE TABLE IF NOT EXISTS admin_users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('super_admin', 'admin') DEFAULT 'admin',
      is_active BOOLEAN DEFAULT true,
      created_at DATETIME,
      updated_at DATETIME
    )`,
    
    // Programs table
    `CREATE TABLE IF NOT EXISTS programs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      short_description VARCHAR(500),
      image_url VARCHAR(500),
      price DECIMAL(10, 2),
      duration VARCHAR(100),
      age_group VARCHAR(100),
      skill_level ENUM('beginner', 'intermediate', 'advanced', 'all') DEFAULT 'all',
      max_participants INT,
      is_active BOOLEAN DEFAULT true,
      created_at DATETIME,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    // Coaches table
    `CREATE TABLE IF NOT EXISTS coaches (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      bio TEXT,
      specialization VARCHAR(200),
      experience_years INT,
      image_url VARCHAR(500),
      phone VARCHAR(20),
      email VARCHAR(100),
      is_active BOOLEAN DEFAULT true,
      created_at DATETIME,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    // Students table
    `CREATE TABLE IF NOT EXISTS students (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      phone VARCHAR(20),
      date_of_birth DATE,
      parent_name VARCHAR(100),
      parent_phone VARCHAR(20),
      parent_email VARCHAR(100),
      address TEXT,
      emergency_contact VARCHAR(100),
      emergency_phone VARCHAR(20),
      medical_conditions TEXT,
      created_at DATETIME,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    // Bookings table
    `CREATE TABLE IF NOT EXISTS bookings (
      id INT PRIMARY KEY AUTO_INCREMENT,
      student_id INT,
      program_id INT,
      coach_id INT,
      booking_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
      FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE CASCADE
    )`,
    
    // Testimonials table
    `CREATE TABLE IF NOT EXISTS testimonials (
      id INT PRIMARY KEY AUTO_INCREMENT,
      student_name VARCHAR(100) NOT NULL,
      parent_name VARCHAR(100),
      content TEXT NOT NULL,
      rating INT CHECK (rating >= 1 AND rating <= 5),
      image_url VARCHAR(500),
      is_approved BOOLEAN DEFAULT false,
      is_featured BOOLEAN DEFAULT false,
      created_at DATETIME,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    // Contact messages table
    `CREATE TABLE IF NOT EXISTS contact_messages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      subject VARCHAR(200),
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      replied BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Settings table for website configuration
    `CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY AUTO_INCREMENT,
      key_name VARCHAR(100) UNIQUE NOT NULL,
      key_value TEXT,
      description VARCHAR(500),
      created_at DATETIME,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    // Facilities table
    `CREATE TABLE IF NOT EXISTS facilities (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      short_description VARCHAR(500),
      image_url VARCHAR(500),
      features TEXT,
      icon VARCHAR(10),
      is_active BOOLEAN DEFAULT true,
      display_order INT DEFAULT 0,
      created_at DATETIME,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    // Gallery images table
    `CREATE TABLE IF NOT EXISTS gallery_images (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(200),
      description TEXT,
      image_url VARCHAR(500) NOT NULL,
      category VARCHAR(100),
      is_featured BOOLEAN DEFAULT false,
      display_order INT DEFAULT 0,
      created_at DATETIME,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    // Achievements table
    `CREATE TABLE IF NOT EXISTS achievements (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      image_url VARCHAR(500),
      date_achieved DATE,
      category VARCHAR(100),
      is_featured BOOLEAN DEFAULT false,
      created_at DATETIME,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  ];
  
  for (const query of queries) {
    await pool.execute(query);
  }
  
  // Insert default admin user
  const defaultAdminQuery = `
    INSERT IGNORE INTO admin_users (username, email, password_hash, role) 
    VALUES ('admin', 'admin@cricketacademy.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin')
  `;
  await pool.execute(defaultAdminQuery);
  
  // Insert default settings
  const defaultSettings = [
    ['site_name', 'Cricket Web Ace Academy', 'Website name'],
    ['site_description', 'Premier cricket coaching academy', 'Website description'],
    ['contact_email', 'info@cricketacademy.com', 'Contact email'],
    ['contact_phone', '+1234567890', 'Contact phone'],
    ['address', '123 Cricket Ground, Sports City', 'Academy address']
  ];
  
  for (const [key, value, description] of defaultSettings) {
    await pool.execute(
      'INSERT IGNORE INTO settings (key_name, key_value, description) VALUES (?, ?, ?)',
      [key, value, description]
    );
  }
}
