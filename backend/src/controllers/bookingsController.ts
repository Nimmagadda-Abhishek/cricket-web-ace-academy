import { Response } from 'express';
import { pool } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Booking extends RowDataPacket {
  id: number;
  student_id: number;
  program_id: number;
  coach_id: number;
  booking_date: Date;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  created_at: Date;
  updated_at: Date;
  // Joined data
  student_name?: string;
  program_title?: string;
  coach_name?: string;
}

export class BookingsController {
  // Get all bookings (admin only)
  static async getBookings(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const status = req.query.status as string;
      const date = req.query.date as string;

      let query = `
        SELECT b.*, 
               s.name as student_name,
               p.title as program_title,
               c.name as coach_name
        FROM bookings b
        LEFT JOIN students s ON b.student_id = s.id
        LEFT JOIN programs p ON b.program_id = p.id
        LEFT JOIN coaches c ON b.coach_id = c.id
      `;
      
      let countQuery = 'SELECT COUNT(*) as total FROM bookings';
      const params: any[] = [];
      const whereConditions: string[] = [];

      if (status) {
        whereConditions.push('b.status = ?');
        params.push(status);
      }

      if (date) {
        whereConditions.push('DATE(b.booking_date) = ?');
        params.push(date);
      }

      if (whereConditions.length > 0) {
        const whereClause = ' WHERE ' + whereConditions.join(' AND ');
        query += whereClause;
        countQuery += whereClause.replace('b.', '');
      }

      query += ' ORDER BY b.booking_date DESC, b.start_time ASC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [bookings] = await pool.execute<Booking[]>(query, params);
      const countParams = status || date ? params.slice(0, -2) : [];
      const [countResult] = await pool.execute<RowDataPacket[]>(countQuery, countParams);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          bookings,
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        }
      });
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single booking
  static async getBooking(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const [bookings] = await pool.execute<Booking[]>(
        `SELECT b.*, 
                s.name as student_name,
                p.title as program_title,
                c.name as coach_name
         FROM bookings b
         LEFT JOIN students s ON b.student_id = s.id
         LEFT JOIN programs p ON b.program_id = p.id
         LEFT JOIN coaches c ON b.coach_id = c.id
         WHERE b.id = ?`,
        [id]
      );

      const booking = bookings[0];
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: { booking }
      });
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create booking (public)
  static async createBooking(req: AuthRequest, res: Response) {
    try {
      const {
        student_id,
        program_id,
        coach_id,
        booking_date,
        start_time,
        end_time,
        notes
      } = req.body;

      if (!student_id || !program_id || !booking_date || !start_time || !end_time) {
        return res.status(400).json({
          success: false,
          message: 'Student, program, date, and time are required'
        });
      }

      // Check for conflicts
      const [conflicts] = await pool.execute<Booking[]>(
        `SELECT id FROM bookings 
         WHERE coach_id = ? AND booking_date = ? 
         AND status IN ('pending', 'confirmed')
         AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))`,
        [coach_id, booking_date, start_time, start_time, end_time, end_time]
      );

      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Time slot is already booked'
        });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO bookings 
         (student_id, program_id, coach_id, booking_date, start_time, end_time, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [student_id, program_id, coach_id, booking_date, start_time, end_time, notes]
      );

      const [newBooking] = await pool.execute<Booking[]>(
        `SELECT b.*, 
                s.name as student_name,
                p.title as program_title,
                c.name as coach_name
         FROM bookings b
         LEFT JOIN students s ON b.student_id = s.id
         LEFT JOIN programs p ON b.program_id = p.id
         LEFT JOIN coaches c ON b.coach_id = c.id
         WHERE b.id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: { booking: newBooking[0] }
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update booking status (admin only)
  static async updateBooking(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      // Check if booking exists
      const [existingBookings] = await pool.execute<Booking[]>(
        'SELECT id FROM bookings WHERE id = ?',
        [id]
      );

      if (existingBookings.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await pool.execute(
        `UPDATE bookings SET 
         status = COALESCE(?, status),
         notes = COALESCE(?, notes),
         updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [status, notes, id]
      );

      const [updatedBooking] = await pool.execute<Booking[]>(
        `SELECT b.*, 
                s.name as student_name,
                p.title as program_title,
                c.name as coach_name
         FROM bookings b
         LEFT JOIN students s ON b.student_id = s.id
         LEFT JOIN programs p ON b.program_id = p.id
         LEFT JOIN coaches c ON b.coach_id = c.id
         WHERE b.id = ?`,
        [id]
      );

      res.json({
        success: true,
        message: 'Booking updated successfully',
        data: { booking: updatedBooking[0] }
      });
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Cancel booking (admin or public with restrictions)
  static async cancelBooking(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Check if booking exists
      const [existingBookings] = await pool.execute<Booking[]>(
        'SELECT status FROM bookings WHERE id = ?',
        [id]
      );

      if (existingBookings.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const booking = existingBookings[0];
      if (booking.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel completed booking'
        });
      }

      await pool.execute(
        'UPDATE bookings SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Booking cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get available time slots for a coach on a date
  static async getAvailableSlots(req: AuthRequest, res: Response) {
    try {
      const { coach_id, date } = req.query;

      if (!coach_id || !date) {
        return res.status(400).json({
          success: false,
          message: 'Coach ID and date are required'
        });
      }

      // Get booked slots for the coach on the specified date
      const [bookedSlots] = await pool.execute<Booking[]>(
        `SELECT start_time, end_time 
         FROM bookings 
         WHERE coach_id = ? AND booking_date = ? 
         AND status IN ('pending', 'confirmed')`,
        [coach_id, date]
      );

      // Generate available slots (9 AM to 6 PM, 1-hour slots)
      const allSlots = [];
      for (let hour = 9; hour < 18; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
        allSlots.push({ start_time: startTime, end_time: endTime });
      }

      // Filter out booked slots
      const availableSlots = allSlots.filter(slot => {
        return !bookedSlots.some(bookedSlot => 
          slot.start_time === bookedSlot.start_time
        );
      });

      res.json({
        success: true,
        data: { availableSlots }
      });
    } catch (error) {
      console.error('Get available slots error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
