// server/routes/auth.js
import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const router = express.Router();

// Database configuration
const dbConfig = {
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
  port: process.env.VITE_DB_PORT || 3306
};

// Create a connection pool
let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log('MySQL connection pool created for auth routes');
} catch (error) {
  console.error('Failed to create MySQL connection pool:', error);
}

// Helper function to generate a token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // For development/demo purposes, allow a hardcoded admin login
  if ((email === 'admin@kalyancricketacademy.com' && password === 'Admin@123456') ||
      (email === 'admin' && password === 'password')) {
    
    // Generate a token
    const token = generateToken();
    
    // Return success response
    return res.json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: 1,
        email,
        name: 'Admin User',
        role: 'admin'
      }
    });
  }
  
  // If not using the demo credentials, check the database
  try {
    if (!pool) {
      throw new Error('Database connection not available');
    }
    
    // Query the database for the user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    
    const user = users[0];
    
    // In a real app, you would hash the password and compare
    // For simplicity, we're doing a direct comparison
    if (user.password !== password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    
    // Generate a token
    const token = generateToken();
    
    // Return success response
    res.json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login',
      error: error.message
    });
  }
});

// Debug route to check if auth API is working
router.get('/debug', (req, res) => {
  res.json({
    status: 'success',
    message: 'Debug endpoint is working',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    demoCredentials: {
      email: 'admin@kalyancricketacademy.com',
      password: 'Admin@123456'
    },
    dbConfig: {
      host: dbConfig.host,
      database: dbConfig.database,
      user: dbConfig.user,
      port: dbConfig.port
    }
  });
});

// Check database connection
router.get('/check-db', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Database connection pool not initialized');
    }
    
    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    // Test the connection with a simple query
    await connection.query('SELECT 1');
    
    // Release the connection
    connection.release();
    
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
      error: error.message,
      dbConfig: {
        host: dbConfig.host,
        database: dbConfig.database,
        user: dbConfig.user,
        port: dbConfig.port
      }
    });
  }
});

// Test achievements endpoint
router.get('/achievements', async (req, res) => {
  try {
    if (!pool) {
      // If pool is not available, return mock data
      return res.json({
        status: 'success',
        message: 'Using mock achievements data (no database connection)',
        count: 2,
        achievements: [
          {
            id: 1,
            title: 'State Team Selection',
            description: 'Mock achievement 1',
            achievement_date: '2023-06-15',
            status: 'active'
          },
          {
            id: 2,
            title: 'IPL Selection',
            description: 'Mock achievement 2',
            achievement_date: '2022-12-20',
            status: 'active'
          }
        ]
      });
    }
    
    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();
      
      // Query achievements
      const [achievements] = await connection.query('SELECT * FROM achievements LIMIT 10');
      
      // Release the connection
      connection.release();
      
      res.json({
        status: 'success',
        message: 'Achievements retrieved successfully',
        count: achievements.length,
        achievements
      });
    } catch (dbError) {
      console.error('Database error retrieving achievements:', dbError);
      
      // Return mock data if database query fails
      res.json({
        status: 'success',
        message: 'Using mock achievements data (database query failed)',
        error: dbError.message,
        count: 2,
        achievements: [
          {
            id: 1,
            title: 'State Team Selection',
            description: 'Mock achievement 1',
            achievement_date: '2023-06-15',
            status: 'active'
          },
          {
            id: 2,
            title: 'IPL Selection',
            description: 'Mock achievement 2',
            achievement_date: '2022-12-20',
            status: 'active'
          }
        ]
      });
    }
  } catch (error) {
    console.error('Error in achievements endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve achievements',
      error: error.message
    });
  }
});

export default router;