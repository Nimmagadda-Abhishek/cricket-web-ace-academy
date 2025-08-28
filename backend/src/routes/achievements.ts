import express from 'express';
import { pool } from '../config/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all achievements with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const featured = req.query.featured === 'true';

    let query = 'SELECT * FROM achievements';
    let countQuery = 'SELECT COUNT(*) as total FROM achievements';
    const queryParams: any[] = [];

    if (featured !== undefined) {
      query += ' WHERE is_featured = ?';
      countQuery += ' WHERE is_featured = ?';
      queryParams.push(featured);
    }

    query += ' ORDER BY date_achieved DESC, created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [achievements] = await pool.execute(query, queryParams);
    const [countResult] = await pool.execute(countQuery, featured !== undefined ? [featured] : []);
    
    const total = (countResult as any)[0].total;
    
    res.json({
      success: true,
      data: {
        achievements,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements'
    });
  }
});

// Get single achievement
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'SELECT * FROM achievements WHERE id = ?',
      [id]
    );
    
    const achievements = result as any[];
    if (achievements.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      data: { achievement: achievements[0] }
    });
  } catch (error) {
    console.error('Get achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement'
    });
  }
});

// Create new achievement (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      image_url,
      date_achieved,
      category,
      is_featured = false
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO achievements (title, description, image_url, date_achieved, category, is_featured, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [title, description, image_url, date_achieved, category, is_featured]
    );

    const insertResult = result as any;
    const [newAchievement] = await pool.execute(
      'SELECT * FROM achievements WHERE id = ?',
      [insertResult.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: { achievement: (newAchievement as any)[0] }
    });
  } catch (error) {
    console.error('Create achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create achievement'
    });
  }
});

// Update achievement (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      image_url,
      date_achieved,
      category,
      is_featured
    } = req.body;

    // Check if achievement exists
    const [existingAchievement] = await pool.execute(
      'SELECT id FROM achievements WHERE id = ?',
      [id]
    );

    if ((existingAchievement as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    await pool.execute(
      `UPDATE achievements SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        date_achieved = COALESCE(?, date_achieved),
        category = COALESCE(?, category),
        is_featured = COALESCE(?, is_featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [title, description, image_url, date_achieved, category, is_featured, id]
    );

    const [updatedAchievement] = await pool.execute(
      'SELECT * FROM achievements WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Achievement updated successfully',
      data: { achievement: (updatedAchievement as any)[0] }
    });
  } catch (error) {
    console.error('Update achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update achievement'
    });
  }
});

// Delete achievement (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM achievements WHERE id = ?',
      [id]
    );

    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    console.error('Delete achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete achievement'
    });
  }
});

export default router;
