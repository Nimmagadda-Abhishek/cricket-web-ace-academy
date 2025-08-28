import { Response } from 'express';
import { pool } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Program extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  price: number;
  duration: string;
  age_group: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  max_participants: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class ProgramsController {
  // Get all programs (public)
  static async getPrograms(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const isActive = req.query.active !== 'false'; // Default to active only

      let query = 'SELECT * FROM programs';
      let countQuery = 'SELECT COUNT(*) as total FROM programs';
      const params: any[] = [];

      if (isActive) {
        query += ' WHERE is_active = true';
        countQuery += ' WHERE is_active = true';
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [programs] = await pool.execute<Program[]>(query, params);
      const [countResult] = await pool.execute<RowDataPacket[]>(countQuery);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          programs,
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        }
      });
    } catch (error) {
      console.error('Get programs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single program (public)
  static async getProgram(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const [programs] = await pool.execute<Program[]>(
        'SELECT * FROM programs WHERE id = ? AND is_active = true',
        [id]
      );

      const program = programs[0];
      if (!program) {
        return res.status(404).json({
          success: false,
          message: 'Program not found'
        });
      }

      res.json({
        success: true,
        data: { program }
      });
    } catch (error) {
      console.error('Get program error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create program (admin only)
  static async createProgram(req: AuthRequest, res: Response) {
    try {
      const {
        title,
        description,
        short_description,
        image_url,
        price,
        duration,
        age_group,
        skill_level,
        max_participants
      } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO programs 
         (title, description, short_description, image_url, price, duration, age_group, skill_level, max_participants) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, short_description, image_url, price, duration, age_group, skill_level, max_participants]
      );

      const [newProgram] = await pool.execute<Program[]>(
        'SELECT * FROM programs WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Program created successfully',
        data: { program: newProgram[0] }
      });
    } catch (error) {
      console.error('Create program error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update program (admin only)
  static async updateProgram(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        short_description,
        image_url,
        price,
        duration,
        age_group,
        skill_level,
        max_participants,
        is_active
      } = req.body;

      // Check if program exists
      const [existingPrograms] = await pool.execute<Program[]>(
        'SELECT id FROM programs WHERE id = ?',
        [id]
      );

      if (existingPrograms.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Program not found'
        });
      }

      await pool.execute(
        `UPDATE programs SET 
         title = COALESCE(?, title),
         description = COALESCE(?, description),
         short_description = COALESCE(?, short_description),
         image_url = COALESCE(?, image_url),
         price = COALESCE(?, price),
         duration = COALESCE(?, duration),
         age_group = COALESCE(?, age_group),
         skill_level = COALESCE(?, skill_level),
         max_participants = COALESCE(?, max_participants),
         is_active = COALESCE(?, is_active),
         updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [title, description, short_description, image_url, price, duration, age_group, skill_level, max_participants, is_active, id]
      );

      const [updatedProgram] = await pool.execute<Program[]>(
        'SELECT * FROM programs WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Program updated successfully',
        data: { program: updatedProgram[0] }
      });
    } catch (error) {
      console.error('Update program error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete program (admin only)
  static async deleteProgram(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Check if program exists
      const [existingPrograms] = await pool.execute<Program[]>(
        'SELECT id FROM programs WHERE id = ?',
        [id]
      );

      if (existingPrograms.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Program not found'
        });
      }

      // Soft delete (set is_active to false)
      await pool.execute(
        'UPDATE programs SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Program deleted successfully'
      });
    } catch (error) {
      console.error('Delete program error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
