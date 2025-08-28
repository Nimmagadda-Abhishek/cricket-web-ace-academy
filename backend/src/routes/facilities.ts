import express from 'express';
import { pool } from '../config/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all facilities with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const active = req.query.active === 'true';

    let query = 'SELECT * FROM facilities';
    let countQuery = 'SELECT COUNT(*) as total FROM facilities';
    const queryParams: any[] = [];

    if (active !== undefined) {
      query += ' WHERE is_active = ?';
      countQuery += ' WHERE is_active = ?';
      queryParams.push(active);
    }

    query += ' ORDER BY display_order ASC, created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [facilities] = await pool.execute(query, queryParams);
    const [countResult] = await pool.execute(countQuery, active !== undefined ? [active] : []);
    
    const total = (countResult as any)[0].total;
    
    res.json({
      success: true,
      data: {
        facilities,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get facilities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch facilities'
    });
  }
});

// Get facilities count for frontend check
router.get('/count', async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM facilities WHERE is_active = true');
    const count = (result as any)[0].count;
    
    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Get facilities count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get facilities count',
      count: null
    });
  }
});

// Get single facility
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'SELECT * FROM facilities WHERE id = ?',
      [id]
    );
    
    const facilities = result as any[];
    if (facilities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.json({
      success: true,
      data: { facility: facilities[0] }
    });
  } catch (error) {
    console.error('Get facility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch facility'
    });
  }
});

// Create new facility (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      short_description,
      image_url,
      features,
      icon,
      display_order = 0
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);

    const [result] = await pool.execute(
      `INSERT INTO facilities (title, description, short_description, image_url, features, icon, display_order, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [title, description, short_description, image_url, featuresJson, icon, display_order]
    );

    const insertResult = result as any;
    const [newFacility] = await pool.execute(
      'SELECT * FROM facilities WHERE id = ?',
      [insertResult.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      data: { facility: (newFacility as any)[0] }
    });
  } catch (error) {
    console.error('Create facility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create facility'
    });
  }
});

// Update facility (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      short_description,
      image_url,
      features,
      icon,
      is_active,
      display_order
    } = req.body;

    // Check if facility exists
    const [existingFacility] = await pool.execute(
      'SELECT id FROM facilities WHERE id = ?',
      [id]
    );

    if ((existingFacility as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    const featuresJson = typeof features === 'string' ? features : JSON.stringify(features);

    await pool.execute(
      `UPDATE facilities SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        short_description = COALESCE(?, short_description),
        image_url = COALESCE(?, image_url),
        features = COALESCE(?, features),
        icon = COALESCE(?, icon),
        is_active = COALESCE(?, is_active),
        display_order = COALESCE(?, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [title, description, short_description, image_url, featuresJson, icon, is_active, display_order, id]
    );

    const [updatedFacility] = await pool.execute(
      'SELECT * FROM facilities WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Facility updated successfully',
      data: { facility: (updatedFacility as any)[0] }
    });
  } catch (error) {
    console.error('Update facility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update facility'
    });
  }
});

// Delete facility (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM facilities WHERE id = ?',
      [id]
    );

    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.json({
      success: true,
      message: 'Facility deleted successfully'
    });
  } catch (error) {
    console.error('Delete facility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete facility'
    });
  }
});

export default router;
