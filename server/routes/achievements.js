// server/routes/achievements.js
import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

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
  console.log('MySQL connection pool created for achievements routes');
} catch (error) {
  console.error('Failed to create MySQL connection pool for achievements:', error);
}

// Get all achievements
router.get('/', async (req, res) => {
  try {
    if (!pool) {
      // If pool is not available, return mock data
      return res.json({
        status: 'success',
        message: 'Using mock achievements data (no database connection)',
        achievements: getMockAchievements()
      });
    }
    
    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    try {
      // Query achievements
      const [achievements] = await connection.query(
        'SELECT * FROM achievements ORDER BY display_order, achievement_date DESC'
      );
      
      res.json({
        status: 'success',
        message: 'Achievements retrieved successfully',
        achievements
      });
    } catch (dbError) {
      console.error('Database error retrieving achievements:', dbError);
      
      // Return mock data if database query fails
      res.json({
        status: 'success',
        message: 'Using mock achievements data (database query failed)',
        error: dbError.message,
        achievements: getMockAchievements()
      });
    } finally {
      // Release the connection
      connection.release();
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

// Get achievement by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!pool) {
      // If pool is not available, return mock data
      const mockAchievements = getMockAchievements();
      const achievement = mockAchievements.find(a => a.id === parseInt(id));
      
      if (!achievement) {
        return res.status(404).json({
          status: 'fail',
          message: `Achievement with ID ${id} not found`
        });
      }
      
      return res.json({
        status: 'success',
        message: 'Using mock achievement data (no database connection)',
        achievement
      });
    }
    
    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    try {
      // Query achievement
      const [achievements] = await connection.query(
        'SELECT * FROM achievements WHERE id = ?',
        [id]
      );
      
      if (achievements.length === 0) {
        return res.status(404).json({
          status: 'fail',
          message: `Achievement with ID ${id} not found`
        });
      }
      
      res.json({
        status: 'success',
        message: 'Achievement retrieved successfully',
        achievement: achievements[0]
      });
    } catch (dbError) {
      console.error(`Database error retrieving achievement with ID ${id}:`, dbError);
      
      // Return mock data if database query fails
      const mockAchievements = getMockAchievements();
      const achievement = mockAchievements.find(a => a.id === parseInt(id));
      
      if (!achievement) {
        return res.status(404).json({
          status: 'fail',
          message: `Achievement with ID ${id} not found`
        });
      }
      
      res.json({
        status: 'success',
        message: 'Using mock achievement data (database query failed)',
        error: dbError.message,
        achievement
      });
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    console.error(`Error retrieving achievement with ID ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve achievement',
      error: error.message
    });
  }
});

// Create a new achievement
router.post('/', async (req, res) => {
  try {
    const achievementData = req.body;
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'achievement_date'];
    for (const field of requiredFields) {
      if (!achievementData[field]) {
        return res.status(400).json({
          status: 'fail',
          message: `Missing required field: ${field}`
        });
      }
    }
    
    if (!pool) {
      // If pool is not available, return mock response
      return res.json({
        status: 'success',
        message: 'Achievement created successfully (mock response)',
        achievement: {
          id: Math.floor(Math.random() * 1000) + 100,
          ...achievementData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      });
    }
    
    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    try {
      // Add timestamps
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      achievementData.created_at = now;
      achievementData.updated_at = now;
      
      // Insert achievement
      const [result] = await connection.query(
        'INSERT INTO achievements SET ?',
        achievementData
      );
      
      // Get the inserted achievement
      const [achievements] = await connection.query(
        'SELECT * FROM achievements WHERE id = ?',
        [result.insertId]
      );
      
      res.status(201).json({
        status: 'success',
        message: 'Achievement created successfully',
        achievement: achievements[0]
      });
    } catch (dbError) {
      console.error('Database error creating achievement:', dbError);
      
      // Return mock response if database query fails
      res.json({
        status: 'success',
        message: 'Achievement created successfully (mock response due to database error)',
        error: dbError.message,
        achievement: {
          id: Math.floor(Math.random() * 1000) + 100,
          ...achievementData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      });
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create achievement',
      error: error.message
    });
  }
});

// Update an achievement
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const achievementData = req.body;
  
  try {
    if (!pool) {
      // If pool is not available, return mock response
      return res.json({
        status: 'success',
        message: 'Achievement updated successfully (mock response)',
        achievement: {
          id: parseInt(id),
          ...achievementData,
          updated_at: new Date().toISOString()
        }
      });
    }
    
    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    try {
      // Add updated timestamp
      achievementData.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      // Update achievement
      const [result] = await connection.query(
        'UPDATE achievements SET ? WHERE id = ?',
        [achievementData, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 'fail',
          message: `Achievement with ID ${id} not found`
        });
      }
      
      // Get the updated achievement
      const [achievements] = await connection.query(
        'SELECT * FROM achievements WHERE id = ?',
        [id]
      );
      
      res.json({
        status: 'success',
        message: 'Achievement updated successfully',
        achievement: achievements[0]
      });
    } catch (dbError) {
      console.error(`Database error updating achievement with ID ${id}:`, dbError);
      
      // Return mock response if database query fails
      res.json({
        status: 'success',
        message: 'Achievement updated successfully (mock response due to database error)',
        error: dbError.message,
        achievement: {
          id: parseInt(id),
          ...achievementData,
          updated_at: new Date().toISOString()
        }
      });
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    console.error(`Error updating achievement with ID ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update achievement',
      error: error.message
    });
  }
});

