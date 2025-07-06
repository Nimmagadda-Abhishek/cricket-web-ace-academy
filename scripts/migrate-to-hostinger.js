/**
 * Migration script to move data from Supabase to Hostinger MySQL database
 * 
 * Usage:
 * 1. Set up environment variables in .env file:
 *    - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY (for source)
 *    - HOSTINGER_DB_HOST, HOSTINGER_DB_USER, HOSTINGER_DB_PASSWORD, HOSTINGER_DB_NAME (for target)
 * 2. Run: node scripts/migrate-to-hostinger.js
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config();

// Source: Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin access

// Target: Hostinger MySQL configuration
const hostingerConfig = {
  host: process.env.HOSTINGER_DB_HOST,
  user: process.env.HOSTINGER_DB_USER,
  password: process.env.HOSTINGER_DB_PASSWORD,
  database: process.env.HOSTINGER_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Initialize Supabase client with service key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tables to migrate
const TABLES = [
  'programs',
  'contacts',
  'enrollments',
  'students',
  'coaches',
  'users'
];

// Main migration function
async function migrateData() {
  console.log('Starting migration from Supabase to Hostinger MySQL...');
  
  try {
    // Connect to Hostinger MySQL
    const connection = await mysql.createConnection(hostingerConfig);
    console.log('Connected to Hostinger MySQL database');
    
    // Migrate each table
    for (const table of TABLES) {
      try {
        console.log(`\nMigrating table: ${table}`);
        
        // Fetch data from Supabase
        const { data, error } = await supabase.from(table).select('*');
        
        if (error) {
          console.error(`Error fetching data from ${table}:`, error);
          continue;
        }
        
        if (!data || data.length === 0) {
          console.log(`No data found in ${table} table. Skipping...`);
          continue;
        }
        
        console.log(`Found ${data.length} records in ${table}`);
        
        // Process data for MySQL
        const processedData = data.map(record => {
          const newRecord = { ...record };
          
          // Convert JSON fields to strings for MySQL
          for (const [key, value] of Object.entries(newRecord)) {
            if (value !== null && typeof value === 'object') {
              newRecord[key] = JSON.stringify(value);
            }
          }
          
          return newRecord;
        });
        
        // Insert data into Hostinger MySQL
        for (const record of processedData) {
          const columns = Object.keys(record).join(', ');
          const placeholders = Object.keys(record).map(() => '?').join(', ');
          const values = Object.values(record);
          
          const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
          
          try {
            await connection.execute(query, values);
          } catch (insertError) {
            console.error(`Error inserting record into ${table}:`, insertError);
            console.error('Record:', record);
          }
        }
        
        console.log(`Successfully migrated ${processedData.length} records to ${table}`);
      } catch (tableError) {
        console.error(`Error migrating table ${table}:`, tableError);
      }
    }
    
    // Close connection
    await connection.end();
    console.log('\nMigration completed!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateData();