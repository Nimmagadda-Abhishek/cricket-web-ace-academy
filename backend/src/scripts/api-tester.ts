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
    
    const createResult = await this.post('/students', newStudent);
    if (createResult.success) {
      console.log('✅ Student created successfully, ID:', createResult.data?.student?.id);
      
      // Update the student
      const studentId = createResult.data.student.id;
      console.log('\\n✏️ Updating student...');
      const updateData = { phone: '9876543210' };
      const updateResult = await this.put(`/students/${studentId}`, updateData);
      console.log('Update result:', updateResult.success ? '✅ Success' : '❌ Failed');
      
      // Get single student
      console.log('\\n👤 Getting single student...');
      const singleStudentResult = await this.get(`/students/${studentId}`, true);
      console.log('Single student:', singleStudentResult.success ? '✅ Found' : '❌ Not found');
      
      // Delete the student
      console.log('\\n🗑️ Deleting test student...');
      const deleteResult = await this.delete(`/students/${studentId}`);
      console.log('Delete result:', deleteResult.success ? '✅ Success' : '❌ Failed');
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
        await apiTester.login();
        
        // Run all tests
        await apiTester.testStudentOperations();
        await apiTester.testProgramOperations();
        await apiTester.testCoachOperations();
        await apiTester.testTestimonialOperations();
        break;
        
      case 'upload-students':
        await apiTester.login();
        const filePath = process.argv[3] || './src/scripts/sample-students.json';
        await apiTester.bulkUploadStudents(filePath);
        break;
        
      case 'export':
        await apiTester.login();
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
