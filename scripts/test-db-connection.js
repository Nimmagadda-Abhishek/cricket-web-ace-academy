// scripts/test-db-connection.js
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

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Connection details:');
  console.log(`- Host: ${dbConfig.host}`);
  console.log(`- Database: ${dbConfig.database}`);
  console.log(`- User: ${dbConfig.user}`);
  console.log(`- Port: ${dbConfig.port}`);
  
  try {
    // Create a connection
    console.log('Attempting to connect...');
    const connection = await mysql.createConnection(dbConfig);
    
    // Test the connection
    console.log('Testing query execution...');
    await connection.query('SELECT 1');
    
    // Check if tables exist
    console.log('Checking database tables...');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('⚠️ No tables found in the database.');
      console.log('You may need to initialize your database schema using:');
      console.log('node scripts/init-dev-database.js');
    } else {
      console.log(`✅ Found ${tables.length} tables in the database:`);
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`- ${tableName}`);
      });
      
      // Check if achievements table exists
      const achievementsTable = tables.find(table => Object.values(table)[0] === 'achievements');
      if (achievementsTable) {
        console.log('\n✅ Achievements table exists.');
        
        // Get columns in achievements table
        const [columns] = await connection.query('SHOW COLUMNS FROM achievements');
        console.log(`Found ${columns.length} columns in the achievements table.`);
      } else {
        console.log('\n⚠️ Achievements table does not exist.');
        console.log('You may need to initialize your database schema using:');
        console.log('node scripts/init-dev-database.js');
      }
    }
    
    // Close the connection
    await connection.end();
    
    console.log('\n🎉 Database connection test completed successfully!');
    console.log('Your website should be able to connect to the database.');
  } catch (error) {
    console.error('\n❌ Database connection test failed!');
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

// Run the test
testConnection();