import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cricket_academy',
};

class DatabaseManager {
  private connection: mysql.Connection | null = null;

  async connect() {
    try {
      this.connection = await mysql.createConnection(dbConfig);
      console.log('✅ Database connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('📦 Database connection closed');
    }
  }

  // Get all data from a table with optional conditions
  async getAllData(tableName: string, conditions?: string) {
    try {
      if (!this.connection) throw new Error('No database connection');
      
      let query = `SELECT * FROM ${tableName}`;
      if (conditions) {
        query += ` WHERE ${conditions}`;
      }
      query += ' ORDER BY created_at DESC';
      
      const [rows] = await this.connection.execute(query);
      return rows;
    } catch (error) {
      console.error(`❌ Error fetching data from ${tableName}:`, error);
      throw error;
    }
  }

  // Insert data into a table
  async insertData(tableName: string, data: Record<string, any>) {
    try {
      if (!this.connection) throw new Error('No database connection');
      
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = values.map(() => '?').join(', ');
      
      const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
      const [result] = await this.connection.execute(query, values);
      
      console.log(`✅ Data inserted successfully into ${tableName}`);
      return result;
    } catch (error) {
      console.error(`❌ Error inserting data into ${tableName}:`, error);
      throw error;
    }
  }

  // Update data in a table
  async updateData(tableName: string, data: Record<string, any>, condition: string, conditionValues: any[]) {
    try {
      if (!this.connection) throw new Error('No database connection');
      
      const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), ...conditionValues];
      
      const query = `UPDATE ${tableName} SET ${updates} WHERE ${condition}`;
      const [result] = await this.connection.execute(query, values);
      
      console.log(`✅ Data updated successfully in ${tableName}`);
      return result;
    } catch (error) {
      console.error(`❌ Error updating data in ${tableName}:`, error);
      throw error;
    }
  }

  // Delete data from a table
  async deleteData(tableName: string, condition: string, conditionValues: any[]) {
    try {
      if (!this.connection) throw new Error('No database connection');
      
      const query = `DELETE FROM ${tableName} WHERE ${condition}`;
      const [result] = await this.connection.execute(query, conditionValues);
      
      console.log(`✅ Data deleted successfully from ${tableName}`);
      return result;
    } catch (error) {
      console.error(`❌ Error deleting data from ${tableName}:`, error);
      throw error;
    }
  }

  // Export table data to JSON
  async exportTableToJSON(tableName: string, outputPath?: string) {
    try {
      const data = await this.getAllData(tableName);
      const jsonData = JSON.stringify(data, null, 2);
      
      const filePath = outputPath || `./exports/${tableName}_export_${new Date().toISOString().split('T')[0]}.json`;
      
      // Create exports directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, jsonData);
      console.log(`✅ ${tableName} data exported to ${filePath}`);
      return filePath;
    } catch (error) {
      console.error(`❌ Error exporting ${tableName}:`, error);
      throw error;
    }
  }

  // Import data from JSON file
  async importFromJSON(tableName: string, jsonFilePath: string) {
    try {
      if (!fs.existsSync(jsonFilePath)) {
        throw new Error(`File not found: ${jsonFilePath}`);
      }
      
      const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
      const data = JSON.parse(jsonData);
      
      if (!Array.isArray(data)) {
        throw new Error('JSON data should be an array of objects');
      }
      
      let insertCount = 0;
      for (const record of data) {
        // Remove id field if it exists (let database auto-generate)
        const { id, created_at, updated_at, ...insertData } = record;
        await this.insertData(tableName, insertData);
        insertCount++;
      }
      
      console.log(`✅ Successfully imported ${insertCount} records into ${tableName}`);
      return insertCount;
    } catch (error) {
      console.error(`❌ Error importing data to ${tableName}:`, error);
      throw error;
    }
  }

  // Get database statistics
  async getDatabaseStats() {
    try {
      const tables = [
        'admin_users', 'students', 'coaches', 'programs', 'bookings',
        'testimonials', 'contact_messages', 'settings', 'facilities',
        'gallery_images', 'achievements'
      ];
      
      const stats: Record<string, number> = {};
      
      for (const table of tables) {
        try {
          const [result] = await this.connection!.execute(`SELECT COUNT(*) as count FROM ${table}`);
          stats[table] = (result as any)[0].count;
        } catch (error) {
          stats[table] = 0;
        }
      }
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting database stats:', error);
      throw error;
    }
  }

  // Bulk insert students from CSV-like data
  async bulkInsertStudents(studentsData: any[]) {
    try {
      let insertCount = 0;
      for (const student of studentsData) {
        await this.insertData('students', {
          name: student.name,
          email: student.email || null,
          phone: student.phone || null,
          date_of_birth: student.date_of_birth || null,
          parent_name: student.parent_name,
          parent_phone: student.parent_phone,
          parent_email: student.parent_email || null,
          address: student.address || null,
          emergency_contact: student.emergency_contact || null,
          emergency_phone: student.emergency_phone || null,
          medical_conditions: student.medical_conditions || null,
          created_at: new Date(),
          updated_at: new Date()
        });
        insertCount++;
      }
      console.log(`✅ Successfully inserted ${insertCount} students`);
      return insertCount;
    } catch (error) {
      console.error('❌ Error in bulk student insert:', error);
      throw error;
    }
  }

  // Bulk insert programs
  async bulkInsertPrograms(programsData: any[]) {
    try {
      let insertCount = 0;
      for (const program of programsData) {
        await this.insertData('programs', {
          title: program.title,
          description: program.description || null,
          short_description: program.short_description || null,
          image_url: program.image_url || null,
          price: program.price || null,
          duration: program.duration || null,
          age_group: program.age_group || null,
          skill_level: program.skill_level || 'all',
          max_participants: program.max_participants || null,
          is_active: program.is_active !== false,
          created_at: new Date(),
          updated_at: new Date()
        });
        insertCount++;
      }
      console.log(`✅ Successfully inserted ${insertCount} programs`);
      return insertCount;
    } catch (error) {
      console.error('❌ Error in bulk program insert:', error);
      throw error;
    }
  }
}

