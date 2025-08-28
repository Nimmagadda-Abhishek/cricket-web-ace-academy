import { Response } from 'express';
import { pool } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Student extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: Date;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  medical_conditions: string;
  created_at: Date;
  updated_at: Date;
}

export class StudentsController {
  // Get all students (admin only)
  static async getStudents(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search as string;

      let query = 'SELECT * FROM students';
      let countQuery = 'SELECT COUNT(*) as total FROM students';
      const params: any[] = [];

      if (search) {
        query += ' WHERE name LIKE ? OR email LIKE ? OR parent_name LIKE ?';
        countQuery += ' WHERE name LIKE ? OR email LIKE ? OR parent_name LIKE ?';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      const finalParams = search ? [...params, limit, offset] : [limit, offset];

      const [students] = await pool.execute<Student[]>(query, finalParams);
      const [countResult] = await pool.execute<RowDataPacket[]>(countQuery, search ? params : []);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          students,
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        }
      });
    } catch (error) {
      console.error('Get students error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single student (admin only)
  static async getStudent(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const [students] = await pool.execute<Student[]>(
        'SELECT * FROM students WHERE id = ?',
        [id]
      );

      const student = students[0];
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      res.json({
        success: true,
        data: { student }
      });
    } catch (error) {
      console.error('Get student error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create student (public registration)
  static async createStudent(req: AuthRequest, res: Response) {
    try {
      const {
        name,
        email,
        phone,
        date_of_birth,
        parent_name,
        parent_phone,
        parent_email,
        address,
        emergency_contact,
        emergency_phone,
        medical_conditions
      } = req.body;

      if (!name || !parent_name || !parent_phone) {
        return res.status(400).json({
          success: false,
          message: 'Student name, parent name, and parent phone are required'
        });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO students 
         (name, email, phone, date_of_birth, parent_name, parent_phone, parent_email, 
          address, emergency_contact, emergency_phone, medical_conditions) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, phone, date_of_birth, parent_name, parent_phone, parent_email, 
         address, emergency_contact, emergency_phone, medical_conditions]
      );

      const [newStudent] = await pool.execute<Student[]>(
        'SELECT * FROM students WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: { student: newStudent[0] }
      });
    } catch (error) {
      console.error('Create student error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update student (admin only)
  static async updateStudent(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        phone,
        date_of_birth,
        parent_name,
        parent_phone,
        parent_email,
        address,
        emergency_contact,
        emergency_phone,
        medical_conditions
      } = req.body;

      // Check if student exists
      const [existingStudents] = await pool.execute<Student[]>(
        'SELECT id FROM students WHERE id = ?',
        [id]
      );

      if (existingStudents.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      await pool.execute(
        `UPDATE students SET 
         name = COALESCE(?, name),
         email = COALESCE(?, email),
         phone = COALESCE(?, phone),
         date_of_birth = COALESCE(?, date_of_birth),
         parent_name = COALESCE(?, parent_name),
         parent_phone = COALESCE(?, parent_phone),
         parent_email = COALESCE(?, parent_email),
         address = COALESCE(?, address),
         emergency_contact = COALESCE(?, emergency_contact),
         emergency_phone = COALESCE(?, emergency_phone),
         medical_conditions = COALESCE(?, medical_conditions),
         updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [name, email, phone, date_of_birth, parent_name, parent_phone, parent_email,
         address, emergency_contact, emergency_phone, medical_conditions, id]
      );

      const [updatedStudent] = await pool.execute<Student[]>(
        'SELECT * FROM students WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Student updated successfully',
        data: { student: updatedStudent[0] }
      });
    } catch (error) {
      console.error('Update student error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete student (admin only)
  static async deleteStudent(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Check if student exists
      const [existingStudents] = await pool.execute<Student[]>(
        'SELECT id FROM students WHERE id = ?',
        [id]
      );

      if (existingStudents.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      await pool.execute('DELETE FROM students WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Student deleted successfully'
      });
    } catch (error) {
      console.error('Delete student error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
