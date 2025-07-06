import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin';

// Load environment variables
dotenv.config();

async function testLogin() {
  try {
    // Find admin by email
    const email = 'admin@kalyancricketacademy.com';
    const password = 'Admin@123456';

    console.log(`Looking for admin with email: ${email}`);
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      console.log('Admin not found');
      
      // Create a new admin for testing
      console.log('Creating a new admin for testing...');
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const newAdmin = await Admin.create({
        name: 'Test Admin',
        email: email,
        password: hashedPassword, // Pre-hash the password
        role: 'super-admin',
        phone: '+919876543210',
        profile: {
          department: 'administration',
          employeeId: 'EMP001',
          joinDate: new Date(),
          bio: 'Test Admin'
        }
      });
      
      console.log('New admin created:', newAdmin.email);
      
    } else {
      console.log('Admin found:', admin.email);
      console.log('Admin role:', admin.role);
      console.log('Admin password hash:', admin.password);
      
      // Test password comparison
      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      console.log('Password correct:', isPasswordCorrect);
      
      if (!isPasswordCorrect) {
        // Update the password for testing
        console.log('Updating password...');
        admin.password = password;
        await admin.save();
        console.log('Password updated');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testLogin();