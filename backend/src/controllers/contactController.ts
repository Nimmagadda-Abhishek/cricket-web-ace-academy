import { Response } from 'express';
import { pool } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface ContactMessage extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  replied: boolean;
  created_at: Date;
}

export class ContactController {
  // Get all contact messages (admin only)
  static async getMessages(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const unreadOnly = req.query.unread === 'true';

      let query = 'SELECT * FROM contact_messages';
      let countQuery = 'SELECT COUNT(*) as total FROM contact_messages';
      const params: any[] = [];

      if (unreadOnly) {
        query += ' WHERE is_read = false';
        countQuery += ' WHERE is_read = false';
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [messages] = await pool.execute<ContactMessage[]>(query, params);
      const [countResult] = await pool.execute<RowDataPacket[]>(countQuery);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          messages,
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        }
      });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single message (admin only)
  static async getMessage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const [messages] = await pool.execute<ContactMessage[]>(
        'SELECT * FROM contact_messages WHERE id = ?',
        [id]
      );

      const message = messages[0];
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }

      // Mark as read when viewed
      await pool.execute(
        'UPDATE contact_messages SET is_read = true WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        data: { message }
      });
    } catch (error) {
      console.error('Get message error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create contact message (public)
  static async createMessage(req: AuthRequest, res: Response) {
    try {
      const {
        name,
        email,
        phone,
        subject,
        message
      } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and message are required'
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO contact_messages 
         (name, email, phone, subject, message) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, phone, subject, message]
      );

      const [newMessage] = await pool.execute<ContactMessage[]>(
        'SELECT * FROM contact_messages WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Message sent successfully. We will get back to you soon!',
        data: { message: newMessage[0] }
      });
    } catch (error) {
      console.error('Create message error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Mark message as replied (admin only)
  static async markAsReplied(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Check if message exists
      const [existingMessages] = await pool.execute<ContactMessage[]>(
        'SELECT id FROM contact_messages WHERE id = ?',
        [id]
      );

      if (existingMessages.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }

      await pool.execute(
        'UPDATE contact_messages SET replied = true, is_read = true WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Message marked as replied'
      });
    } catch (error) {
      console.error('Mark as replied error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete message (admin only)
  static async deleteMessage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Check if message exists
      const [existingMessages] = await pool.execute<ContactMessage[]>(
        'SELECT id FROM contact_messages WHERE id = ?',
        [id]
      );

      if (existingMessages.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }

      await pool.execute('DELETE FROM contact_messages WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Delete message error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get contact statistics (admin only)
  static async getStats(req: AuthRequest, res: Response) {
    try {
      const [totalResult] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM contact_messages'
      );

      const [unreadResult] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as unread FROM contact_messages WHERE is_read = false'
      );

      const [repliedResult] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as replied FROM contact_messages WHERE replied = true'
      );

      res.json({
        success: true,
        data: {
          total: totalResult[0].total,
          unread: unreadResult[0].unread,
          replied: repliedResult[0].replied,
          pending: totalResult[0].total - repliedResult[0].replied
        }
      });
    } catch (error) {
      console.error('Get contact stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
