import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'https://cricket-web-ace-academy.onrender.com/api';
let authToken = '';

interface APIResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

class APITester {
  // Admin login to get authentication token
  async login(username: string = 'admin', password: string = 'admin') {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json() as APIResponse;
      
      if (result.success && result.data?.token) {
        authToken = result.data.token;
        console.log('✅ Logged in successfully');
        return true;
      } else {
        console.error('❌ Login failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  }

  // Generic GET request
  async get(endpoint: string, requireAuth: boolean = false) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (requireAuth && authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      const result = await response.json() as APIResponse;
      return result;
    } catch (error) {
      console.error(`❌ GET ${endpoint} error:`, error);
      throw error;
    }
  }

  // Generic POST request
  async post(endpoint: string, data: any, requireAuth: boolean = false) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (requireAuth && authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      const result = await response.json() as APIResponse;
      return result;
    } catch (error) {
      console.error(`❌ POST ${endpoint} error:`, error);
      throw error;
    }
  }

  // Generic PUT request
  async put(endpoint: string, data: any, requireAuth: boolean = true) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (requireAuth && authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      const result = await response.json() as APIResponse;
      return result;
    } catch (error) {
      console.error(`❌ PUT ${endpoint} error:`, error);
      throw error;
    }
  }

  // Generic DELETE request
  async delete(endpoint: string, requireAuth: boolean = true) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (requireAuth && authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      const result = await response.json() as APIResponse;
      return result;
    } catch (error) {
      console.error(`❌ DELETE ${endpoint} error:`, error);
      throw error;
    }
  }

  // Test all student operations
  async testStudentOperations() {
    console.log('\\n🧪 Testing Student Operations...');
    
    // Get all students
    console.log('\\n📋 Getting all students...');
    const studentsResult = await this.get('/students', true);
    console.log('Students:', studentsResult.data?.students?.length || 0, 'found');

    // Create a new student
    console.log('\\n➕ Creating new student...');
    const newStudent = {
      name: 'Test Student',
      email: 'test@example.com',
      phone: '1234567890',
      date_of_birth: '2012-01-01',
      parent_name: 'Test Parent',
      parent_phone: '1234567891',
      parent_email: 'parent@example.com',
      address: 'Test Address'
    };
    
    const createResult = await this.post('/students', newStudent, true);
    if (createResult.success) {
      console.log('✅ Student created successfully, ID:', createResult.data?.student?.id);
      
      // Update the student
      const studentId = createResult.data.student.id;
      console.log('\\n✏️ Updating student...');
      const updateData = { phone: '9876543210' };
      const updateResult = await this.put(`/students/${studentId}`, updateData, true);
      console.log('Update result:', updateResult.success ? '✅ Success' : '❌ Failed');
      
      // Get single student
      console.log('\\n👤 Getting single student...');
      const singleStudentResult = await this.get(`/students/${studentId}`, true);
      console.log('Single student:', singleStudentResult.success ? '✅ Found' : '❌ Not found');

      // Delete the student
      console.log('\\n🗑️ Deleting test student...');
      const deleteResult = await this.delete(`/students/${studentId}`, true);
      console.log('Delete result:', deleteResult.success ? '✅ Success' : '❌ Failed');
    } else {
      console.error('❌ Failed to create student:', createResult.message);
    }
  }

  // Test program operations
  async testProgramOperations() {
    console.log('\\n🧪 Testing Program Operations...');
    
    // Get all programs
    console.log('\\n📋 Getting all programs...');
    const programsResult = await this.get('/programs');
    console.log('Programs:', programsResult.data?.programs?.length || 0, 'found');
  }

  // Test coach operations
  async testCoachOperations() {
    console.log('\\n🧪 Testing Coach Operations...');
    
    // Get all coaches
    console.log('\\n📋 Getting all coaches...');
    const coachesResult = await this.get('/coaches');
    console.log('Coaches:', coachesResult.data?.coaches?.length || 0, 'found');
  }

  // Test testimonial operations
  async testTestimonialOperations() {
    console.log('\\n🧪 Testing Testimonial Operations...');
    
    // Get all testimonials
    console.log('\\n📋 Getting all testimonials...');
    const testimonialsResult = await this.get('/testimonials');
    console.log('Testimonials:', testimonialsResult.data?.testimonials?.length || 0, 'found');
  }

  // Test achievement operations
  async testAchievementOperations() {
    console.log('\\n🧪 Testing Achievement Operations...');
    
    // Get all achievements
    console.log('\\n📋 Getting all achievements...');
    const achievementsResult = await this.get('/achievements', true); // use auth to see all
    console.log('Achievements:', achievementsResult.data?.achievements?.length || 0, 'found');

    // Create a new achievement
    console.log('\\n➕ Creating new achievement...');
    const newAchievement = {
      title: 'Test Achievement from Tester',
      description: 'A great test achievement',
      date_achieved: new Date().toISOString().split('T')[0],
      category: 'Testing',
      is_featured: true
    };
    
    const createResult = await this.post('/achievements', newAchievement, true);
    if (createResult.success) {
      console.log('✅ Achievement created successfully, ID:', createResult.data?.achievement?.id);
      
      const achievementId = createResult.data.achievement.id;
      
      // Get single achievement
      console.log('\\n👤 Getting single achievement...');
      const singleResult = await this.get(`/achievements/${achievementId}`, true);
      console.log('Single achievement:', singleResult.success ? '✅ Found' : '❌ Not found');
      
      // Update the achievement
      console.log('\\n✏️ Updating achievement...');
      const updateData = { description: 'Updated description' };
      const updateResult = await this.put(`/achievements/${achievementId}`, updateData, true);
      console.log('Update result:', updateResult.success ? '✅ Success' : '❌ Failed');
      
      // Delete the achievement
      console.log('\\n🗑️ Deleting test achievement...');
      const deleteResult = await this.delete(`/achievements/${achievementId}`, true);
      console.log('Delete result:', deleteResult.success ? '✅ Success' : '❌ Failed');
    } else {
      console.error('❌ Failed to create achievement:', createResult.message);
    }
  }

  // Test facility operations
  async testFacilityOperations() {
    console.log('\\n🧪 Testing Facility Operations...');
    
    // Get all facilities
    console.log('\\n📋 Getting all facilities...');
    const facilitiesResult = await this.get('/facilities', true); // use auth to see all
    console.log('Facilities:', facilitiesResult.data?.facilities?.length || 0, 'found');

    // Create a new facility
    console.log('\\n➕ Creating new facility...');
    const newFacility = {
      title: 'Test Facility from Tester',
      description: 'A great test facility',
      short_description: 'Test short desc',
      features: ['Feature 1', 'Feature 2'],
      icon: '🏆',
      display_order: 99
    };
    
    const createResult = await this.post('/facilities', newFacility, true);
    if (createResult.success) {
      console.log('✅ Facility created successfully, ID:', createResult.data?.facility?.id);
      
      const facilityId = createResult.data.facility.id;
      
      // Get single facility
      console.log('\\n👤 Getting single facility...');
      const singleResult = await this.get(`/facilities/${facilityId}`, true);
      console.log('Single facility:', singleResult.success ? '✅ Found' : '❌ Not found');
      
      // Update the facility
      console.log('\\n✏️ Updating facility...');
      const updateData = { is_active: false };
      const updateResult = await this.put(`/facilities/${facilityId}`, updateData, true);
      console.log('Update result:', updateResult.success ? '✅ Success' : '❌ Failed');
      
      // Delete the facility
      console.log('\\n🗑️ Deleting test facility...');
      const deleteResult = await this.delete(`/facilities/${facilityId}`, true);
      console.log('Delete result:', deleteResult.success ? '✅ Success' : '❌ Failed');
    } else {
      console.error('❌ Failed to create facility:', createResult.message);
    }
  }

  // Bulk upload students from JSON file
  async bulkUploadStudents(filePath: string) {
    try {
      console.log(`\\n📤 Bulk uploading students from ${filePath}...`);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const jsonData = fs.readFileSync(filePath, 'utf8');
      const students = JSON.parse(jsonData);

      let successCount = 0;
      let errorCount = 0;

      for (const student of students) {
        try {
          const result = await this.post('/students', student);
          if (result.success) {
            successCount++;
            console.log(`✅ Student "${student.name}" uploaded successfully`);
          } else {
            errorCount++;
            console.log(`❌ Failed to upload "${student.name}":`, result.message);
          }
        } catch (error) {
          errorCount++;
          console.log(`❌ Error uploading "${student.name}":`, error);
        }
      }

      console.log(`\\n📊 Bulk upload completed:`);
      console.log(`   ✅ Success: ${successCount}`);
      console.log(`   ❌ Errors: ${errorCount}`);
      console.log(`   📝 Total: ${students.length}`);

    } catch (error) {
      console.error('❌ Bulk upload error:', error);
    }
  }

  // Export data from API
  async exportData(endpoint: string, filename: string) {
    try {
      console.log(`\\n📥 Exporting data from ${endpoint}...`);
      
      const result = await this.get(endpoint, true);
      if (result.success) {
        const exportDir = './exports';
        if (!fs.existsSync(exportDir)) {
          fs.mkdirSync(exportDir, { recursive: true });
        }
        
        const filePath = path.join(exportDir, `${filename}_${new Date().toISOString().split('T')[0]}.json`);
        fs.writeFileSync(filePath, JSON.stringify(result.data, null, 2));
        
        console.log(`✅ Data exported to ${filePath}`);
        return filePath;
      } else {
        throw new Error(`Failed to fetch data: ${result.message}`);
      }
    } catch (error) {
      console.error(`❌ Export error:`, error);
      throw error;
    }
  }

  // Test server health
  async testHealth() {
    try {
      const response = await fetch('https://cricket-web-ace-academy.onrender.com/health');
      const result = await response.json() as APIResponse;
      return result.success;
    } catch (error) {
      return false;
    }
  }
}

