import pool from './database';

async function testDatabaseConnection() {
  try {
    // Test connection
    const conn = await pool.getConnection();
    await conn.ping();
    console.log('✅ Successfully connected to the MySQL database!');
    
    // List all tables
    const [tables] = await conn.query('SHOW TABLES');
    console.log('📋 Tables in the database:');
    for (const row of tables as any[]) {
      // The key is 'Tables_in_<database_name>'
      const tableName = Object.values(row)[0];
      console.log(`- ${tableName}`);
    }
    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection or query failed:', error);
    process.exit(1);
  }
}

testDatabaseConnection(); 