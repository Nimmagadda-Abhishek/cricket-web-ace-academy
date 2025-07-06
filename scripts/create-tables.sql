-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  image_url VARCHAR(255) NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  features JSON DEFAULT NULL,
  status ENUM('available', 'maintenance', 'upcoming') DEFAULT 'available',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  age_group VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  max_students INT DEFAULT 20,
  current_students INT DEFAULT 0,
  features JSON DEFAULT NULL,
  status ENUM('active', 'inactive', 'upcoming') DEFAULT 'active',
  coach VARCHAR(255),
  schedule VARCHAR(255),
  equipment VARCHAR(255),
  level VARCHAR(100),
  category VARCHAR(100),
  start_date DATE,
  icon VARCHAR(100),
  color VARCHAR(50),
  image VARCHAR(255),
  prerequisites JSON DEFAULT NULL,
  certification_provided BOOLEAN DEFAULT FALSE,
  discount DECIMAL(5, 2) DEFAULT 0.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  status ENUM('new', 'in-progress', 'resolved') DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  program_id INT NOT NULL,
  student_info JSON NOT NULL,
  payment_intent_id VARCHAR(255),
  amount_paid DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('pending', 'succeeded', 'failed', 'refunded') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'coach', 'student', 'parent') DEFAULT 'student',
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into testimonials
INSERT INTO testimonials (name, role, content, rating, image_url, is_featured)
VALUES
('Rahul Sharma', 'Parent', 'My son has improved tremendously since joining the academy. The coaches are very professional and caring.', 5, 'https://randomuser.me/api/portraits/men/32.jpg', TRUE),
('Priya Patel', 'Student', 'I learned so much in just a few months. The training facilities are excellent and the coaches are very knowledgeable.', 5, 'https://randomuser.me/api/portraits/women/44.jpg', TRUE),
('Amit Kumar', 'Professional Player', 'This academy laid the foundation for my professional career. I highly recommend their advanced training programs.', 5, 'https://randomuser.me/api/portraits/men/22.jpg', TRUE);

-- Insert sample data into facilities
INSERT INTO facilities (name, description, image_url, features, status)
VALUES
('Indoor Training Center', 'State-of-the-art indoor training facility with climate control and specialized equipment.', '/images/facilities/indoor.jpg', '["6 batting lanes", "Bowling machines", "Video analysis setup", "Fitness area"]', 'available'),
('Outdoor Cricket Ground', 'Full-size cricket ground with natural grass and professional maintenance.', '/images/facilities/ground.jpg', '["Standard pitch dimensions", "Practice nets", "Pavilion", "Spectator seating"]', 'available'),
('Performance Analysis Lab', 'High-tech lab for detailed performance analysis and improvement.', '/images/facilities/analysis.jpg', '["Motion capture technology", "Biomechanical analysis", "Performance tracking software", "One-on-one coaching"]', 'available');

-- Insert sample data into gallery
INSERT INTO gallery (title, description, url, category)
VALUES
('Academy Opening Day', 'Grand opening ceremony with local cricket celebrities.', '/images/gallery/opening.jpg', 'events'),
('Summer Camp 2023', 'Students practicing during our annual summer camp.', '/images/gallery/summer-camp.jpg', 'training'),
('Inter-Academy Tournament', 'Our students competing in the regional inter-academy tournament.', '/images/gallery/tournament.jpg', 'competitions');

-- Insert sample data into programs
INSERT INTO programs (title, description, age_group, duration, price, features, coach, level, category, image)
VALUES
('Beginner Cricket Program', 'Introduction to cricket fundamentals for beginners.', '8-12 years', '3 months', 5000.00, '["Basic batting techniques", "Bowling fundamentals", "Fielding practice", "Cricket rules and etiquette"]', 'Coach Rajesh', 'Beginner', 'Youth', '/images/programs/beginner.jpg'),
('Advanced Batting Clinic', 'Specialized program focusing on advanced batting techniques.', '15+ years', '2 months', 8000.00, '["Shot selection", "Footwork drills", "Playing against spin", "Match situation practice"]', 'Coach Sunil', 'Advanced', 'Specialized', '/images/programs/batting.jpg'),
('Cricket Fitness Program', 'Comprehensive fitness training specifically designed for cricketers.', 'All ages', '1 month', 3500.00, '["Strength training", "Agility drills", "Endurance building", "Injury prevention"]', 'Coach Priya', 'Intermediate', 'Fitness', '/images/programs/fitness.jpg');