// Delete an achievement
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!pool) {
      // If pool is not available, return mock response
      return res.json({
        status: 'success',
        message: `Achievement with ID ${id} deleted successfully (mock response)`
      });
    }
    
    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    try {
      // Delete achievement
      const [result] = await connection.query(
        'DELETE FROM achievements WHERE id = ?',
        [id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 'fail',
          message: `Achievement with ID ${id} not found`
        });
      }
      
      res.json({
        status: 'success',
        message: `Achievement with ID ${id} deleted successfully`
      });
    } catch (dbError) {
      console.error(`Database error deleting achievement with ID ${id}:`, dbError);
      
      // Return mock response if database query fails
      res.json({
        status: 'success',
        message: `Achievement with ID ${id} deleted successfully (mock response due to database error)`,
        error: dbError.message
      });
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    console.error(`Error deleting achievement with ID ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete achievement',
      error: error.message
    });
  }
});

// Helper function to get mock achievements
function getMockAchievements() {
  return [
    {
      id: 1,
      title: 'State Team Selection',
      description: '5 of our students were selected for the state cricket team in 2023, showcasing our academy\'s excellence in training.',
      achievement_date: '2023-06-15',
      icon: '🏆',
      color: 'from-cricket-green to-cricket-green/80',
      image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Team',
      display_order: 1,
      status: 'active'
    },
    {
      id: 2,
      title: 'IPL Selection',
      description: 'Two of our academy graduates were picked in the IPL auction, marking a significant milestone in their professional careers.',
      achievement_date: '2022-12-20',
      icon: '🏏',
      color: 'from-cricket-orange to-cricket-orange/80',
      image_url: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Professional',
      display_order: 2,
      status: 'active'
    },
    {
      id: 3,
      title: 'Under-18 National Team',
      description: 'Three students selected for the Under-18 National Cricket Team, representing our academy at the highest youth level.',
      achievement_date: '2023-08-10',
      icon: '👦',
      color: 'from-blue-500 to-blue-600',
      image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Youth',
      display_order: 3,
      status: 'active'
    },
    {
      id: 4,
      title: 'Best Cricket Academy',
      description: 'Awarded as the Best Cricket Academy in the region for 2023, recognizing our commitment to excellence in cricket training.',
      achievement_date: '2023-01-15',
      icon: '🎓',
      color: 'from-purple-600 to-purple-700',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Academy',
      display_order: 4,
      status: 'active'
    }
  ];
}

export default router;