// Command line interface
async function main() {
  const dbManager = new DatabaseManager();
  
  const command = process.argv[2];
  const tableName = process.argv[3];
  const param3 = process.argv[4];
  
  try {
    await dbManager.connect();
    
    switch (command) {
      case 'stats':
        const stats = await dbManager.getDatabaseStats();
        console.log('\n📊 Database Statistics:');
        console.table(stats);
        break;
        
      case 'get':
        if (!tableName) {
          console.error('❌ Please provide table name: npm run db-script get <tableName>');
          return;
        }
        const data = await dbManager.getAllData(tableName);
        console.log(`\n📋 Data from ${tableName}:`);
        console.table(data);
        break;
        
      case 'export':
        if (!tableName) {
          console.error('❌ Please provide table name: npm run db-script export <tableName>');
          return;
        }
        await dbManager.exportTableToJSON(tableName, param3);
        break;
        
      case 'import':
        if (!tableName || !param3) {
          console.error('❌ Please provide table name and file path: npm run db-script import <tableName> <jsonFilePath>');
          return;
        }
        await dbManager.importFromJSON(tableName, param3);
        break;
        
      default:
        console.log(`
🛠️  Database Manager Commands:
  
  npm run db-script stats                           - Show database statistics
  npm run db-script get <tableName>                - Get all data from a table
  npm run db-script export <tableName> [filePath]  - Export table to JSON
  npm run db-script import <tableName> <filePath>  - Import JSON data to table
        `);
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  } finally {
    await dbManager.disconnect();
  }
}

// Export the class for use in other scripts
export { DatabaseManager };

// Run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
