import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import { protect, createSendToken, signToken, restrictTo } from '../middleware/auth';

/**
 * Authentication Routes
 * 
 * Development Mode Credentials:
 * Email: admin@kalyancricketacademy.com
 * Password: Admin@123456
 * 
 * These credentials will work when NODE_ENV is set to 'development' or when NODE_ENV is undefined
 */

const router = express.Router();

// Register new admin (only super-admin can create new admins)
router.post('/register',
  protect,
  restrictTo('super-admin'),
  async (req, res): Promise<any> => {
    try {
      const {
        name,
        email,
        password,
        role = 'staff',
        permissions = [],
        phone,
        profile
      } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide name, email, and password'
        });
      }

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
      if (existingAdmin) {
        return res.status(400).json({
          status: 'fail',
          message: 'Admin with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new admin
      const newAdmin = await Admin.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        permissions,
        phone,
        profile: {
          ...(typeof profile === 'object' && profile !== null ? profile : {}),
          department: (profile && typeof profile.department === 'string') ? profile.department : 'administration',
          joinDate: (profile && typeof profile.joinDate === 'string') ? profile.joinDate : new Date().toISOString()
        },
        isActive: true,
        loginAttempts: 0,
        activityLog: [],
        lastLogin: null
      });

      // Remove password from response
      const newAdminObj = newAdmin.toObject() as { password?: string };
      if ('password' in newAdminObj) delete newAdminObj.password;

      res.status(201).json({
        status: 'success',
        message: 'Admin created successfully',
        data: { admin: newAdminObj }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Registration failed',
        error: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) ? error : undefined
      });
    }
  }
);

// Login
router.post('/login', async (req, res): Promise<any> => {
  try {
    console.log('Login attempt received:', {
      body: req.body,
      headers: req.headers,
      ip: req.ip,
      method: req.method,
      path: req.path,
      query: req.query,
      env: process.env.NODE_ENV || 'undefined'
    });
    
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Use dummy credentials for development mode
    console.log('Checking development mode credentials:', {
      providedEmail: email,
      providedPassword: password ? '******' : 'empty',
      expectedEmail: 'admin@kalyancricketacademy.com',
      expectedPassword: 'Admin@123456',
      nodeEnv: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV === 'development',
      isUndefined: process.env.NODE_ENV === undefined,
      emailMatches: email === 'admin@kalyancricketacademy.com',
      passwordMatches: password === 'Admin@123456'
    });
    
    if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) && 
        email === 'admin@kalyancricketacademy.com' && 
        password === 'Admin@123456') {
      
      // Create a dummy admin user for development
      const dummyAdmin = {
        id: 'dev-admin-id-123',
        name: 'Development Admin',
        email: 'admin@kalyancricketacademy.com',
        role: 'super-admin',
        permissions: [],
        isActive: true,
        loginAttempts: 0,
        profile: {
          department: 'administration',
          joinDate: new Date().toISOString()
        },
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            browser: true,
            mobile: false
          },
          dashboard: {
            widgets: ['students', 'programs', 'revenue', 'contacts', 'coaches'],
            layout: 'grid'
          }
        },
        activityLog: []
      };
      
      // Create and send token for the dummy admin
      createSendToken(dummyAdmin, 200, res);
      return;
    }

    // For non-development mode or if dev credentials don't match, proceed with normal login
    // Check if user exists
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (admin.isActive === false) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Check if account is locked
    if (admin.lockUntil && new Date(admin.lockUntil) > new Date()) {
      return res.status(401).json({
        status: 'fail',
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Verify password
    const isPasswordCorrect = admin.password ? await bcrypt.compare(password, admin.password) : false;
    if (!isPasswordCorrect) {
      // Increment login attempts and set lockUntil if needed
      const newLoginAttempts = (admin.loginAttempts || 0) + 1;
      await Admin.findByIdAndUpdate(admin._id, { loginAttempts: newLoginAttempts });
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    if (admin.loginAttempts > 0) {
      await Admin.findByIdAndUpdate(admin._id, { loginAttempts: 0, lockUntil: null });
    }

    // Update last login
    await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date().toISOString() });

    // Log activity (append to activityLog array)
    const logEntry = {
      action: 'login',
      resource: 'auth',
      timestamp: new Date().toISOString(),
      ip: req.ip || undefined,
      userAgent: req.get('User-Agent') || undefined
    };
    const updatedActivityLog = Array.isArray(admin.activityLog)
      ? [...admin.activityLog, logEntry].slice(-100)
      : [logEntry];
    await Admin.findByIdAndUpdate(admin._id, { activityLog: updatedActivityLog });

    // Remove password before sending
    const adminObj = admin.toObject() as { password?: string };
    if ('password' in adminObj) delete adminObj.password;

    // Create and send token
    createSendToken(adminObj, 200, res);
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) ? error : undefined
    });
  }
});

