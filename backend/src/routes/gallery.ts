import express from 'express';
import { pool } from '../config/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all gallery images with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;
    const category = req.query.category as string;
    const featured = req.query.featured === 'true';

    let query = 'SELECT * FROM gallery_images';
    let countQuery = 'SELECT COUNT(*) as total FROM gallery_images';
    const queryParams: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push('category = ?');
      queryParams.push(category);
    }

    if (featured !== undefined) {
      conditions.push('is_featured = ?');
      queryParams.push(featured);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY display_order ASC, created_at DESC LIMIT ? OFFSET ?';
    const finalQueryParams = [...queryParams, limit, offset];
    const countQueryParams = [...queryParams];

    const [images] = await pool.execute(query, finalQueryParams);
    const [countResult] = await pool.execute(countQuery, countQueryParams);
    
    const total = (countResult as any)[0].total;
    
    res.json({
      success: true,
      data: {
        images,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images'
    });
  }
});

// Get gallery categories
router.get('/categories', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'SELECT DISTINCT category FROM gallery_images WHERE category IS NOT NULL ORDER BY category'
    );
    
    const categories = (result as any[]).map(row => row.category);
    
    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Get single gallery image
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'SELECT * FROM gallery_images WHERE id = ?',
      [id]
    );
    
    const images = result as any[];
    if (images.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    res.json({
      success: true,
      data: { image: images[0] }
    });
  } catch (error) {
    console.error('Get gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery image'
    });
  }
});

// Create new gallery image (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      image_url,
      category,
      is_featured = false,
      display_order = 0
    } = req.body;

    if (!image_url) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO gallery_images (title, description, image_url, category, is_featured, display_order, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [title, description, image_url, category, is_featured, display_order]
    );

    const insertResult = result as any;
    const [newImage] = await pool.execute(
      'SELECT * FROM gallery_images WHERE id = ?',
      [insertResult.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Gallery image created successfully',
      data: { image: (newImage as any)[0] }
    });
  } catch (error) {
    console.error('Create gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery image'
    });
  }
});

// Update gallery image (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      image_url,
      category,
      is_featured,
      display_order
    } = req.body;

    // Check if image exists
    const [existingImage] = await pool.execute(
      'SELECT id FROM gallery_images WHERE id = ?',
      [id]
    );

    if ((existingImage as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    await pool.execute(
      `UPDATE gallery_images SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        category = COALESCE(?, category),
        is_featured = COALESCE(?, is_featured),
        display_order = COALESCE(?, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [title, description, image_url, category, is_featured, display_order, id]
    );

    const [updatedImage] = await pool.execute(
      'SELECT * FROM gallery_images WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Gallery image updated successfully',
      data: { image: (updatedImage as any)[0] }
    });
  } catch (error) {
    console.error('Update gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery image'
    });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM gallery_images WHERE id = ?',
      [id]
    );

    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    res.json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery image'
    });
  }
});

// Bulk upload gallery images (admin only)
router.post('/bulk', requireAdmin, async (req, res) => {
  try {
    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Images array is required'
      });
    }

    const insertPromises = images.map(async (image: any) => {
      const { title, description, image_url, category, is_featured = false, display_order = 0 } = image;
      
      if (!image_url) {
        throw new Error('Image URL is required for all images');
      }

      return pool.execute(
        `INSERT INTO gallery_images (title, description, image_url, category, is_featured, display_order, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [title, description, image_url, category, is_featured, display_order]
      );
    });

    await Promise.all(insertPromises);

    res.status(201).json({
      success: true,
      message: `${images.length} gallery images created successfully`
    });
  } catch (error) {
    console.error('Bulk create gallery images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery images'
    });
  }
});

export default router;
