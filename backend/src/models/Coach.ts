import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

export interface ICoach extends Document {
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  bio: string;
  image?: string;
  certifications: string[];
  rating: {
    average: number;
    count: number;
    reviews: {
      studentId: mongoose.Types.ObjectId;
      rating: number;
      comment?: string;
      date: Date;
    }[];
  };
  programs: mongoose.Types.ObjectId[];
  availability: {
    days: string[];
    timeSlots: {
      start: string;
      end: string;
    }[];
  };
  contactInfo: {
    emergencyContact: string;
    address?: string;
    dateOfBirth?: Date;
  };
  employment: {
    joinDate: Date;
    salary?: number;
    employmentType: 'full-time' | 'part-time' | 'contract';
    status: 'active' | 'inactive' | 'on-leave';
  };
  qualifications: {
    degree?: string;
    institution?: string;
    year?: number;
    cricketLevel?: 'international' | 'domestic' | 'club' | 'academy';
  }[];
  achievements: string[];
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Coach name is required'],
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

  specialization: [{
    type: String,
    required: [true, 'At least one specialization is required'],
    enum: [
      'batting',
      'bowling',
      'wicket-keeping',
      'fielding',
      'all-rounder',
      'fitness',
      'mental-coaching',
      'technical-analysis',
      'youth-development',
      'fast-bowling',
      'spin-bowling',
      'power-hitting'
    ]
  }],

  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years'],
    validate: {
      validator: Number.isInteger,
      message: 'Experience must be a whole number'
    }
  },

  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
    minlength: [50, 'Bio must be at least 50 characters long'],
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },

  image: {
    type: String,
    validate: {
      validator: function(url: string) {
        return !url || validator.isURL(url);
      },
      message: 'Please provide a valid image URL'
    }
  },

  certifications: [{
    type: String,
    trim: true,
    validate: {
      validator: function(cert: string) {
        return cert.length >= 3;
      },
      message: 'Certification must be at least 3 characters long'
    }
  }],

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
    },
    reviews: [{
      studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters']
      },
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },

  programs: [{
    type: Schema.Types.ObjectId,
    ref: 'Program'
  }],

  availability: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    timeSlots: [{
      start: {
        type: String,
        required: true,
        validate: {
          validator: function(time: string) {
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
          },
          message: 'Time must be in HH:MM format'
        }
      },
      end: {
        type: String,
        required: true,
        validate: {
          validator: function(time: string) {
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
          },
          message: 'Time must be in HH:MM format'
        }
      }
    }]
  },

  contactInfo: {
    emergencyContact: {
      type: String,
      required: [true, 'Emergency contact is required'],
      validate: {
        validator: function(v: string) {
          return /^[\+]?[1-9][\d]{0,15}$/.test(v);
        },
        message: 'Please provide a valid emergency contact number'
      }
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function(date: Date) {
          const today = new Date();
          const age = today.getFullYear() - date.getFullYear();
          return age >= 18 && age <= 65;
        },
        message: 'Coach must be between 18 and 65 years old'
      }
    }
  },

  employment: {
    joinDate: {
      type: Date,
      required: [true, 'Join date is required'],
      default: Date.now
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
      max: [1000000, 'Salary seems too high']
    },
    employmentType: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: ['full-time', 'part-time', 'contract']
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-leave'],
      default: 'active'
    }
  },

  qualifications: [{
    degree: {
      type: String,
      trim: true
    },
    institution: {
      type: String,
      trim: true
    },
    year: {
      type: Number,
      min: 1980,
      max: new Date().getFullYear()
    },
    cricketLevel: {
      type: String,
      enum: ['international', 'domestic', 'club', 'academy']
    }
  }],

  achievements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Achievement description cannot exceed 200 characters']
  }],

  socialMedia: {
    instagram: {
      type: String,
      validate: {
        validator: function(url: string) {
          return !url || /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+(\/)?$/.test(url);
        },
        message: 'Please provide a valid Instagram URL'
      }
    },
    twitter: {
      type: String,
      validate: {
        validator: function(url: string) {
          return !url || /^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+(\/)?$/.test(url);
        },
        message: 'Please provide a valid Twitter URL'
      }
    },
    linkedin: {
      type: String,
      validate: {
        validator: function(url: string) {
          return !url || /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+(\/)?$/.test(url);
        },
        message: 'Please provide a valid LinkedIn URL'
      }
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

// Indexes
CoachSchema.index({ email: 1 });
CoachSchema.index({ specialization: 1 });
CoachSchema.index({ 'employment.status': 1 });
CoachSchema.index({ 'rating.average': -1 });
CoachSchema.index({ name: 'text', bio: 'text' });

// Virtual for age
CoachSchema.virtual('age').get(function() {
  if (!this.contactInfo?.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.contactInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for programs count
CoachSchema.virtual('programsCount').get(function() {
  return this.programs ? this.programs.length : 0;
});

// Pre-save middleware
CoachSchema.pre('save', function(next) {
  // Calculate average rating
  if (this.rating.reviews && this.rating.reviews.length > 0) {
    const totalRating = this.rating.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = Number((totalRating / this.rating.reviews.length).toFixed(1));
    this.rating.count = this.rating.reviews.length;
  }

  // Convert email to lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }

  next();
});

// Instance methods
CoachSchema.methods.addReview = function(studentId: string, rating: number, comment?: string) {
  // Check if student already reviewed
  const existingReview = this.rating.reviews.find(
    (review: any) => review.studentId.toString() === studentId
  );
  
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.date = new Date();
  } else {
    this.rating.reviews.push({
      studentId,
      rating,
      comment,
      date: new Date()
    });
  }
  
  return this.save();
};

CoachSchema.methods.getAverageRating = function() {
  if (this.rating.reviews.length === 0) return 0;
  const total = this.rating.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
  return Number((total / this.rating.reviews.length).toFixed(1));
};

CoachSchema.methods.isAvailableOn = function(day: string, timeSlot?: { start: string; end: string }) {
  const dayLower = day.toLowerCase();
  const isAvailableDay = this.availability.days.includes(dayLower);
  
  if (!timeSlot) return isAvailableDay;
  
  // Check if time slot is available
  return isAvailableDay && this.availability.timeSlots.some((slot: any) => {
    return slot.start <= timeSlot.start && slot.end >= timeSlot.end;
  });
};

CoachSchema.methods.canTakeMorePrograms = function(maxPrograms = 5) {
  return this.programs.length < maxPrograms && this.employment.status === 'active';
};

// Static methods
CoachSchema.statics.findBySpecialization = function(specialization: string) {
  return this.find({ 
    specialization: { $in: [specialization] },
    isActive: true,
    'employment.status': 'active'
  });
};

CoachSchema.statics.findAvailable = function(day?: string, timeSlot?: { start: string; end: string }) {
  const query: any = {
    isActive: true,
    'employment.status': 'active'
  };
  
  if (day) {
    query['availability.days'] = { $in: [day.toLowerCase()] };
  }
  
  // Note: Time slot filtering would need more complex logic in a real application
  return this.find(query);
};

CoachSchema.statics.getTopRated = function(limit = 5) {
  return this.find({
    isActive: true,
    'employment.status': 'active',
    'rating.count': { $gte: 1 }
  })
  .sort({ 'rating.average': -1, 'rating.count': -1 })
  .limit(limit);
};

export default mongoose.model<ICoach>('Coach', CoachSchema);