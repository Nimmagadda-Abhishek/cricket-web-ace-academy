import mongoose, { Document, Schema, Model } from 'mongoose';
import validator from 'validator';

// Define payment history interface
interface PaymentRecord {
  month: string;
  year: number;
  amount: number;
  paidDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: 'cash' | 'card' | 'upi' | 'bank_transfer';
  transactionId?: string;
}

// Define the document interface
interface IStudentDocument extends Document {
  name: string;
  email: string;
  phone: string;
  age: number;
  program: mongoose.Types.ObjectId;
  programName?: string; // Virtual field
  joinDate: Date;
  status: 'active' | 'inactive' | 'pending';
  fees: number;
  avatar?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    allergies?: string;
    medications?: string;
    emergencyMedicalInfo?: string;
    bloodGroup?: string;
  };
  paymentHistory: PaymentRecord[];
  performance?: {
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    attendanceRate: number;
    lastAssessment?: Date;
    notes?: string;
  };
  documents?: {
    birthCertificate?: string;
    medicalCertificate?: string;
    photos?: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  getFullPaymentHistory(): PaymentRecord[];
  calculateTotalPaid(): number;
  getOverduePayments(): PaymentRecord[];
}

// Define the model interface with static methods
interface IStudentModel extends Model<IStudentDocument> {
  // Static methods are defined in the schema, no need to redeclare here
}

// Export the combined interface for external use
export interface IStudent extends IStudentDocument {}

const StudentSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
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
        return /^[\+]?[1-9][\d\-\s]{0,20}$/.test(v); // International phone format with optional hyphens and spaces
      },
      message: 'Please provide a valid phone number'
    }
  },

  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [4, 'Age must be at least 4 years'],
    max: [50, 'Age cannot exceed 50 years'],
    validate: {
      validator: Number.isInteger,
      message: 'Age must be a whole number'
    }
  },

  program: {
    type: Schema.Types.ObjectId,
    ref: 'Program',
    required: [true, 'Program is required']
  },

  joinDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(date: Date) {
        return date <= new Date();
      },
      message: 'Join date cannot be in the future'
    }
  },

  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'pending'],
      message: 'Status must be either active, inactive, or pending'
    },
    default: 'pending'
  },

  fees: {
    type: Number,
    required: [true, 'Fees amount is required'],
    min: [0, 'Fees cannot be negative'],
    validate: {
      validator: function(v: number) {
        return v >= 0 && v <= 100000; // Max fees validation
      },
      message: 'Fees must be between 0 and 100,000'
    }
  },

  avatar: {
    type: String,
    validate: {
      validator: function(url: string) {
        return !url || validator.isURL(url);
      },
      message: 'Please provide a valid avatar URL'
    }
  },

  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      validate: {
        validator: function(v: string) {
          return /^[\+]?[1-9][\d\-\s]{0,20}$/.test(v); // International phone format with optional hyphens and spaces
        },
        message: 'Please provide a valid emergency contact phone number'
      }
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      enum: ['parent', 'guardian', 'spouse', 'sibling', 'friend', 'other']
    }
  },

  medicalInfo: {
    allergies: {
      type: String,
      trim: true
    },
    medications: {
      type: String,
      trim: true
    },
    emergencyMedicalInfo: {
      type: String,
      trim: true
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    }
  },

  paymentHistory: [{
    month: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true,
      min: 2023,
      max: 2030
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paidDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer']
    },
    transactionId: String
  }],

  performance: {
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    attendanceRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastAssessment: Date,
    notes: {
      type: String,
      trim: true
    }
  },

  documents: {
    birthCertificate: String,
    medicalCertificate: String,
    photos: [String]
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
StudentSchema.index({ email: 1 });
StudentSchema.index({ program: 1 });
StudentSchema.index({ status: 1 });
StudentSchema.index({ joinDate: 1 });
StudentSchema.index({ name: 'text', email: 'text' }); // Text search

// Virtual for program name
StudentSchema.virtual('programName', {
  ref: 'Program',
  localField: 'program',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware
StudentSchema.pre('save', async function(this: IStudentDocument, next) {
  // Convert email to lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }

  // Update status based on payment history
  if (this.paymentHistory && this.paymentHistory.length > 0) {
    const latestPayments = this.paymentHistory
      .filter((payment: PaymentRecord) => payment.status === 'overdue')
      .length;
    
    if (latestPayments > 2 && this.status === 'active') {
      this.status = 'inactive';
    }
  }

  next();
});

// Instance methods
StudentSchema.methods.getFullPaymentHistory = function(this: IStudentDocument): PaymentRecord[] {
  return this.paymentHistory.sort((a: PaymentRecord, b: PaymentRecord) => 
    new Date(b.paidDate).getTime() - new Date(a.paidDate).getTime()
  );
};

StudentSchema.methods.calculateTotalPaid = function(this: IStudentDocument): number {
  return this.paymentHistory
    .filter((payment: PaymentRecord) => payment.status === 'paid')
    .reduce((total: number, payment: PaymentRecord) => total + payment.amount, 0);
};

StudentSchema.methods.getOverduePayments = function(this: IStudentDocument): PaymentRecord[] {
  return this.paymentHistory.filter((payment: PaymentRecord) => payment.status === 'overdue');
};

// Static methods
StudentSchema.statics.findByProgram = function(programId: string): Promise<IStudentDocument[]> {
  return this.find({ program: programId, isActive: true });
};

StudentSchema.statics.getActiveStudentsCount = function(): Promise<number> {
  return this.countDocuments({ status: 'active', isActive: true });
};

StudentSchema.statics.getTotalRevenue = function(): Promise<any> {
  return this.aggregate([
    { $match: { status: 'active', isActive: true } },
    { $group: { _id: null, totalRevenue: { $sum: '$fees' } } }
  ]);
};

export default mongoose.model<IStudentDocument, IStudentModel>('Student', StudentSchema);