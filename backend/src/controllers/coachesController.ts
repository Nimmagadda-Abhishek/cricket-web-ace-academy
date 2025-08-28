import { Response } from 'express';
import { pool } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Coach extends RowDataPacket {
  id: number;
  name: string;
  bio: string;
  specialization: string;
  experience_years: number;
  image_url: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class CoachesController {
  // Get all coaches (public)
  static async getCoaches(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const isActive = req.query.active !== 'false';

      let query = 'SELECT * FROM coaches';
      let countQuery = 'SELECT COUNT(*) as total FROM coaches';
      const params: any[] = [];

      if (isActive) {
        query += ' WHERE is_active = true';
        countQuery += ' WHERE is_active = true';
      }

      query += ' ORDER BY experience_years DESC, name ASC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [coaches] = await pool.execute<Coach[]>(query, params);
      const [countResult] = await pool.execute<RowDataPacket[]>(countQuery);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          coaches,
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        }
      });
    } catch (error) {
      console.error('Get coaches error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single coach (public)
  static async getCoach(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const [coaches] = await pool.execute<Coach[]>(
        'SELECT * FROM coaches WHERE id = ? AND is_active = true',
        [id]
      );

      const coach = coaches[0];
      if (!coach) {
        return res.status(404).json({
          success: false,
          message: 'Coach not found'
        });
      }

      res.json({
        success: true,
        data: { coach }
      });
    } catch (error) {
      console.error('Get coach error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create coach (admin only)
  static async createCoach(req: AuthRequest, res: Response) {
    try {
      const {
        name,
        bio,
        specialization,
        experience_years,
        image_url,
        phone,
        email
      } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Coach name is required'
        });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO coaches 
         (name, bio, specialization, experience_years, image_url, phone, email) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, bio, specialization, experience_years, image_url, phone, email]
      );

      const [newCoach] = await pool.execute<Coach[]>(
        'SELECT * FROM coaches WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Coach created successfully',
        data: { coach: newCoach[0] }
      });
    } catch (error) {
      console.error('Create coach error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update coach (admin only)
  static async updateCoach(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        name,
        bio,
        specialization,
        experience_years,
        image_url,
        phone,
        email,
        is_active
      } = req.body;

      // Check if coach exists
      const [existingCoaches] = await pool.execute<Coach[]>(
        'SELECT id FROM coaches WHERE id = ?',
        [id]
      );

      if (existingCoaches.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Coach not found'
        });
      }

      await pool.execute(
        `UPDATE coaches SET 
         name = COALESCE(?, name),
         bio = COALESCE(?, bio),
         specialization = COALESCE(?, specialization),
         experience_years = COALESCE(?, experience_years),
         image_url = COALESCE(?, image_url),
         phone = COALESCE(?, phone),
         email = COALESCE(?, email),
         is_active = COALESCE(?, is_active),
         updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [name, bio, specialization, experience_years, image_url, phone, email, is_active, id]
      );

      const [updatedCoach] = await pool.execute<Coach[]>(
        'SELECT * FROM coaches WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Coach updated successfully',
        data: { coach: updatedCoach[0] }
      });
    } catch (error) {
      console.error('Update coach error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete coach (admin only)
  static async deleteCoach(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Check if coach exists
      const [existingCoaches] = await pool.execute<Coach[]>(
        'SELECT id FROM coaches WHERE id = ?',
        [id]
      );

      if (existingCoaches.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Coach not found'
        });
      }

      // Soft delete
      await pool.execute(
        'UPDATE coaches SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Coach deleted successfully'
      });
    } catch (error) {
      console.error('Delete coach error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
