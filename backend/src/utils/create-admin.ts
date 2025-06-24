import connectDB from '../config/database';
import Admin from '../models/Admin';
import mongoose from 'mongoose';

const createAdmin = async () => {
  try {
    await connectDB();
    console.log('🌱 Connected to database');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@kalyancricketacademy.com' });
    
    if (existingAdmin) {
      console.log('👤 Admin already exists');
      process.exit(0);
    }

    // Create Super Admin
    console.log('👤 Creating super admin...');
    const superAdmin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@kalyancricketacademy.com',
      password: 'Admin@123456',
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

    console.log('✅ Admin created successfully');
    console.log('📧 Email: admin@kalyancricketacademy.com');
    console.log('🔑 Password: Admin@123456');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();