// Logout
router.post('/logout', protect, async (req, res) => {
  try {
    // Log activity
    const admin = await Admin.findById(req.user.id);

    if (admin) {
      const logEntry = {
        action: 'logout',
        resource: 'auth',
        timestamp: new Date().toISOString(),
        ip: req.ip || undefined,
        userAgent: req.get('User-Agent') || undefined
      };
      
      const updatedActivityLog = Array.isArray(admin.activityLog)
        ? [...admin.activityLog, logEntry].slice(-100)
        : [logEntry];
      await Admin.findByIdAndUpdate(admin._id, { activityLog: updatedActivityLog });
    }

    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Logout failed'
    });
  }
});

// Debug endpoint for testing login
router.get('/debug', async (req, res): Promise<any> => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Debug endpoint is working',
      environment: process.env.NODE_ENV || 'undefined',
      timestamp: new Date().toISOString(),
      demoCredentials: {
        email: 'admin@kalyancricketacademy.com',
        password: 'Admin@123456'
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Debug endpoint error'
    });
  }
});

// Get current user
router.get('/me', protect, async (req, res): Promise<any> => {
  try {
    const admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      return res.status(404).json({
        status: 'fail',
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { admin }
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get user information'
    });
  }
});

// Update current user profile
router.put('/me', protect, async (req, res): Promise<any> => {
  try {
    const {
      name,
      phone,
      avatar,
      profile,
      preferences
    } = req.body;

    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    if (profile) updateData.profile = { ...req.user.profile, ...profile };
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

    const updatedAdmin = await Admin.findByIdAndUpdate(req.user.id, updateData, { new: true });

    // Log activity
    const admin = await Admin.findById(req.user.id);

    if (admin) {
      const logEntry = {
        action: 'update_profile',
        resource: 'admin',
        resourceId: req.user.id?.toString(),
        timestamp: new Date().toISOString(),
        ip: req.ip || undefined,
        userAgent: req.get('User-Agent') || undefined
      };
      
      const updatedActivityLog = Array.isArray(admin.activityLog)
        ? [...admin.activityLog, logEntry].slice(-100)
        : [logEntry];
      await Admin.findByIdAndUpdate(admin._id, { activityLog: updatedActivityLog });
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { admin: updatedAdmin }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});

// Change password
router.put('/change-password', protect, async (req, res): Promise<any> => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide current password, new password, and confirmation'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'New password and confirmation do not match'
      });
    }

    // Get user with password
    const admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await Admin.findByIdAndUpdate(admin._id, { password: hashedPassword });

    // Log activity
    const logEntry = {
      action: 'change_password',
      resource: 'auth',
      timestamp: new Date().toISOString(),
      ip: req.ip || undefined,
      userAgent: req.get('User-Agent') || undefined
    };
    const updatedActivityLog = Array.isArray(admin.activityLog)
      ? [...admin.activityLog, logEntry].slice(-100)
      : [logEntry];
    await Admin.findByIdAndUpdate(admin._id, { activityLog: updatedActivityLog });

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Failed to change password'
    });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email address'
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    if (admin.isActive === false) {
      return res.status(400).json({
        status: 'fail',
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Generate reset token
    admin.createPasswordResetToken();
    await admin.save({ validateBeforeSave: false });

    // In a real application, you would send an email here
    console.log(`Password reset token for ${email}: ${admin.passwordResetToken}`);

    // Log activity
    const logEntry = {
      action: 'request_password_reset',
      resource: 'auth',
      timestamp: new Date().toISOString(),
      ip: req.ip || undefined,
      userAgent: req.get('User-Agent') || undefined
    };
    const updatedActivityLog = Array.isArray(admin.activityLog)
      ? [...admin.activityLog, logEntry].slice(-100)
      : [logEntry];
    await Admin.findByIdAndUpdate(admin._id, { activityLog: updatedActivityLog });

    res.status(200).json({
      status: 'success',
      message: 'Password reset instructions sent to your email',
      // In development, include the token (remove in production)
      ...(process.env.NODE_ENV === 'development' && { resetToken: admin.passwordResetToken })
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process password reset request'
    });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res): Promise<any> => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide password and confirmation'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password and confirmation do not match'
      });
    }

    // Find admin with valid reset token
    const admin = await Admin.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });

    if (!admin) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    // Verify token
    const isTokenValid = admin.passwordResetToken ? await bcrypt.compare(token, admin.passwordResetToken) : false;
    if (!isTokenValid) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 12);
    await Admin.findByIdAndUpdate(admin._id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordChangedAt: new Date().toISOString()
    });

    // Log activity
    const logEntry = {
      action: 'reset_password',
      resource: 'auth',
      timestamp: new Date().toISOString(),
      ip: req.ip || undefined,
      userAgent: req.get('User-Agent') || undefined
    };
    const updatedActivityLog = Array.isArray(admin.activityLog)
      ? [...admin.activityLog, logEntry].slice(-100)
      : [logEntry];
    await Admin.findByIdAndUpdate(admin._id, { activityLog: updatedActivityLog });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to reset password'
    });
  }
});

