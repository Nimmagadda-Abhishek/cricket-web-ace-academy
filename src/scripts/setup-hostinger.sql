-- Setup script for Hostinger MySQL database
-- This script creates the necessary tables for the Cricket Academy website

-- Create testimonials table
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
);

-- Create facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  features JSON,
  status ENUM('available', 'maintenance', 'upcoming') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  url VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testimonials
INSERT INTO testimonials (name, role, content, rating, image_url, is_featured)
VALUES 
('Rahul Sharma', 'Student', 'The coaching at Kalyan Cricket Academy has transformed my game. The personalized attention and structured training have helped me improve significantly.', 5, 'https://randomuser.me/api/portraits/men/32.jpg', 1),
('Priya Patel', 'Parent', 'My son has been training here for 2 years and the improvement in his skills is remarkable. The coaches are professional and caring.', 5, 'https://randomuser.me/api/portraits/women/44.jpg', 1),
('Amit Kumar', 'Student', 'The academy provides excellent facilities and the coaches are very knowledgeable. I have learned a lot about cricket techniques and strategy.', 4, 'https://randomuser.me/api/portraits/men/62.jpg', 0);

-- Insert sample data for facilities
INSERT INTO facilities (name, description, image_url, features, status)
VALUES 
('Indoor Training Center', 'State-of-the-art indoor training facility with climate control and specialized equipment for year-round practice.', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da', '["6 batting lanes", "Bowling machines", "Video analysis setup", "Fitness area"]', 'available'),
('Cricket Ground', 'Full-size cricket ground with well-maintained pitch and outfield for match practice and tournaments.', 'https://images.unsplash.com/photo-1593766788306-28561a3aabc2', '["Standard size pitch", "Practice nets", "Pavilion", "Seating area"]', 'available'),
('Performance Analysis Lab', 'Advanced technology lab for detailed analysis of player techniques and performance metrics.', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12', '["High-speed cameras", "Motion analysis software", "Performance tracking", "Personalized reports"]', 'upcoming');

-- Insert sample data for gallery
INSERT INTO gallery (title, description, url, category)
VALUES 
('Training Session', 'Students practicing batting techniques with coach guidance', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da', 'training'),
('Tournament Winners', 'Our academy team winning the regional championship', 'https://images.unsplash.com/photo-1593766788306-28561a3aabc2', 'events'),
('New Facilities', 'Recently upgraded practice nets with bowling machines', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12', 'facilities');