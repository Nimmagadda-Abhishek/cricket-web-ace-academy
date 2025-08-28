import { Response } from 'express';
import { pool } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Testimonial extends RowDataPacket {
  id: number;
  student_name: string;
  parent_name: string;
  content: string;
  rating: number;
  image_url: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export class TestimonialsController {
  // Get all testimonials (public - approved only, admin - all)
  static async getTestimonials(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const featured = req.query.featured === 'true';
      const isAdmin = req.user?.role === 'admin' || req.user?.role === 'super_admin';

      let query = 'SELECT * FROM testimonials';
      let countQuery = 'SELECT COUNT(*) as total FROM testimonials';
      const params: any[] = [];
      const whereConditions: string[] = [];

      // Non-admin users only see approved testimonials
      if (!isAdmin) {
        whereConditions.push('is_approved = true');
      }

      if (featured) {
        whereConditions.push('is_featured = true');
      }

      if (whereConditions.length > 0) {
        const whereClause = ' WHERE ' + whereConditions.join(' AND ');
        query += whereClause;
        countQuery += whereClause;
      }

      query += ' ORDER BY is_featured DESC, created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [testimonials] = await pool.execute<Testimonial[]>(query, params);
      const [countResult] = await pool.execute<RowDataPacket[]>(countQuery);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          testimonials,
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        }
      });
    } catch (error) {
      console.error('Get testimonials error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create testimonial (public)
  static async createTestimonial(req: AuthRequest, res: Response) {
    try {
      const {
        student_name,
        parent_name,
        content,
        rating,
        image_url
      } = req.body;

      if (!student_name || !content || !rating) {
        return res.status(400).json({
          success: false,
          message: 'Student name, content, and rating are required'
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO testimonials 
         (student_name, parent_name, content, rating, image_url) 
         VALUES (?, ?, ?, ?, ?)`,
        [student_name, parent_name, content, rating, image_url]
      );

      const [newTestimonial] = await pool.execute<Testimonial[]>(
        'SELECT * FROM testimonials WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Testimonial submitted successfully and is pending approval',
        data: { testimonial: newTestimonial[0] }
      });
    } catch (error) {
      console.error('Create testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update testimonial (admin only)
  static async updateTestimonial(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        student_name,
        parent_name,
        content,
        rating,
        image_url,
        is_approved,
        is_featured
      } = req.body;

      // Check if testimonial exists
      const [existingTestimonials] = await pool.execute<Testimonial[]>(
        'SELECT id FROM testimonials WHERE id = ?',
        [id]
      );

      if (existingTestimonials.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      await pool.execute(
        `UPDATE testimonials SET 
         student_name = COALESCE(?, student_name),
         parent_name = COALESCE(?, parent_name),
         content = COALESCE(?, content),
         rating = COALESCE(?, rating),
         image_url = COALESCE(?, image_url),
         is_approved = COALESCE(?, is_approved),
         is_featured = COALESCE(?, is_featured),
         updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [student_name, parent_name, content, rating, image_url, is_approved, is_featured, id]
      );

      const [updatedTestimonial] = await pool.execute<Testimonial[]>(
        'SELECT * FROM testimonials WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Testimonial updated successfully',
        data: { testimonial: updatedTestimonial[0] }
      });
    } catch (error) {
      console.error('Update testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete testimonial (admin only)
  static async deleteTestimonial(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Check if testimonial exists
      const [existingTestimonials] = await pool.execute<Testimonial[]>(
        'SELECT id FROM testimonials WHERE id = ?',
        [id]
      );

      if (existingTestimonials.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      await pool.execute('DELETE FROM testimonials WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Testimonial deleted successfully'
      });
    } catch (error) {
      console.error('Delete testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
