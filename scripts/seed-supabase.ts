// Script to seed Supabase database with initial data
import { createClient } from '@supabase/supabase-js';
import { transformProgramToDb } from '../src/services/supabase';

// Import mock data
import { mockPrograms } from './mock-data';

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || 'https://zktgwklzcizpnqqvuilr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''; // Use service key for admin operations

// Check if service key is provided
if (!supabaseKey) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedPrograms() {
  console.log('Seeding programs table...');
  
  // Transform mock programs to database format
  const dbPrograms = mockPrograms.map((program) => {
    const dbProgram = transformProgramToDb(program);
    return {
      ...dbProgram,
      id: program._id, // Use the mock ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
  
  // Insert programs
  const { data, error } = await supabase
    .from('programs')
    .upsert(dbPrograms, { onConflict: 'id' })
    .select();
  
  if (error) {
    console.error('Error seeding programs:', error);
    return;
  }
  
  console.log(`Successfully seeded ${data.length} programs`);
}

async function createTables() {
  console.log('Creating tables if they don\'t exist...');
  
  // Create programs table
  const { error: programsError } = await supabase.rpc('create_programs_table_if_not_exists');
  
  if (programsError) {
    console.error('Error creating programs table:', programsError);
    return false;
  }
  
  // Create contacts table
  const { error: contactsError } = await supabase.rpc('create_contacts_table_if_not_exists');
  
  if (contactsError) {
    console.error('Error creating contacts table:', contactsError);
    return false;
  }
  
  // Create enrollments table
  const { error: enrollmentsError } = await supabase.rpc('create_enrollments_table_if_not_exists');
  
  if (enrollmentsError) {
    console.error('Error creating enrollments table:', enrollmentsError);
    return false;
  }
  
  console.log('Tables created successfully');
  return true;
}

async function main() {
  try {
    // Create tables if they don't exist
    const tablesCreated = await createTables();
    
    if (!tablesCreated) {
      console.error('Failed to create tables. Exiting...');
      process.exit(1);
    }
    
    // Seed programs
    await seedPrograms();
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main();