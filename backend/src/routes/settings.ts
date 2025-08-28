import express from 'express';
import { pool } from '../config/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const [settings] = await pool.execute(
      'SELECT key_name, key_value, description FROM settings ORDER BY key_name'
    );

    // Convert to key-value object for easier frontend use
    const settingsObj = (settings as any[]).reduce((acc, setting) => {
      acc[setting.key_name] = {
        value: setting.key_value,
        description: setting.description
      };
      return acc;
    }, {});

    res.json({
      success: true,
      data: { settings: settingsObj }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Get single setting by key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const [result] = await pool.execute(
      'SELECT * FROM settings WHERE key_name = ?',
      [key]
    );
    
    const settings = result as any[];
    if (settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      data: { setting: settings[0] }
    });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch setting'
    });
  }
});

// Update setting (admin only)
router.put('/:key', requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Value is required'
      });
    }

    // Check if setting exists, if not create it
    const [existing] = await pool.execute(
      'SELECT id FROM settings WHERE key_name = ?',
      [key]
    );

    if ((existing as any[]).length === 0) {
      // Create new setting
      await pool.execute(
        'INSERT INTO settings (key_name, key_value, description, created_at) VALUES (?, ?, ?, NOW())',
        [key, value, description || null]
      );
    } else {
      // Update existing setting
      await pool.execute(
        `UPDATE settings SET 
          key_value = ?, 
          description = COALESCE(?, description),
          updated_at = CURRENT_TIMESTAMP
         WHERE key_name = ?`,
        [value, description, key]
      );
    }

    const [updatedSetting] = await pool.execute(
      'SELECT * FROM settings WHERE key_name = ?',
      [key]
    );

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: { setting: (updatedSetting as any)[0] }
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update setting'
    });
  }
});

// Update multiple settings at once (admin only)
router.patch('/', requireAdmin, async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Settings object is required'
      });
    }

    const updatePromises = Object.entries(settings).map(async ([key, settingData]: [string, any]) => {
      const { value, description } = settingData;
      
      if (value === undefined) return;

      // Check if setting exists
      const [existing] = await pool.execute(
        'SELECT id FROM settings WHERE key_name = ?',
        [key]
      );

      if ((existing as any[]).length === 0) {
        // Create new setting
        return pool.execute(
          'INSERT INTO settings (key_name, key_value, description, created_at) VALUES (?, ?, ?, NOW())',
          [key, value, description || null]
        );
      } else {
        // Update existing setting
        return pool.execute(
          `UPDATE settings SET 
            key_value = ?, 
            description = COALESCE(?, description),
            updated_at = CURRENT_TIMESTAMP
           WHERE key_name = ?`,
          [value, description, key]
        );
      }
    });

    await Promise.all(updatePromises);

    // Get updated settings
    const [updatedSettings] = await pool.execute(
      'SELECT key_name, key_value, description FROM settings ORDER BY key_name'
    );

    const settingsObj = (updatedSettings as any[]).reduce((acc, setting) => {
      acc[setting.key_name] = {
        value: setting.key_value,
        description: setting.description
      };
      return acc;
    }, {});

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings: settingsObj }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Delete setting (admin only)
router.delete('/:key', requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM settings WHERE key_name = ?',
      [key]
    );

    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete setting'
    });
  }
});

export default router;