// Command line interface
async function main() {
  const apiTester = new APITester();
  const command = process.argv[2];
  
  try {
    // Check if server is running
    const isHealthy = await apiTester.testHealth();
    if (!isHealthy) {
      console.error('❌ Server is not running or not responding. Please start the backend server first.');
      return;
    }
    
    console.log('✅ Server is running');
    
    switch (command) {
      case 'test':
        // Login first
        if (!await apiTester.login()) {
          console.error('Aborting tests due to login failure.');
          return;
        }
        
        // Run all tests
        await apiTester.testStudentOperations();
        await apiTester.testProgramOperations();
        await apiTester.testCoachOperations();
        await apiTester.testTestimonialOperations();
        await apiTester.testAchievementOperations();
        await apiTester.testFacilityOperations();
        break;
        
      case 'upload-students':
        if (!await apiTester.login()) {
          return;
        }
        const filePath = process.argv[3] || './src/scripts/sample-students.json';
        await apiTester.bulkUploadStudents(filePath);
        break;
        
      case 'export':
        if (!await apiTester.login()) {
          return;
        }
        const endpoint = process.argv[3];
        const filename = process.argv[4];
        if (!endpoint || !filename) {
          console.error('❌ Usage: npm run api-test export <endpoint> <filename>');
          return;
        }
        await apiTester.exportData(endpoint, filename);
        break;
        
      case 'login':
        await apiTester.login();
        break;
        
      default:
        console.log(`
🛠️  API Tester Commands:
  
  npm run api-test test                          - Run all API tests
  npm run api-test login                         - Test admin login
  npm run api-test upload-students [filePath]    - Bulk upload students from JSON
  npm run api-test export <endpoint> <filename>  - Export data to JSON
        `);
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Export the class
export { APITester };

// Run main if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
