/**
 * Script to test direct connection to the database and API endpoints
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import http from 'http';

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

// Test database connection
async function testDatabaseConnection() {
  console.log('\n🔍 Testing direct database connection...');
  console.log('Database configuration:');
  console.log(`- Host: ${dbConfig.host}`);
  console.log(`- Database: ${dbConfig.database}`);
  console.log(`- User: ${dbConfig.user}`);
  console.log(`- Port: ${dbConfig.port}`);
  
  try {
    // Create a connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');
    
    // Test a simple query
    const [result] = await connection.query('SELECT 1 as test');
    console.log('✅ Query executed successfully:', result);
    
    // Check if testimonials table exists
    try {
      const [tables] = await connection.query('SHOW TABLES LIKE "testimonials"');
      if (tables.length > 0) {
        console.log('✅ Testimonials table exists');
        
        // Get testimonials count
        const [countResult] = await connection.query('SELECT COUNT(*) as count FROM testimonials');
        console.log(`✅ Testimonials count: ${countResult[0].count}`);
        
        // Get sample testimonial
        if (countResult[0].count > 0) {
          const [testimonials] = await connection.query('SELECT * FROM testimonials LIMIT 1');
          console.log('✅ Sample testimonial:', JSON.stringify(testimonials[0], null, 2));
        }
      } else {
        console.log('❌ Testimonials table does not exist');
      }
    } catch (error) {
      console.error('❌ Error checking testimonials table:', error.message);
    }
    
    // Close the connection
    await connection.end();
    console.log('✅ Database connection closed');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied. Check your username and password.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Check if the database server is running and accessible.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('Database does not exist. Check the database name.');
    }
    return false;
  }
}

// Test HTTP connection to localhost
function testHttpConnection(port) {
  return new Promise((resolve) => {
    console.log(`\n🔍 Testing HTTP connection to localhost:${port}...`);
    
    const req = http.get(`http://localhost:${port}/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Connected to localhost:${port} successfully`);
        console.log(`Status code: ${res.statusCode}`);
        try {
          const jsonData = JSON.parse(data);
          console.log('Response:', JSON.stringify(jsonData, null, 2));
          resolve(true);
        } catch (error) {
          console.log('Response (raw):', data);
          resolve(true);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Error connecting to localhost:${port}:`, error.message);
      if (error.code === 'ECONNREFUSED') {
        console.error(`No server is running on port ${port} or it's not accessible.`);
      }
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.error(`❌ Connection to localhost:${port} timed out`);
      req.destroy();
      resolve(false);
    });
  });
}

// Start a simple HTTP server for testing
function startTestServer() {
  return new Promise((resolve) => {
    console.log('\n🔍 Starting a test HTTP server on port 5005...');
    
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'success',
        message: 'Test server is running',
        timestamp: new Date().toISOString()
      }));
    });
    
    server.on('error', (error) => {
      console.error('❌ Error starting test server:', error.message);
      resolve(null);
    });
    
    server.listen(5005, () => {
      console.log('✅ Test server started on port 5005');
      resolve(server);
    });
  });
}

// Main function
async function main() {
  console.log('🚀 Starting diagnostic tests...');
  
  // Test database connection
  const dbConnected = await testDatabaseConnection();
  
  // Start a test server
  const testServer = await startTestServer();
  
  // Test connection to our test server
  if (testServer) {
    await testHttpConnection(5005);
    
    // Close the test server
    testServer.close(() => {
      console.log('✅ Test server closed');
    });
  }
  
  // Test connection to the main server
  const mainServerConnected = await testHttpConnection(5000);
  
  // Test connection to the test server we created earlier
  const testServerConnected = await testHttpConnection(5001);
  
  // Summary
  console.log('\n📋 Diagnostic Summary:');
  console.log(`- Database Connection: ${dbConnected ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`- Test Server (5005): ${testServer ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`- Main Server (5000): ${mainServerConnected ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`- Test Server (5001): ${testServerConnected ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  if (!mainServerConnected) {
    console.log('\n🔧 Recommendations:');
    console.log('1. Check if the main server is running on port 5000');
    console.log('2. Check for any firewall or antivirus blocking the connection');
    console.log('3. Try running the server with administrator privileges');
    console.log('4. Check if another process is using port 5000');
    console.log('5. Try using a different port for the server');
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error:', error);
});