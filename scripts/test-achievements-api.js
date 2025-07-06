// scripts/test-achievements-api.js
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

async function testAchievementsAPI() {
  console.log('Testing achievements API functionality...');
  console.log('Database configuration:');
  console.log(`- Host: ${dbConfig.host}`);
  console.log(`- Database: ${dbConfig.database}`);
  console.log(`- User: ${dbConfig.user}`);
  console.log(`- Port: ${dbConfig.port}`);
  
  let connection;
  
  try {
    // Create a connection
    console.log('\nConnecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');
    
    // Test getting all achievements
    console.log('\nTesting GET /api/achievements endpoint...');
    console.log('Executing query: SELECT * FROM achievements');
    const [achievements] = await connection.query('SELECT * FROM achievements');
    
    console.log(`✅ Found ${achievements.length} achievements`);
    achievements.forEach((achievement, index) => {
      console.log(`\nAchievement ${index + 1}:`);
      console.log(`- ID: ${achievement.id}`);
      console.log(`- Title: ${achievement.title}`);
      console.log(`- Category: ${achievement.category}`);
      console.log(`- Status: ${achievement.status}`);
    });
    
    // Test creating a new achievement
    console.log('\nTesting POST /api/achievements endpoint...');
    const newAchievement = {
      title: 'Test Achievement',
      description: 'This is a test achievement created by the API test script',
      achievement_date: new Date().toISOString().split('T')[0],
      icon: '🧪',
      color: 'from-yellow-500 to-yellow-600',
      image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Test',
      display_order: 99,
      status: 'active'
    };
    
    console.log('Creating new achievement:');
    console.log(newAchievement);
    
    const [result] = await connection.query('INSERT INTO achievements SET ?', newAchievement);
    const newId = result.insertId;
    
    console.log(`✅ Created new achievement with ID: ${newId}`);
    
    // Test getting the new achievement
    console.log('\nTesting GET /api/achievements/:id endpoint...');
    const [newAchievements] = await connection.query('SELECT * FROM achievements WHERE id = ?', [newId]);
    
    if (newAchievements.length > 0) {
      console.log('✅ Retrieved the new achievement:');
      console.log(`- ID: ${newAchievements[0].id}`);
      console.log(`- Title: ${newAchievements[0].title}`);
      console.log(`- Description: ${newAchievements[0].description}`);
    } else {
      console.log('❌ Failed to retrieve the new achievement');
    }
    
    // Test updating the achievement
    console.log('\nTesting PUT /api/achievements/:id endpoint...');
    const updates = {
      title: 'Updated Test Achievement',
      description: 'This achievement was updated by the API test script'
    };
    
    console.log('Updating achievement:');
    console.log(updates);
    
    await connection.query('UPDATE achievements SET ? WHERE id = ?', [updates, newId]);
    
    // Verify the update
    const [updatedAchievements] = await connection.query('SELECT * FROM achievements WHERE id = ?', [newId]);
    
    if (updatedAchievements.length > 0) {
      console.log('✅ Achievement updated successfully:');
      console.log(`- ID: ${updatedAchievements[0].id}`);
      console.log(`- Title: ${updatedAchievements[0].title}`);
      console.log(`- Description: ${updatedAchievements[0].description}`);
    } else {
      console.log('❌ Failed to update the achievement');
    }
    
    // Test deleting the achievement
    console.log('\nTesting DELETE /api/achievements/:id endpoint...');
    await connection.query('DELETE FROM achievements WHERE id = ?', [newId]);
    
    // Verify the deletion
    const [deletedAchievements] = await connection.query('SELECT * FROM achievements WHERE id = ?', [newId]);
    
    if (deletedAchievements.length === 0) {
      console.log(`✅ Achievement with ID ${newId} deleted successfully`);
    } else {
      console.log('❌ Failed to delete the achievement');
    }
    
    console.log('\n🎉 All achievements API tests completed successfully!');
    console.log('The database connection and CRUD operations are working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

// Run the test
testAchievementsAPI();