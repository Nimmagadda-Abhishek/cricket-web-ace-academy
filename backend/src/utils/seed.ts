import connectDB from '../config/database';
import Admin from '../models/Admin';
import Coach from '../models/Coach';
import Program from '../models/Program';
import Student from '../models/Student';
import Contact from '../models/Contact';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional - remove in production)
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Admin.deleteMany({}),
      Coach.deleteMany({}),
      Program.deleteMany({}),
      Student.deleteMany({}),
      Contact.deleteMany({})
    ]);

    // Create Super Admin
    console.log('👤 Creating super admin...');
    
    // First check if admin already exists
    let superAdmin = await Admin.findOne({ email: 'admin@kalyancricketacademy.com' });
    
    if (superAdmin) {
      console.log('Admin already exists, updating password...');
      // Update the password directly with bcrypt hash to bypass validation
      const hashedPassword = await bcrypt.hash('Admin@123456', 12);
      superAdmin = await Admin.findByIdAndUpdate(superAdmin._id, { 
        password: hashedPassword,
        passwordChangedAt: new Date()
      }, { new: true });
      console.log('Admin password updated');
    } else {
      // Create new admin with pre-hashed password to bypass validation
      const hashedPassword = await bcrypt.hash('Admin@123456', 12);
      
      superAdmin = await Admin.create({
        name: 'Super Admin',
        email: 'admin@kalyancricketacademy.com',
        password: hashedPassword, // Use pre-hashed password
        role: 'super-admin',
        phone: '+919876543210',
        profile: {
          department: 'administration',
          employeeId: 'EMP001',
          joinDate: new Date(),
          bio: 'Founder and Super Administrator of Kalyan Cricket Academy'
        },
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            browser: true,
            mobile: true
          },
          dashboard: {
            widgets: ['students', 'programs', 'revenue', 'contacts', 'coaches'],
            layout: 'grid'
          }
        }
      });
      console.log('New admin created');
    }

    // Create additional admins
    console.log('👥 Creating additional admins...');
    const admins = await Admin.create([
      {
        name: 'John Manager',
        email: 'manager@kalyancricketacademy.com',
        password: 'Manager@123',
        role: 'manager',
        phone: '+919876543211', // Fixed phone format - no hyphens
        profile: {
          department: 'operations',
          employeeId: 'EMP002',
          joinDate: new Date(),
          bio: 'Operations Manager handling day-to-day academy operations'
        }
      },
      {
        name: 'Sarah Staff',
        email: 'staff@kalyancricketacademy.com',
        password: 'Staff@123',
        role: 'staff',
        phone: '+919876543212', // Fixed phone format - no hyphens
        profile: {
          department: 'administration',
          employeeId: 'EMP003',
          joinDate: new Date(),
          bio: 'Administrative staff member'
        }
      }
    ]);

    // Create Coaches
    console.log('🏏 Creating coaches...');
    const coaches = await Coach.create([
      {
        name: 'Virat Sharma',
        email: 'virat.sharma@kalyancricketacademy.com',
        phone: '+919876543220', // Fixed phone format - no hyphens
        specialization: ['batting', 'all-rounder'],
        experience: 15,
        bio: 'Former state-level cricketer with 15 years of coaching experience. Specializes in batting techniques and all-round development of young cricketers.',
        image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=300',
        certifications: ['BCCI Level A Coach', 'NCA Certified', 'Sports Psychology Certificate'],
        contactInfo: {
          emergencyContact: '+919876543221', // Fixed phone format - no hyphens
          address: '123 Cricket Street, Kalyan, Maharashtra',
          dateOfBirth: new Date('1985-05-15')
        },
        employment: {
          joinDate: new Date('2020-01-15'),
          salary: 50000,
          employmentType: 'full-time',
          status: 'active'
        },
        qualifications: [
          {
            degree: 'Bachelor in Sports Science',
            institution: 'Mumbai University',
            year: 2008,
            cricketLevel: 'domestic'
          }
        ],
        achievements: [
          'Led academy team to state championship victory 2022',
          'Coached 3 players to district level selection',
          'Coach of the Year 2023'
        ],
        availability: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          timeSlots: [
            { start: '06:00', end: '10:00' },
            { start: '16:00', end: '20:00' }
          ]
        },
        rating: {
          average: 4.8,
          count: 25,
          reviews: [] // Remove reviews for now
        }
      },
      {
        name: 'Rohit Patel',
        email: 'rohit.patel@kalyancricketacademy.com',
        phone: '+919876543225', // Fixed phone format - no hyphens
        specialization: ['bowling', 'fast-bowling'],
        experience: 12,
        bio: 'Expert fast bowling coach with international coaching experience. Known for developing pace bowlers and improving bowling techniques.',
        image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=300',
        certifications: ['BCCI Level B Coach', 'ICC Coaching Certificate'],
        contactInfo: {
          emergencyContact: '+919876543226', // Fixed phone format - no hyphens
          address: '456 Bowling Lane, Kalyan, Maharashtra',
          dateOfBirth: new Date('1988-08-22')
        },
        employment: {
          joinDate: new Date('2021-03-10'),
          salary: 45000,
          employmentType: 'full-time',
          status: 'active'
        },
        qualifications: [
          {
            degree: 'Master in Physical Education',
            institution: 'Pune University',
            year: 2012,
            cricketLevel: 'club'
          }
        ],
        achievements: [
          'Developed 5 fast bowlers for state team',
          'Best Bowling Coach Award 2022'
        ],
        availability: {
          days: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          timeSlots: [
            { start: '07:00', end: '11:00' },
            { start: '17:00', end: '21:00' }
          ]
        },
        rating: {
          average: 4.6,
          count: 18,
          reviews: []
        }
      },
      {
        name: 'Priya Gupta',
        email: 'priya.gupta@kalyancricketacademy.com',
        phone: '+919876543230', // Fixed phone format - no hyphens
        specialization: ['wicket-keeping', 'youth-development'],
        experience: 8,
        bio: 'Specialist wicket-keeping coach and youth development expert. Focus on fundamental skills and mental conditioning for young players.',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b5fc6d05?w=300',
        certifications: ['BCCI Level C Coach', 'Child Psychology Certificate'],
        contactInfo: {
          emergencyContact: '+919876543231', // Fixed phone format - no hyphens
          address: '789 Youth Lane, Kalyan, Maharashtra',
          dateOfBirth: new Date('1992-12-05')
        },
        employment: {
          joinDate: new Date('2022-06-01'),
          salary: 40000,
          employmentType: 'full-time',
          status: 'active'
        },
        qualifications: [
          {
            degree: 'Bachelor in Sports Management',
            institution: 'Delhi University',
            year: 2015,
            cricketLevel: 'academy'
          }
        ],
        achievements: [
          'Youth Development Program Lead',
          'Certified in Child Sports Psychology'
        ],
        availability: {
          days: ['monday', 'wednesday', 'friday', 'saturday', 'sunday'],
          timeSlots: [
            { start: '08:00', end: '12:00' },
            { start: '15:00', end: '19:00' }
          ]
        },
        rating: {
          average: 4.9,
          count: 12,
          reviews: []
        }
      }
    ]);

    // Create Programs
    console.log('📚 Creating programs...');
    const programs = await Program.create([
      {
        title: 'Junior Cricket (6-12 years)',
        description: 'Fun-based learning program focusing on basic cricket skills, hand-eye coordination, and team spirit. Perfect introduction to cricket for young children.',
        ageGroup: '6-12 years',
        duration: '2 hours/week',
        price: 6500,
        maxStudents: 30,
        currentStudents: 0,
        features: [
          'Basic batting and bowling techniques',
          'Fielding fundamentals',
          'Team spirit development',
          'Safe and fun environment',
          'Age-appropriate equipment'
        ],
        status: 'active',
        coach: coaches[2]?._id, // Priya Gupta
        schedule: {
          days: ['saturday', 'sunday'],
          time: '08:00-10:00',
          venue: 'Junior Ground',
          sessionDuration: 120
        },
        equipment: {
          provided: ['Bats', 'Balls', 'Stumps', 'Pads', 'Helmets'],
          required: ['Sports shoes', 'Comfortable clothing', 'Water bottle']
        },
        level: 'beginner',
        category: 'junior',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in the future
        icon: '🏏',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500',
        prerequisites: [],
        certificationProvided: true
      },
      {
        title: 'Youth Development (13-17 years)',
        description: 'Comprehensive cricket development program for teenagers focusing on technique refinement, tactical understanding, and competitive play.',
        ageGroup: '13-17 years',
        duration: '3 hours/week',
        price: 10000,
        maxStudents: 25,
        currentStudents: 0,
        features: [
          'Advanced batting techniques',
          'Bowling variations',
          'Tactical cricket understanding',
          'Fitness and conditioning',
          'Match play experience'
        ],
        status: 'active',
        coach: coaches[0]?._id, // Virat Sharma
        schedule: {
          days: ['tuesday', 'thursday'],
          time: '16:00-18:30',
          venue: 'Main Ground',
          sessionDuration: 150
        },
        equipment: {
          provided: ['Professional bats', 'Match balls', 'Full protective gear'],
          required: ['Cricket shoes', 'Cricket whites', 'Kit bag']
        },
        level: 'intermediate',
        category: 'youth',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days in the future
        icon: '⭐',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500',
        prerequisites: ['Basic cricket knowledge'],
        certificationProvided: true
      },
      {
        title: 'Adult Programs (18+ years)',
        description: 'Cricket programs designed for adults looking to learn cricket, improve their game, or get back into cricket after a break.',
        ageGroup: '18+ years',
        duration: '2.5 hours/week',
        price: 12500,
        maxStudents: 20,
        currentStudents: 0,
        features: [
          'Flexible timings',
          'Technique improvement',
          'Fitness integration',
          'Social cricket environment',
          'Weekend matches'
        ],
        status: 'active',
        coach: coaches[0]?._id, // Virat Sharma
        schedule: {
          days: ['wednesday', 'saturday'],
          time: '18:00-20:30',
          venue: 'Main Ground',
          sessionDuration: 150
        },
        equipment: {
          provided: ['Training equipment', 'Practice balls'],
          required: ['Own bat (recommended)', 'Cricket shoes', 'Comfortable sportswear']
        },
        level: 'mixed',
        category: 'adult',
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days in the future
        icon: '🎯',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        prerequisites: [],
        certificationProvided: false
      },
      {
        title: 'Elite Training (Advanced)',
        description: 'High-intensity training program for serious cricketers aiming for competitive cricket at district, state, or higher levels.',
        ageGroup: '14+ years',
        duration: '5 hours/week',
        price: 25000,
        maxStudents: 15,
        currentStudents: 0,
        features: [
          'Personalized coaching',
          'Video analysis',
          'Mental conditioning',
          'Specialized training modules',
          'Tournament preparation',
          'Nutrition guidance'
        ],
        status: 'active',
        coach: coaches[1]?._id, // Rohit Patel
        schedule: {
          days: ['monday', 'wednesday', 'friday'],
          time: '17:00-19:40',
          venue: 'Elite Training Center',
          sessionDuration: 100
        },
        equipment: {
          provided: ['Premium equipment', 'Analysis tools', 'Fitness equipment'],
          required: ['Professional cricket kit', 'Multiple bats', 'Personal protective gear']
        },
        level: 'advanced',
        category: 'elite',
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days in the future
        icon: '👑',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
        prerequisites: ['Proven cricket experience', 'Selection trial required'],
        certificationProvided: true,
        discount: {
          type: 'percentage',
          value: 10,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          description: 'Early bird discount for first 10 enrollments'
        }
      }
    ]);

    // Update coaches with their assigned programs
    if (coaches[0]?._id && programs[1]?._id && programs[2]?._id) {
      await Coach.findByIdAndUpdate(coaches[0]._id, {
        $push: { programs: { $each: [programs[1]._id, programs[2]._id] } }
      });
    }
    if (coaches[1]?._id && programs[3]?._id) {
      await Coach.findByIdAndUpdate(coaches[1]._id, {
        $push: { programs: programs[3]._id }
      });
    }
    if (coaches[2]?._id && programs[0]?._id) {
      await Coach.findByIdAndUpdate(coaches[2]._id, {
        $push: { programs: programs[0]._id }
      });
    }

    // Create Students
    console.log('🎓 Creating students...');
    const students = await Student.create([
      {
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@email.com',
        phone: '+91-98765-43201',
        age: 16,
        program: programs[1]?._id, // Youth Development
        joinDate: new Date('2023-09-15'),
        status: 'active',
        fees: 10000,
        emergencyContact: {
          name: 'Maria Rodriguez',
          phone: '+91-98765-43202',
          relationship: 'parent'
        },
        medicalInfo: {
          allergies: 'None',
          bloodGroup: 'O+'
        },
        paymentHistory: [
          {
            month: 'January',
            year: 2024,
            amount: 10000,
            paidDate: new Date('2024-01-05'),
            status: 'paid',
            paymentMethod: 'upi',
            transactionId: 'UPI123456789'
          }
        ],
        performance: {
          skillLevel: 'intermediate',
          attendanceRate: 95,
          lastAssessment: new Date('2024-01-15'),
          notes: 'Showing excellent improvement in batting technique'
        }
      },
      {
        name: 'Emma Thompson',
        email: 'emma.thompson@email.com',
        phone: '+91-98765-43203',
        age: 14,
        program: programs[1]?._id, // Youth Development
        joinDate: new Date('2023-10-01'),
        status: 'active',
        fees: 10000,
        emergencyContact: {
          name: 'David Thompson',
          phone: '+91-98765-43204',
          relationship: 'parent'
        },
        medicalInfo: {
          allergies: 'Dust allergy',
          bloodGroup: 'A+'
        },
        paymentHistory: [
          {
            month: 'January',
            year: 2024,
            amount: 10000,
            paidDate: new Date('2024-01-03'),
            status: 'paid',
            paymentMethod: 'bank_transfer'
          }
        ],
        performance: {
          skillLevel: 'beginner',
          attendanceRate: 88,
          notes: 'Great enthusiasm, working on basic techniques'
        }
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@email.com',
        phone: '+91-98765-43205',
        age: 28,
        program: programs[2]?._id, // Adult Programs
        joinDate: new Date('2023-08-20'),
        status: 'active',
        fees: 12500,
        emergencyContact: {
          name: 'Sarah Wilson',
          phone: '+91-98765-43206',
          relationship: 'spouse'
        },
        medicalInfo: {
          allergies: 'None',
          bloodGroup: 'B+'
        },
        paymentHistory: [
          {
            month: 'January',
            year: 2024,
            amount: 12500,
            paidDate: new Date('2024-01-01'),
            status: 'paid',
            paymentMethod: 'card'
          }
        ],
        performance: {
          skillLevel: 'intermediate',
          attendanceRate: 92,
          notes: 'Consistent player, good fitness level'
        }
      },
      {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@email.com',
        phone: '+91-98765-43207',
        age: 12,
        program: programs[0]?._id, // Junior Cricket
        joinDate: new Date('2023-11-10'),
        status: 'pending',
        fees: 6500,
        emergencyContact: {
          name: 'Robert Mitchell',
          phone: '+91-98765-43208',
          relationship: 'parent'
        },
        medicalInfo: {
          allergies: 'None',
          bloodGroup: 'AB+'
        },
        paymentHistory: [],
        performance: {
          skillLevel: 'beginner',
          attendanceRate: 0,
          notes: 'New enrollment, assessment pending'
        }
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+91-98765-43209',
        age: 19,
        program: programs[3]?._id, // Elite Training
        joinDate: new Date('2023-07-05'),
        status: 'active',
        fees: 25000,
        emergencyContact: {
          name: 'Linda Chen',
          phone: '+91-98765-43210',
          relationship: 'parent'
        },
        medicalInfo: {
          allergies: 'None',
          bloodGroup: 'O-'
        },
        paymentHistory: [
          {
            month: 'January',
            year: 2024,
            amount: 25000,
            paidDate: new Date('2024-01-02'),
            status: 'paid',
            paymentMethod: 'bank_transfer',
            transactionId: 'TXN987654321'
          }
        ],
        performance: {
          skillLevel: 'advanced',
          attendanceRate: 98,
          lastAssessment: new Date('2024-01-10'),
          notes: 'Exceptional talent, preparing for state trials'
        }
      }
    ]);

    // Update program enrollment counts
    if (programs[0]?._id) {
      await Program.findByIdAndUpdate(programs[0]._id, { currentStudents: 1 }); // Junior Cricket
    }
    if (programs[1]?._id) {
      await Program.findByIdAndUpdate(programs[1]._id, { currentStudents: 2 }); // Youth Development
    }
    if (programs[2]?._id) {
      await Program.findByIdAndUpdate(programs[2]._id, { currentStudents: 1 }); // Adult Programs
    }
    if (programs[3]?._id) {
      await Program.findByIdAndUpdate(programs[3]._id, { currentStudents: 1 }); // Elite Training
    }

    // Create sample contacts
    console.log('📞 Creating sample contacts...');
    const contacts = await Contact.create([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91-98765-43250',
        subject: 'Inquiry about Junior Cricket Program',
        message: 'Hi, I want to enroll my 8-year-old son in your junior cricket program. Can you please provide more details about the schedule and fees?',
        category: 'enrollment',
        priority: 'medium',
        status: 'new',
        source: 'website',
        tags: ['junior-program', 'enrollment'],
        contactPreference: 'both',
        isRead: false
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91-98765-43251',
        subject: 'Coaching Feedback',
        message: 'I wanted to thank Coach Virat for the excellent training my daughter has been receiving. Her batting has improved significantly!',
        category: 'suggestion',
        priority: 'low',
        status: 'resolved',
        source: 'phone',
        tags: ['feedback', 'coaching'],
        contactPreference: 'phone',
        isRead: true,
        responses: [
          {
            from: superAdmin._id,
            message: 'Thank you for your wonderful feedback! We are delighted to hear about your daughter\'s progress.',
            date: new Date(),
            isInternal: false
          }
        ]
      },
      {
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@email.com',
        phone: '+91-98765-43252',
        subject: 'Equipment Issue',
        message: 'The batting pads provided during the session were damaged. Please check and replace them.',
        category: 'complaint',
        priority: 'high',
        status: 'in-progress',
        source: 'email',
        tags: ['equipment', 'complaint'],
        contactPreference: 'email',
        isRead: true,
        assignedTo: admins[0]?._id,
        followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      }
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`👤 Admins: ${admins.length + 1} (including super admin)`);
    console.log(`🏏 Coaches: ${coaches.length}`);
    console.log(`📚 Programs: ${programs.length}`);
    console.log(`🎓 Students: ${students.length}`);
    console.log(`📞 Contacts: ${contacts.length}`);

    console.log('\n🔐 Login Credentials:');
    console.log('Super Admin:');
    console.log('  Email: admin@kalyancricketacademy.com');
    console.log('  Password: Admin@123456');
    console.log('Manager:');
    console.log('  Email: manager@kalyancricketacademy.com');
    console.log('  Password: Manager@123');
    console.log('Staff:');
    console.log('  Email: staff@kalyancricketacademy.com');
    console.log('  Password: Staff@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;