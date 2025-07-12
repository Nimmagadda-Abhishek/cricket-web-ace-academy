import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

// Define a type for the document instance
interface IAdminDocument extends Document {
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
  isNew: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  isLocked(): boolean;
}

// Define the interface for the model's static methods
interface IAdminModel extends Model<IAdminDocument> {
  findByRole(role: string): Promise<IAdminDocument[]>;
  findActive(): Promise<IAdminDocument[]>;
  findRecentlyActive(days?: number): Promise<IAdminDocument[]>;
}

// Export the combined interface
export interface IAdmin extends IAdminDocument {}

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
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].*$/.test(password);
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
        return !v || /^[\+]?[1-9][\d\-\s]{0,20}$/.test(v); // International phone format with optional hyphens and spaces
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
AdminSchema.index({ role: 1 });
AdminSchema.index({ isActive: 1 });
AdminSchema.index({ lastLogin: -1 });

// Virtual for account locked status
AdminSchema.virtual('accountLocked').get(function(this: IAdminDocument) {
  return !!(this.lockUntil && new Date(this.lockUntil as Date) > new Date());
});

// Virtual for full permissions based on role
AdminSchema.virtual('fullPermissions').get(function(this: IAdminDocument) {
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

  const role = this.role as 'super-admin' | 'admin' | 'manager' | 'staff';
  const basePermissions = rolePermissions[role] || [];
  const userPermissions = this.permissions as string[] || [];
  return [...new Set([...basePermissions, ...userPermissions])];
});

// Pre-save middleware for password hashing
AdminSchema.pre('save', async function(this: IAdminDocument, next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  const password = this.password as string;
  this.password = await bcrypt.hash(password, 12);

  // Update passwordChangedAt
  this.passwordChangedAt = new Date();

  next();
});

// Pre-save middleware for setting default dashboard widgets
AdminSchema.pre('save', function(this: IAdminDocument, next) {
  const preferences = this.preferences as any;
  if (this.isNew && (!preferences?.dashboard?.widgets || !preferences?.dashboard?.widgets.length)) {
    // Set default widgets based on role
    const role = this.role as string;
    if (!preferences) {
      (this as any).preferences = {
        dashboard: { widgets: [] }
      };
    } else if (!preferences.dashboard) {
      preferences.dashboard = { widgets: [] };
    }
    
    switch (role) {
      case 'super-admin':
      case 'admin':
        preferences.dashboard.widgets = ['students', 'programs', 'revenue', 'contacts', 'coaches'];
        break;
      case 'manager':
        preferences.dashboard.widgets = ['students', 'programs', 'revenue', 'contacts'];
        break;
      case 'staff':
        preferences.dashboard.widgets = ['students', 'programs', 'contacts'];
        break;
    }
  }
  next();
});

// Instance methods
AdminSchema.methods.comparePassword = async function(this: IAdminDocument, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

AdminSchema.methods.createPasswordResetToken = function(this: IAdminDocument): string {
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  this.passwordResetToken = bcrypt.hashSync(resetToken, 10);
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

AdminSchema.methods.changedPasswordAfter = function(this: IAdminDocument, JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(((this.passwordChangedAt as Date).getTime() / 1000).toString(), 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

AdminSchema.methods.isLocked = function(this: IAdminDocument): boolean {
  return !!(this.lockUntil && new Date(this.lockUntil as Date) > new Date());
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

export default mongoose.model<IAdminDocument, IAdminModel>('Admin', AdminSchema);