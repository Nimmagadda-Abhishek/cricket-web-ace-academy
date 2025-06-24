import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import { protect, createSendToken, signToken, restrictTo } from '../middleware/auth';

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

      // Create new admin
      const newAdmin = await Admin.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
        permissions,
        phone,
        profile: {
          ...profile,
          department: profile?.department || 'administration',
          joinDate: new Date()
        }
      });

      // Log activity
      const user = await Admin.findById(req.user._id);
      if (user) {
        const logEntry = {
          action: 'create_admin',
          resource: 'admin',
          resourceId: newAdmin._id?.toString(),
          timestamp: new Date(),
          ip: req.ip || undefined,
          userAgent: req.get('User-Agent') || undefined
        };
        
        user.activityLog.push(logEntry as any);
        if (user.activityLog.length > 100) {
          user.activityLog = user.activityLog.slice(-100);
        }
        await user.save();
      }

      // Remove password from response
      (newAdmin as any).password = undefined;

      res.status(201).json({
        status: 'success',
        message: 'Admin created successfully',
        data: {
          admin: newAdmin
        }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
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
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });


    }
  }
);

// Login
router.post('/login', async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and password is correct
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return res.status(401).json({
        status: 'fail',
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Verify password
    const isPasswordCorrect = await admin.comparePassword(password);
    
    if (!isPasswordCorrect) {
      // Increment login attempts
      await admin.updateOne({
        $inc: { loginAttempts: 1 },
        ...(admin.loginAttempts + 1 >= 5 ? { $set: { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) } } : {})
      });
      
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    if (admin.loginAttempts > 0) {
      await admin.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Log activity
    const logEntry = {
      action: 'login',
      resource: 'auth',
      timestamp: new Date(),
      ip: req.ip || undefined,
      userAgent: req.get('User-Agent') || undefined
    };
    
    admin.activityLog.push(logEntry as any);
    if (admin.activityLog.length > 100) {
      admin.activityLog = admin.activityLog.slice(-100);
    }
    await admin.save();

    // Create and send token
    createSendToken(admin, 200, res);
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Logout
router.post('/logout', protect, async (req, res) => {
  try {
    // Log activity
    const user = await Admin.findById(req.user._id);
    if (user) {
      const logEntry = {
        action: 'logout',
        resource: 'auth',
        timestamp: new Date(),
        ip: req.ip || undefined,
        userAgent: req.get('User-Agent') || undefined
      };
      
      user.activityLog.push(logEntry as any);
      if (user.activityLog.length > 100) {
        user.activityLog = user.activityLog.slice(-100);
      }
      await user.save();
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

// Get current user
router.get('/me', protect, async (req, res): Promise<any> => {
  try {
    const admin = await Admin.findById(req.user._id);
    
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

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    // Log activity
    const user = await Admin.findById(req.user._id);
    if (user) {
      const logEntry = {
        action: 'update_profile',
        resource: 'admin',
        resourceId: req.user._id?.toString(),
        timestamp: new Date(),
        ip: req.ip || undefined,
        userAgent: req.get('User-Agent') || undefined
      };
      
      user.activityLog.push(logEntry as any);
      if (user.activityLog.length > 100) {
        user.activityLog = user.activityLog.slice(-100);
      }
      await user.save();
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
    const admin = await Admin.findById(req.user._id).select('+password');
    
    if (!admin) {
      return res.status(404).json({
        status: 'fail',
        message: 'Admin not found'
      });
    }

    // Check current password
    const isCurrentPasswordCorrect = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    admin.passwordChangedAt = new Date();
    await admin.save();

    // Log activity
    const logEntry = {
      action: 'change_password',
      resource: 'auth',
      timestamp: new Date(),
      ip: req.ip || undefined,
      userAgent: req.get('User-Agent') || undefined
    };
    
    admin.activityLog.push(logEntry as any);
    if (admin.activityLog.length > 100) {
      admin.activityLog = admin.activityLog.slice(-100);
    }
    await admin.save();

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

    if (!admin.isActive) {
      return res.status(400).json({
        status: 'fail',
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Generate reset token
    const resetToken = admin.createPasswordResetToken();
    await admin.save({ validateBeforeSave: false });

    // In a real application, you would send an email here
    console.log(`Password reset token for ${email}: ${resetToken}`);

    // Log activity
    const logEntry = {
      action: 'request_password_reset',
      resource: 'auth',
      timestamp: new Date(),
      ip: req.ip || undefined,
      userAgent: req.get('User-Agent') || undefined
    };
    
    admin.activityLog.push(logEntry as any);
    if (admin.activityLog.length > 100) {
      admin.activityLog = admin.activityLog.slice(-100);
    }
    await admin.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset instructions sent to your email',
      // In development, include the token (remove in production)
      ...(process.env.NODE_ENV === 'development' && { resetToken })
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
    const admin = await Admin.findOne({
      passwordResetToken: { $exists: true },
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    // Verify token
    const isTokenValid = await bcrypt.compare(token, admin.passwordResetToken!);
    if (!isTokenValid) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    // Update password
    admin.password = password;
    (admin as any).passwordResetToken = undefined;
    (admin as any).passwordResetExpires = undefined;
    admin.passwordChangedAt = new Date();
    await admin.save();

    // Log activity
    const logEntry = {
      action: 'reset_password',
      resource: 'auth',
      timestamp: new Date(),
      ip: req.ip || undefined,
      userAgent: req.get('User-Agent') || undefined
    };
    
    admin.activityLog.push(logEntry as any);
    if (admin.activityLog.length > 100) {
      admin.activityLog = admin.activityLog.slice(-100);
    }
    await admin.save();

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

      const query: any = {};

      if (role && role !== 'all') {
        query.role = role;
      }

      if (isActive !== undefined) {
        query.isActive = isActive === 'true';
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { 'profile.employeeId': { $regex: search, $options: 'i' } }
        ];
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const admins = await Admin.find(query)
        .select('-password -activityLog')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const totalAdmins = await Admin.countDocuments(query);
      const totalPages = Math.ceil(totalAdmins / limitNum);

      res.json({
        status: 'success',
        data: {
          admins,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalAdmins,
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

      const admin = await Admin.findByIdAndUpdate(
        adminId,
        updates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!admin) {
        return res.status(404).json({
          status: 'fail',
          message: 'Admin not found'
        });
      }

      // Log activity
      const user = await Admin.findById(req.user._id);
      if (user) {
        const logEntry = {
          action: 'update_admin',
          resource: 'admin',
          resourceId: adminId,
          timestamp: new Date(),
          ip: req.ip || undefined,
          userAgent: req.get('User-Agent') || undefined
        };
        
        user.activityLog.push(logEntry as any);
        if (user.activityLog.length > 100) {
          user.activityLog = user.activityLog.slice(-100);
        }
        await user.save();
      }

      res.json({
        status: 'success',
        message: 'Admin updated successfully',
        data: { admin }
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
      if (adminId === req.user._id.toString()) {
        return res.status(400).json({
          status: 'fail',
          message: 'You cannot deactivate your own account'
        });
      }

      const admin = await Admin.findByIdAndUpdate(
        adminId,
        { isActive: false },
        { new: true }
      ).select('-password');

      if (!admin) {
        return res.status(404).json({
          status: 'fail',
          message: 'Admin not found'
        });
      }

      // Log activity
      await req.user.logActivity('deactivate_admin', 'admin', adminId, req);

      res.json({
        status: 'success',
        message: 'Admin deactivated successfully',
        data: { admin }
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
    const newToken = signToken(req.user._id);
    
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