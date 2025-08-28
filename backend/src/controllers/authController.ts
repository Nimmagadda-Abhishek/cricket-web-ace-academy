import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { AuthRequest } from '../middleware/auth.js';
import { RowDataPacket } from 'mysql2';

interface AdminUser extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'super_admin' | 'admin';
  is_active: boolean;
}

export class AuthController {
  // Login
  static async login(req: AuthRequest, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // Find user
      const [rows] = await pool.execute<AdminUser[]>(
        'SELECT * FROM admin_users WHERE username = ? AND is_active = true',
        [username]
      );

      const user = rows[0];
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate tokens
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      const accessToken = generateToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get current user profile
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const [rows] = await pool.execute<AdminUser[]>(
        'SELECT id, username, email, role, created_at FROM admin_users WHERE id = ? AND is_active = true',
        [req.user.id]
      );

      const user = rows[0];
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Change password
  static async changePassword(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 8 characters long'
        });
      }

      // Get current user
      const [rows] = await pool.execute<AdminUser[]>(
        'SELECT password_hash FROM admin_users WHERE id = ? AND is_active = true',
        [req.user.id]
      );

      const user = rows[0];
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await pool.execute(
        'UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newPasswordHash, req.user.id]
      );

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new admin user (super admin only)
  static async createAdmin(req: AuthRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Only super admins can create new admin users'
        });
      }

      const { username, email, password, role = 'admin' } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required'
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Check if username or email already exists
      const [existingUsers] = await pool.execute<AdminUser[]>(
        'SELECT id FROM admin_users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Username or email already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const [result] = await pool.execute(
        'INSERT INTO admin_users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, passwordHash, role]
      );

      res.status(201).json({
        success: true,
        message: 'Admin user created successfully',
        data: {
          id: (result as any).insertId,
          username,
          email,
          role
        }
      });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