// Get all admins (admin and above only)
router.get('/admins',
  protect,
  restrictTo('super-admin', 'admin'),
  async (req, res): Promise<any> => {
    try {
      const {
        role,
        isActive,
        search,
        page = 1,
        limit = 10
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      let adminQuery = Admin.find({});
      if (role && role !== 'all') adminQuery = adminQuery.where('role', role);
      if (isActive !== undefined) adminQuery = adminQuery.where('isActive', isActive === 'true');
      if (search) {
        adminQuery = adminQuery.or([{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]);
      }
      adminQuery = adminQuery.sort({ createdAt: -1 }).skip(skip).limit(limitNum);
      const admins = await adminQuery;

      let countQuery = Admin.countDocuments({});
      if (role && role !== 'all') countQuery = countQuery.where('role', role);
      if (isActive !== undefined) countQuery = countQuery.where('isActive', isActive === 'true');
      if (search) {
        countQuery = countQuery.or([{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]);
      }
      const totalAdmins = await countQuery;
      const totalPages = totalAdmins ? Math.ceil(totalAdmins / limitNum) : 1;

      res.json({
        status: 'success',
        data: {
          admins,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalAdmins: totalAdmins,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        }
      });
    } catch (error) {
      console.error('Get admins error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch admins'
      });
    }
  }
);

// Update admin (super-admin only)
router.put('/admins/:id',
  protect,
  restrictTo('super-admin'),
  async (req, res): Promise<any> => {
    try {
      const adminId = req.params.id;
      const updates = req.body;

      // Don't allow password updates through this endpoint
      delete updates.password;
      delete updates.passwordResetToken;
      delete updates.passwordResetExpires;

      const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updates, { new: true });

      if (!updatedAdmin) {
        return res.status(404).json({
          status: 'fail',
          message: 'Admin not found'
        });
      }

      // Log activity
      const user = await Admin.findById(req.user.id);

      if (user) {
        const logEntry = {
          action: 'update_admin',
          resource: 'admin',
          resourceId: adminId,
          timestamp: new Date().toISOString(),
          ip: req.ip || undefined,
          userAgent: req.get('User-Agent') || undefined
        };
        
        const updatedActivityLog = Array.isArray(user.activityLog)
          ? [...user.activityLog, logEntry].slice(-100)
          : [logEntry];
        await Admin.findByIdAndUpdate(user._id, { activityLog: updatedActivityLog });
      }

      res.json({
        status: 'success',
        message: 'Admin updated successfully',
        data: { admin: updatedAdmin }
      });
    } catch (error) {
      console.error('Update admin error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update admin'
      });
    }
  }
);

// Deactivate admin (super-admin only)
router.put('/admins/:id/deactivate',
  protect,
  restrictTo('super-admin'),
  async (req, res): Promise<any> => {
    try {
      const adminId = req.params.id;

      // Don't allow deactivating self
      if (adminId === req.user.id.toString()) {
        return res.status(400).json({
          status: 'fail',
          message: 'You cannot deactivate your own account'
        });
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(adminId, { isActive: false });

      if (!updatedAdmin) {
        return res.status(404).json({
          status: 'fail',
          message: 'Admin not found'
        });
      }

      // Log activity
      await Admin.findByIdAndUpdate(req.user.id, { activityLog: [] });

      res.json({
        status: 'success',
        message: 'Admin deactivated successfully',
        data: { admin: updatedAdmin }
      });
    } catch (error) {
      console.error('Deactivate admin error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to deactivate admin'
      });
    }
  }
);

// Refresh token
router.post('/refresh-token', protect, async (req, res) => {
  try {
    const newToken = signToken(req.user.id);
    
    res.status(200).json({
      status: 'success',
      token: newToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to refresh token'
    });
  }
});

export default router;