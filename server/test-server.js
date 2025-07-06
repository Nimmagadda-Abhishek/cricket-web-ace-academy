// Simple test server
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

// Database check endpoint
app.get('/db-check', async (req, res) => {
  try {
    // Database configuration
    const dbConfig = {
      host: process.env.VITE_DB_HOST,
      user: process.env.VITE_DB_USER,
      password: process.env.VITE_DB_PASSWORD,
      database: process.env.VITE_DB_NAME,
      port: process.env.VITE_DB_PORT || 3306
    };
    
    // Create a connection
    const connection = await mysql.createConnection(dbConfig);
    
    // Test the connection
    await connection.query('SELECT 1');
    
    // Close the connection
    await connection.end();
    
    res.json({
      status: 'success',
      message: 'Database connection successful',
      dbConfig: {
        host: dbConfig.host,
        database: dbConfig.database,
        user: dbConfig.user,
        port: dbConfig.port
      }
    });
  } catch (error) {
    console.error('Database connection check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Testimonials endpoint
app.get('/testimonials', async (req, res) => {
  try {
    // Database configuration
    const dbConfig = {
      host: process.env.VITE_DB_HOST,
      user: process.env.VITE_DB_USER,
      password: process.env.VITE_DB_PASSWORD,
      database: process.env.VITE_DB_NAME,
      port: process.env.VITE_DB_PORT || 3306
    };
    
    // Create a connection
    const connection = await mysql.createConnection(dbConfig);
    
    // Get testimonials
    const [testimonials] = await connection.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    
    // Close the connection
    await connection.end();
    
    // Transform is_featured from 0/1 to boolean
    const transformedTestimonials = testimonials.map(testimonial => ({
      ...testimonial,
      is_featured: testimonial.is_featured === 1
    }));
    
    res.json({
      status: 'success',
      data: {
        testimonials: transformedTestimonials
      }
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch testimonials',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log(`Database check available at: http://localhost:${PORT}/db-check`);
  console.log(`Testimonials available at: http://localhost:${PORT}/testimonials`);
});