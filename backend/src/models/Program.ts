import mongoose, { Document, Schema } from 'mongoose';

export interface IProgram extends Document {
  title: string;
  description: string;
  ageGroup: string;
  duration: string;
  price: number;
  maxStudents: number;
  currentStudents: number;
  features: string[];
  status: 'active' | 'inactive' | 'full' | 'suspended';
  coach?: mongoose.Types.ObjectId;
  coachName?: string; // Virtual field
  schedule: {
    days: string[];
    time: string;
    venue: string;
    sessionDuration?: number; // in minutes
  };
  equipment?: {
    provided: string[];
    required: string[];
  };
  level: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  category: 'junior' | 'youth' | 'adult' | 'elite' | 'special';
  startDate: Date;
  endDate?: Date;
  icon: string;
  image?: string;
  prerequisites?: string[];
  certificationProvided?: boolean;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    validUntil?: Date;
    description?: string;
  };
  rating?: {
    average: number;
    count: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Program title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
    unique: true
  },

  description: {
    type: String,
    required: [true, 'Program description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  ageGroup: {
    type: String,
    required: [true, 'Age group is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        // Validate format like "6-12 years", "18+ years", etc.
        return /^(\d+(-\d+)?|\d+\+)\s+years?$/i.test(v);
      },
      message: 'Age group must be in format like "6-12 years" or "18+ years"'
    }
  },

  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        // Validate format like "2 hours/week", "90 minutes/session"
        return /^\d+\s+(hours?|minutes?)\/(week|session|day|month)$/i.test(v);
      },
      message: 'Duration must be in format like "2 hours/week" or "90 minutes/session"'
    }
  },

  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [100000, 'Price cannot exceed ₹1,00,000'],
    validate: {
      validator: function(v: number) {
        return v >= 0 && Number.isFinite(v);
      },
      message: 'Price must be a valid positive number'
    }
  },

  maxStudents: {
    type: Number,
    required: [true, 'Maximum students limit is required'],
    min: [1, 'Maximum students must be at least 1'],
    max: [100, 'Maximum students cannot exceed 100'],
    validate: {
      validator: Number.isInteger,
      message: 'Maximum students must be a whole number'
    }
  },

  currentStudents: {
    type: Number,
    default: 0,
    min: [0, 'Current students cannot be negative'],
    validate: {
      validator: function(this: IProgram, v: number) {
        return v <= this.maxStudents;
      },
      message: 'Current students cannot exceed maximum students limit'
    }
  },

  features: [{
    type: String,
    required: [true, 'Feature description is required'],
    trim: true,
    minlength: [3, 'Feature must be at least 3 characters long'],
    maxlength: [100, 'Feature cannot exceed 100 characters']
  }],

  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'full', 'suspended'],
      message: 'Status must be active, inactive, full, or suspended'
    },
    default: 'active'
  },

  coach: {
    type: Schema.Types.ObjectId,
    ref: 'Coach'
  },

  schedule: {
    days: {
      type: [String],
      required: [true, 'Schedule days are required'],
      validate: {
        validator: function(days: string[]) {
          const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          return days.length > 0 && days.every(day => validDays.includes(day.toLowerCase()));
        },
        message: 'Please provide valid days of the week'
      }
    },
    time: {
      type: String,
      required: [true, 'Schedule time is required'],
      validate: {
        validator: function(time: string) {
          // Validate time format like "09:00-11:00" or "6:30 PM - 8:00 PM"
          return /^(\d{1,2}:\d{2}(\s?(AM|PM))?)\s?-\s?(\d{1,2}:\d{2}(\s?(AM|PM))?)$/i.test(time);
        },
        message: 'Time must be in format like "09:00-11:00" or "6:30 PM - 8:00 PM"'
      }
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
      minlength: [3, 'Venue must be at least 3 characters long']
    },
    sessionDuration: {
      type: Number,
      min: [30, 'Session duration must be at least 30 minutes'],
      max: [480, 'Session duration cannot exceed 8 hours']
    }
  },

  equipment: {
    provided: [{
      type: String,
      trim: true
    }],
    required: [{
      type: String,
      trim: true
    }]
  },

  level: {
    type: String,
    enum: {
      values: ['beginner', 'intermediate', 'advanced', 'mixed'],
      message: 'Level must be beginner, intermediate, advanced, or mixed'
    },
    required: [true, 'Program level is required']
  },

  category: {
    type: String,
    enum: {
      values: ['junior', 'youth', 'adult', 'elite', 'special'],
      message: 'Category must be junior, youth, adult, elite, or special'
    },
    required: [true, 'Program category is required']
  },

  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(date: Date) {
        return date >= new Date();
      },
      message: 'Start date cannot be in the past'
    }
  },

  endDate: {
    type: Date,
    validate: {
      validator: function(this: IProgram, date: Date) {
        return !date || date > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },

  icon: {
    type: String,
    required: [true, 'Program icon is required'],
    validate: {
      validator: function(icon: string) {
        // Allow emoji or URL
        return icon.trim().length > 0;
      },
      message: 'Please provide a valid icon'
    }
  },

  image: {
    type: String,
    validate: {
      validator: function(url: string) {
        if (!url) return true;
        // Basic URL validation
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Please provide a valid image URL'
    }
  },

  prerequisites: [{
    type: String,
    trim: true
  }],

  certificationProvided: {
    type: Boolean,
    default: false
  },

  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: {
      type: Number,
      min: 0,
      validate: {
        validator: function(this: any, value: number) {
          if (this.type === 'percentage') {
            return value <= 100;
          }
          return value <= this.parent().price;
        },
        message: 'Invalid discount value'
      }
    },
    validUntil: Date,
    description: {
      type: String,
      trim: true
    }
  },

  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      min: 0,
      default: 0
    }
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
ProgramSchema.index({ title: 1 });
ProgramSchema.index({ category: 1 });
ProgramSchema.index({ level: 1 });
ProgramSchema.index({ status: 1 });
ProgramSchema.index({ price: 1 });
ProgramSchema.index({ startDate: 1 });
ProgramSchema.index({ title: 'text', description: 'text' });

// Virtual for coach name
ProgramSchema.virtual('coachName', {
  ref: 'Coach',
  localField: 'coach',
  foreignField: '_id',
  justOne: true
});

// Virtual for occupancy rate
ProgramSchema.virtual('occupancyRate').get(function() {
  return this.maxStudents > 0 ? Math.round((this.currentStudents / this.maxStudents) * 100) : 0;
});

// Virtual for effective price (after discount)
ProgramSchema.virtual('effectivePrice').get(function() {
  if (!this.discount) return this.price;
  
  const now = new Date();
  if (this.discount.validUntil && now > this.discount.validUntil) {
    return this.price;
  }
  
  if (this.discount.type === 'percentage') {
    return this.price - (this.price * this.discount.value / 100);
  } else {
    return this.price - this.discount.value;
  }
});

// Pre-save middleware
ProgramSchema.pre('save', function(next) {
  // Update status based on current enrollment
  if (this.currentStudents >= this.maxStudents) {
    this.status = 'full';
  } else if (this.status === 'full' && this.currentStudents < this.maxStudents) {
    this.status = 'active';
  }
  
  // Validate end date
  if (this.endDate && this.endDate <= this.startDate) {
    const error = new Error('End date must be after start date');
    return next(error);
  }
  
  next();
});

// Instance methods
ProgramSchema.methods.enrollStudent = function() {
  if (this.currentStudents < this.maxStudents) {
    this.currentStudents += 1;
    if (this.currentStudents === this.maxStudents) {
      this.status = 'full';
    }
    return this.save();
  } else {
    throw new Error('Program is full');
  }
};

ProgramSchema.methods.unenrollStudent = function() {
  if (this.currentStudents > 0) {
    this.currentStudents -= 1;
    if (this.status === 'full') {
      this.status = 'active';
    }
    return this.save();
  }
};

ProgramSchema.methods.canEnroll = function() {
  return this.status === 'active' && this.currentStudents < this.maxStudents && this.isActive;
};

ProgramSchema.methods.getRevenue = function() {
  return this.currentStudents * (this.effectivePrice || this.price);
};

// Static methods
ProgramSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, isActive: true });
};

ProgramSchema.statics.findAvailable = function() {
  return this.find({ 
    status: 'active', 
    isActive: true,
    startDate: { $gte: new Date() }
  });
};

ProgramSchema.statics.getTotalRevenue = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { 
      $project: { 
        revenue: { $multiply: ['$currentStudents', '$price'] } 
      } 
    },
    { 
      $group: { 
        _id: null, 
        totalRevenue: { $sum: '$revenue' } 
      } 
    }
  ]);
};

export default mongoose.model<IProgram>('Program', ProgramSchema);