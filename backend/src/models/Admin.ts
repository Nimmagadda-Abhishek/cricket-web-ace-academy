import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: 'super-admin' | 'admin' | 'manager' | 'staff';
  permissions: string[];
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  passwordChangedAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  twoFactorAuth?: {
    enabled: boolean;
    secret?: string;
    backupCodes?: string[];
  };
  profile: {
    department?: string;
    employeeId?: string;
    joinDate: Date;
    bio?: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    language: 'en' | 'hi';
    notifications: {
      email: boolean;
      browser: boolean;
      mobile: boolean;
    };
    dashboard: {
      widgets: string[];
      layout: 'grid' | 'list';
    };
  };
  activityLog: {
    action: string;
    resource?: string;
    resourceId?: string;
    timestamp: Date;
    ip?: string;
    userAgent?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  isLocked(): boolean;
}

const AdminSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Don't include password in queries by default
    validate: {
      validator: function(password: string) {
        // Password must contain at least one uppercase, lowercase, number, and special character
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
      },
      message: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character'
    }
  },

  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['super-admin', 'admin', 'manager', 'staff'],
      message: 'Role must be super-admin, admin, manager, or staff'
    },
    default: 'staff'
  },

  permissions: [{
    type: String,
    enum: [
      // Student management
      'students.view',
      'students.create',
      'students.edit',
      'students.delete',
      'students.export',
      
      // Program management
      'programs.view',
      'programs.create',
      'programs.edit',
      'programs.delete',
      
      // Coach management
      'coaches.view',
      'coaches.create',
      'coaches.edit',
      'coaches.delete',
      
      // Contact management
      'contacts.view',
      'contacts.respond',
      'contacts.assign',
      'contacts.delete',
      
      // Financial
      'finance.view',
      'finance.reports',
      'finance.export',
      
      // Settings
      'settings.view',
      'settings.edit',
      
      // User management
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      
      // System
      'system.logs',
      'system.backup',
      'system.maintenance'
    ]
  }],

  avatar: {
    type: String,
    validate: {
      validator: function(url: string) {
        return !url || validator.isURL(url);
      },
      message: 'Please provide a valid avatar URL'
    }
  },

  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },

  isActive: {
    type: Boolean,
    default: true
  },

  lastLogin: {
    type: Date
  },

  loginAttempts: {
    type: Number,
    default: 0
  },

  lockUntil: {
    type: Date
  },

  passwordChangedAt: {
    type: Date,
    default: Date.now
  },

  passwordResetToken: String,

  passwordResetExpires: Date,

  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false
    },
    secret: String,
    backupCodes: [String]
  },

  profile: {
    department: {
      type: String,
      enum: ['administration', 'coaching', 'finance', 'marketing', 'operations'],
      trim: true
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    }
  },

  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      browser: {
        type: Boolean,
        default: true
      },
      mobile: {
        type: Boolean,
        default: false
      }
    },
    dashboard: {
      widgets: [{
        type: String,
        enum: ['students', 'programs', 'revenue', 'contacts', 'coaches', 'performance']
      }],
      layout: {
        type: String,
        enum: ['grid', 'list'],
        default: 'grid'
      }
    }
  },

  activityLog: [{
    action: {
      type: String,
      required: true,
      trim: true
    },
    resource: {
      type: String,
      trim: true
    },
    resourceId: {
      type: String,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ip: String,
    userAgent: String
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1 });
AdminSchema.index({ isActive: 1 });
AdminSchema.index({ lastLogin: -1 });
AdminSchema.index({ 'profile.employeeId': 1 });

// Virtual for account locked status
AdminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for full permissions based on role
AdminSchema.virtual('fullPermissions').get(function() {
  const rolePermissions: { [key: string]: string[] } = {
    'super-admin': [
      'students.view', 'students.create', 'students.edit', 'students.delete', 'students.export',
      'programs.view', 'programs.create', 'programs.edit', 'programs.delete',
      'coaches.view', 'coaches.create', 'coaches.edit', 'coaches.delete',
      'contacts.view', 'contacts.respond', 'contacts.assign', 'contacts.delete',
      'finance.view', 'finance.reports', 'finance.export',
      'settings.view', 'settings.edit',
      'users.view', 'users.create', 'users.edit', 'users.delete',
      'system.logs', 'system.backup', 'system.maintenance'
    ],
    'admin': [
      'students.view', 'students.create', 'students.edit', 'students.delete', 'students.export',
      'programs.view', 'programs.create', 'programs.edit', 'programs.delete',
      'coaches.view', 'coaches.create', 'coaches.edit', 'coaches.delete',
      'contacts.view', 'contacts.respond', 'contacts.assign',
      'finance.view', 'finance.reports',
      'settings.view'
    ],
    'manager': [
      'students.view', 'students.create', 'students.edit', 'students.export',
      'programs.view', 'programs.edit',
      'coaches.view', 'coaches.edit',
      'contacts.view', 'contacts.respond',
      'finance.view'
    ],
    'staff': [
      'students.view', 'students.create', 'students.edit',
      'programs.view',
      'coaches.view',
      'contacts.view', 'contacts.respond'
    ]
  };

  const basePermissions = rolePermissions[this.role] || [];
  return [...new Set([...basePermissions, ...this.permissions])];
});

// Pre-save middleware for password hashing
AdminSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Update passwordChangedAt
  this.passwordChangedAt = new Date();

  next();
});

// Pre-save middleware for setting default dashboard widgets
AdminSchema.pre('save', function(next) {
  if (this.isNew && !this.preferences.dashboard.widgets.length) {
    // Set default widgets based on role
    switch (this.role) {
      case 'super-admin':
      case 'admin':
        this.preferences.dashboard.widgets = ['students', 'programs', 'revenue', 'contacts', 'coaches'];
        break;
      case 'manager':
        this.preferences.dashboard.widgets = ['students', 'programs', 'revenue', 'contacts'];
        break;
      case 'staff':
        this.preferences.dashboard.widgets = ['students', 'programs', 'contacts'];
        break;
    }
  }
  next();
});

// Instance methods
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

AdminSchema.methods.createPasswordResetToken = function(): string {
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  this.passwordResetToken = bcrypt.hashSync(resetToken, 10);
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

AdminSchema.methods.changedPasswordAfter = function(JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

AdminSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

AdminSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

AdminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

AdminSchema.methods.hasPermission = function(permission: string): boolean {
  return this.fullPermissions.includes(permission);
};

AdminSchema.methods.logActivity = function(action: string, resource?: string, resourceId?: string, req?: any) {
  const logEntry = {
    action,
    resource,
    resourceId,
    timestamp: new Date(),
    ip: req?.ip,
    userAgent: req?.get('User-Agent')
  };
  
  this.activityLog.push(logEntry);
  
  // Keep only last 100 activities
  if (this.activityLog.length > 100) {
    this.activityLog = this.activityLog.slice(-100);
  }
  
  return this.save();
};

AdminSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static methods
AdminSchema.statics.findByRole = function(role: string) {
  return this.find({ role, isActive: true });
};

AdminSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

AdminSchema.statics.findRecentlyActive = function(days = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    isActive: true,
    lastLogin: { $gte: cutoffDate }
  });
};

export default mongoose.model<IAdmin>('Admin', AdminSchema);