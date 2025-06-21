import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: 'inquiry' | 'enrollment' | 'complaint' | 'suggestion' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: mongoose.Types.ObjectId; // Admin who is handling this
  responses: {
    from: mongoose.Types.ObjectId;
    message: string;
    date: Date;
    isInternal: boolean; // Internal note vs response to contact
  }[];
  source: 'website' | 'phone' | 'email' | 'walk-in' | 'social-media';
  followUpDate?: Date;
  tags: string[];
  attachments?: string[];
  contactPreference: 'email' | 'phone' | 'both';
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema({
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
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },

  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },

  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    minlength: [5, 'Subject must be at least 5 characters long'],
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },

  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['inquiry', 'enrollment', 'complaint', 'suggestion', 'other'],
      message: 'Category must be inquiry, enrollment, complaint, suggestion, or other'
    },
    default: 'inquiry'
  },

  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Priority must be low, medium, high, or urgent'
    },
    default: 'medium'
  },

  status: {
    type: String,
    enum: {
      values: ['new', 'in-progress', 'resolved', 'closed'],
      message: 'Status must be new, in-progress, resolved, or closed'
    },
    default: 'new'
  },

  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  },

  responses: [{
    from: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    message: {
      type: String,
      required: [true, 'Response message is required'],
      trim: true,
      minlength: [1, 'Response message cannot be empty'],
      maxlength: [2000, 'Response message cannot exceed 2000 characters']
    },
    date: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],

  source: {
    type: String,
    enum: {
      values: ['website', 'phone', 'email', 'walk-in', 'social-media'],
      message: 'Source must be website, phone, email, walk-in, or social-media'
    },
    default: 'website'
  },

  followUpDate: {
    type: Date,
    validate: {
      validator: function(date: Date) {
        return !date || date >= new Date();
      },
      message: 'Follow-up date cannot be in the past'
    }
  },

  tags: [{
    type: String,
    trim: true,
    minlength: [2, 'Tag must be at least 2 characters long'],
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],

  attachments: [{
    type: String,
    validate: {
      validator: function(url: string) {
        return validator.isURL(url);
      },
      message: 'Please provide a valid attachment URL'
    }
  }],

  contactPreference: {
    type: String,
    enum: {
      values: ['email', 'phone', 'both'],
      message: 'Contact preference must be email, phone, or both'
    },
    default: 'both'
  },

  isRead: {
    type: Boolean,
    default: false
  },

  isArchived: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
ContactSchema.index({ email: 1 });
ContactSchema.index({ category: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ priority: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ assignedTo: 1 });
ContactSchema.index({ isRead: 1 });
ContactSchema.index({ isArchived: 1 });
ContactSchema.index({ subject: 'text', message: 'text' });

// Virtual for response count
ContactSchema.virtual('responseCount').get(function() {
  return this.responses ? this.responses.length : 0;
});

// Virtual for age (time since created)
ContactSchema.virtual('age').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is overdue
ContactSchema.virtual('isOverdue').get(function() {
  if (!this.followUpDate) return false;
  return new Date() > new Date(this.followUpDate);
});

// Virtual for last response
ContactSchema.virtual('lastResponse').get(function() {
  if (!this.responses || this.responses.length === 0) return null;
  return this.responses[this.responses.length - 1];
});

// Pre-save middleware
ContactSchema.pre('save', function(next) {
  // Auto-set priority based on category
  if (this.isNew || this.isModified('category')) {
    switch (this.category) {
      case 'complaint':
        if (this.priority === 'low' || this.priority === 'medium') {
          this.priority = 'high';
        }
        break;
      case 'enrollment':
        if (this.priority === 'low') {
          this.priority = 'medium';
        }
        break;
    }
  }

  // Auto-set follow-up date for high priority contacts
  if (this.isNew && this.priority === 'high' && !this.followUpDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.followUpDate = tomorrow;
  }

  // Convert email to lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }

  // Auto-set tags based on category and subject
  if (this.isNew) {
    const autoTags = [];
    
    // Add category as tag
    autoTags.push(this.category);
    
    // Add program-related tags based on subject
    const subject = this.subject.toLowerCase();
    if (subject.includes('junior')) autoTags.push('junior-program');
    if (subject.includes('elite')) autoTags.push('elite-program');
    if (subject.includes('adult')) autoTags.push('adult-program');
    if (subject.includes('price') || subject.includes('fee')) autoTags.push('pricing');
    if (subject.includes('schedule') || subject.includes('time')) autoTags.push('scheduling');
    
    // Merge with existing tags
    this.tags = [...new Set([...this.tags, ...autoTags])];
  }

  next();
});

// Instance methods
ContactSchema.methods.addResponse = function(adminId: string, message: string, isInternal = false) {
  this.responses.push({
    from: adminId,
    message,
    date: new Date(),
    isInternal
  });

  // Update status if it's a customer response
  if (!isInternal && this.status === 'new') {
    this.status = 'in-progress';
  }

  // Mark as read
  this.isRead = true;

  return this.save();
};

ContactSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

ContactSchema.methods.assignTo = function(adminId: string) {
  this.assignedTo = adminId;
  if (this.status === 'new') {
    this.status = 'in-progress';
  }
  return this.save();
};

ContactSchema.methods.setFollowUpDate = function(date: Date) {
  this.followUpDate = date;
  return this.save();
};

ContactSchema.methods.addTag = function(tag: string) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    return this.save();
  }
  return Promise.resolve(this);
};

ContactSchema.methods.removeTag = function(tag: string) {
  this.tags = this.tags.filter(t => t !== tag);
  return this.save();
};

ContactSchema.methods.close = function(resolution?: string) {
  this.status = 'closed';
  if (resolution) {
    this.responses.push({
      from: this.assignedTo,
      message: `Case closed: ${resolution}`,
      date: new Date(),
      isInternal: true
    });
  }
  return this.save();
};

// Static methods
ContactSchema.statics.findUnread = function() {
  return this.find({ isRead: false, isArchived: false });
};

ContactSchema.statics.findByStatus = function(status: string) {
  return this.find({ status, isArchived: false });
};

ContactSchema.statics.findByPriority = function(priority: string) {
  return this.find({ priority, isArchived: false });
};

ContactSchema.statics.findOverdue = function() {
  return this.find({
    followUpDate: { $lt: new Date() },
    status: { $nin: ['resolved', 'closed'] },
    isArchived: false
  });
};

ContactSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, isArchived: false });
};

ContactSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $match: { isArchived: false }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

ContactSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    },
    isArchived: false
  });
};

export default mongoose.model<IContact>('Contact', ContactSchema);