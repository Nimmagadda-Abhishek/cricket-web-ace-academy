-- Hostinger Database Schema for Cricket Academy

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS coaches;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'coach', 'student') NOT NULL DEFAULT 'student',
  status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE students (
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
);

-- Create coaches table
CREATE TABLE coaches (
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
);

-- Create programs table
CREATE TABLE programs (
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
);

-- Create contacts table
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  status ENUM('new', 'in_progress', 'completed', 'spam') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create enrollments table
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  program_id INT NOT NULL,
  student_info JSON NOT NULL,
  payment_intent_id VARCHAR(255),
  amount_paid DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO users (email, password, name, role)
VALUES ('admin@kalyancricketacademy.com', '$2b$10$XdEfGgDJKy6oNs0zQvQYh.XG9Z3QqzQp.eQCgwwLzrRsAQpvXJUjm', 'Admin User', 'admin');
-- Note: Password is 'Admin@123456' hashed with bcrypt

-- Create achievements table
CREATE TABLE achievements (
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
);

-- Insert sample program
INSERT INTO programs (
  title, 
  description, 
  age_group, 
  duration, 
  price, 
  max_students, 
  current_students,
  features,
  status,
  coach,
  schedule,
  level,
  category,
  icon,
  color,
  prerequisites
) VALUES (
  'Beginner Cricket Training',
  'A comprehensive program for beginners to learn cricket fundamentals',
  '8-12 years',
  '3 months',
  5000.00,
  20,
  0,
  '["Basic batting techniques", "Bowling fundamentals", "Fielding practice", "Cricket rules and etiquette"]',
  'active',
  'Coach Sharma',
  'Monday, Wednesday, Friday (4:00 PM - 6:00 PM)',
  'Beginner',
  'Training',
  'cricket-bat',
  'green',
  '["No prior experience needed", "Basic fitness level"]'
);

-- Insert sample achievements
INSERT INTO achievements (title, description, achievement_date, icon, color, image_url, category, display_order, status) VALUES
('State Team Selection', '5 of our students were selected for the state cricket team in 2023, showcasing our academy\'s excellence in training.', '2023-06-15', '🏆', 'from-cricket-green to-cricket-green/80', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Team', 1, 'active'),
('IPL Selection', 'Two of our academy graduates were picked in the IPL auction, marking a significant milestone in their professional careers.', '2022-12-20', '🏏', 'from-cricket-orange to-cricket-orange/80', 'https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Professional', 2, 'active'),
('Under-18 National Team', 'Three students selected for the Under-18 National Cricket Team, representing our academy at the highest youth level.', '2023-08-10', '👦', 'from-blue-500 to-blue-600', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Youth', 3, 'active'),
('Best Cricket Academy', 'Awarded as the Best Cricket Academy in the region for 2023, recognizing our commitment to excellence in cricket training.', '2023-01-15', '🎓', 'from-purple-600 to-purple-700', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Academy', 4, 'active');