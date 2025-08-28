import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cricket_academy'
    });

    console.log('✅ Database connected successfully');
    
    // Check each table
    const tables = ['students', 'programs', 'coaches', 'achievements', 'facilities', 'gallery_images'];
    
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`📊 ${table}: ${rows[0].count} records`);
        
        if (rows[0].count > 0) {
          const [sample] = await connection.execute(`SELECT * FROM ${table} LIMIT 2`);
          console.log(`🔍 Sample from ${table}:`, JSON.stringify(sample, null, 2));
        }
      } catch (error) {
        console.log(`❌ Error checking ${table}:`, error.message);
      }
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testDatabase();
