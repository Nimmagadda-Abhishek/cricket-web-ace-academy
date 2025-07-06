// scripts/test-server.js
import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

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

// Create Express app
const app = express();
const PORT = 5001; // Use a different port to avoid conflicts

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Create a connection
    const connection = await mysql.createConnection(dbConfig);
    
    // Test the connection
    await connection.query('SELECT 1');
    
    // Close the connection
    await connection.end();
    
    res.json({
      status: 'success',
      message: 'Server is running and database connection is working',
      timestamp: new Date().toISOString(),
      dbConfig: {
        host: dbConfig.host,
        database: dbConfig.database,
        user: dbConfig.user,
        port: dbConfig.port
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server is running but database connection failed',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/health`);
});