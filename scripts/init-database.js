// scripts/init-database.js
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

async function initDatabase() {
  console.log('Initializing database...');
  console.log('Database configuration:');
  console.log(`- Host: ${dbConfig.host}`);
  console.log(`- Database: ${dbConfig.database}`);
  console.log(`- User: ${dbConfig.user}`);
  console.log(`- Port: ${dbConfig.port}`);
  
  try {
    // Connect to the database
    console.log('\nConnecting to database...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');
    
    // Check if tables exist
    console.log('\nChecking database tables...');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('⚠️ No tables found in the database. Creating tables...');
      
      // Create achievements table
      console.log('\nCreating achievements table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS achievements (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          achievement_date DATE,
          icon VARCHAR(50),
          color VARCHAR(100),
          image_url VARCHAR(255),
          category VARCHAR(100),
          display_order INT DEFAULT 0,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Achievements table created successfully');
      
      // Create testimonials table
      console.log('\nCreating testimonials table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          rating INT DEFAULT 5,
          image_url VARCHAR(255) NOT NULL,
          is_featured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Testimonials table created successfully');
      
      // Create facilities table
      console.log('\nCreating facilities table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS facilities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          image_url VARCHAR(255) NOT NULL,
          features TEXT,
          status VARCHAR(50) DEFAULT 'available',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Facilities table created successfully');
      
      // Create gallery table
      console.log('\nCreating gallery table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS gallery (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          url VARCHAR(255) NOT NULL,
          category VARCHAR(100) DEFAULT 'general',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Gallery table created successfully');
      
      // Create users table
      console.log('\nCreating users table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Users table created successfully');
      
      // Create programs table
      console.log('\nCreating programs table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS programs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          age_group VARCHAR(100),
          duration VARCHAR(100),
          price DECIMAL(10, 2),
          max_students INT,
          current_students INT DEFAULT 0,
          features TEXT,
          status VARCHAR(50) DEFAULT 'active',
          coach VARCHAR(255),
          schedule VARCHAR(255),
          equipment VARCHAR(255),
          level VARCHAR(50),
          category VARCHAR(100),
          start_date DATE,
          icon VARCHAR(50),
          color VARCHAR(100),
          image VARCHAR(255),
          prerequisites TEXT,
          certification_provided BOOLEAN DEFAULT FALSE,
          discount DECIMAL(5, 2) DEFAULT 0.00,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Programs table created successfully');
      
      // Create contacts table
      console.log('\nCreating contacts table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          message TEXT,
          status VARCHAR(50) DEFAULT 'new',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Contacts table created successfully');
      
      // Create enrollments table
      console.log('\nCreating enrollments table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS enrollments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          program_id INT NOT NULL,
          student_info TEXT NOT NULL,
          payment_intent_id VARCHAR(255),
          amount_paid DECIMAL(10, 2),
          payment_status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (program_id) REFERENCES programs(id)
        )
      `);
      console.log('✅ Enrollments table created successfully');
      
      // Insert default admin user
      console.log('\nCreating default admin user...');
      await connection.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ('Admin User', 'admin@kalyancricketacademy.com', 'Admin@123456', 'admin')
      `);
      console.log('✅ Default admin user created successfully');
      
      // Insert sample achievements
      console.log('\nCreating sample achievements...');
      await connection.query(`
        INSERT INTO achievements (title, description, achievement_date, icon, color, image_url, category, display_order, status)
        VALUES 
        ('State Team Selection', '5 of our students were selected for the state cricket team in 2023, showcasing our academy\\'s excellence in training.', '2023-06-15', '🏆', 'from-cricket-green to-cricket-green/80', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Team', 1, 'active'),
        ('IPL Selection', 'Two of our academy graduates were picked in the IPL auction, marking a significant milestone in their professional careers.', '2022-12-20', '🏏', 'from-cricket-orange to-cricket-orange/80', 'https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Professional', 2, 'active'),
        ('Under-18 National Team', 'Three students selected for the Under-18 National Cricket Team, representing our academy at the highest youth level.', '2023-08-10', '👦', 'from-blue-500 to-blue-600', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Youth', 3, 'active'),
        ('Best Cricket Academy', 'Awarded as the Best Cricket Academy in the region for 2023, recognizing our commitment to excellence in cricket training.', '2023-01-15', '🎓', 'from-purple-600 to-purple-700', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Academy', 4, 'active')
      `);
      console.log('✅ Sample achievements created successfully');
      
      // Insert sample testimonials
      console.log('\nCreating sample testimonials...');
      await connection.query(`
        INSERT INTO testimonials (name, role, content, rating, image_url, is_featured)
        VALUES 
        ('Rahul Sharma', 'Parent', 'My son has improved tremendously since joining the academy. The coaches are very professional and caring.', 5, 'https://randomuser.me/api/portraits/men/32.jpg', TRUE),
        ('Priya Patel', 'Student', 'I learned so much in just a few months. The training facilities are excellent and the coaches are very knowledgeable.', 5, 'https://randomuser.me/api/portraits/women/44.jpg', TRUE),
        ('Amit Kumar', 'Professional Player', 'This academy laid the foundation for my professional career. I highly recommend their advanced training programs.', 5, 'https://randomuser.me/api/portraits/men/22.jpg', TRUE)
      `);
      console.log('✅ Sample testimonials created successfully');
      
      // Insert sample facilities
      console.log('\nCreating sample facilities...');
      await connection.query(`
        INSERT INTO facilities (name, description, image_url, features, status)
        VALUES 
        ('Indoor Training Center', 'State-of-the-art indoor training facility with climate control and specialized equipment.', '/images/facilities/indoor.jpg', '["6 batting lanes", "Bowling machines", "Video analysis setup", "Fitness area"]', 'available'),
        ('Outdoor Cricket Ground', 'Full-size cricket ground with natural grass and professional maintenance.', '/images/facilities/ground.jpg', '["Standard pitch dimensions", "Practice nets", "Pavilion", "Spectator seating"]', 'available'),
        ('Performance Analysis Lab', 'High-tech lab for detailed performance analysis and improvement.', '/images/facilities/analysis.jpg', '["Motion capture technology", "Biomechanical analysis", "Performance tracking software", "One-on-one coaching"]', 'available')
      `);
      console.log('✅ Sample facilities created successfully');
      
      // Insert sample gallery images
      console.log('\nCreating sample gallery images...');
      await connection.query(`
        INSERT INTO gallery (title, description, url, category)
        VALUES 
        ('Academy Opening Day', 'Grand opening ceremony with local cricket celebrities.', '/images/gallery/opening.jpg', 'events'),
        ('Summer Camp 2023', 'Students practicing during our annual summer camp.', '/images/gallery/summer-camp.jpg', 'training'),
        ('Inter-Academy Tournament', 'Our students competing in the regional inter-academy tournament.', '/images/gallery/tournament.jpg', 'competitions')
      `);
      console.log('✅ Sample gallery images created successfully');
      
    } else {
      console.log(`✅ Found ${tables.length} tables in the database:`);
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`- ${tableName}`);
      });
    }
    
    // Close the connection
    await connection.end();
    
    console.log('\n🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Failed to initialize database!');
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

// Run the initialization
initDatabase();