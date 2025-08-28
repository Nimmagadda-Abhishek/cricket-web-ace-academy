import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function uploadData() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cricket_academy'
    });

    console.log('✅ Connected to database successfully');

    // Upload Programs
    console.log('\n📤 Uploading Programs...');
    const programsData = JSON.parse(fs.readFileSync('src/scripts/frontend-programs.json', 'utf8'));
    
    for (const program of programsData) {
      try {
        const [result] = await connection.execute(
          `INSERT INTO programs (title, description, short_description, price, duration, age_group, skill_level, max_participants, is_active, image_url, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            program.title,
            program.description,
            program.short_description,
            program.price,
            program.duration,
            program.age_group,
            program.skill_level,
            program.max_participants,
            program.is_active,
            program.image_url
          ]
        );
        console.log(`✅ Inserted program: ${program.title} (ID: ${result.insertId})`);
      } catch (error) {
        console.log(`❌ Failed to insert program ${program.title}: ${error.message}`);
      }
    }

    // Upload Coaches
    console.log('\n📤 Uploading Coaches...');
    const coachesData = JSON.parse(fs.readFileSync('src/scripts/frontend-coaches.json', 'utf8'));
    
    for (const coach of coachesData) {
      try {
        const [result] = await connection.execute(
          `INSERT INTO coaches (name, bio, specialization, experience_years, phone, email, is_active, image_url, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            coach.name,
            coach.bio,
            coach.specialization,
            coach.experience_years,
            coach.phone,
            coach.email,
            coach.is_active,
            coach.image_url
          ]
        );
        console.log(`✅ Inserted coach: ${coach.name} (ID: ${result.insertId})`);
      } catch (error) {
        console.log(`❌ Failed to insert coach ${coach.name}: ${error.message}`);
      }
    }

    // Upload Achievements
    console.log('\n📤 Uploading Achievements...');
    const achievementsData = JSON.parse(fs.readFileSync('src/scripts/frontend-achievements.json', 'utf8'));
    
    for (const achievement of achievementsData) {
      try {
        const [result] = await connection.execute(
          `INSERT INTO achievements (title, description, date_achieved, category, image_url, is_featured, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            achievement.title,
            achievement.description,
            achievement.date_achieved,
            achievement.category,
            achievement.image_url,
            achievement.is_featured
          ]
        );
        console.log(`✅ Inserted achievement: ${achievement.title} (ID: ${result.insertId})`);
      } catch (error) {
        console.log(`❌ Failed to insert achievement ${achievement.title}: ${error.message}`);
      }
    }

    // Upload Facilities
    console.log('\n📤 Uploading Facilities...');
    const facilitiesData = JSON.parse(fs.readFileSync('src/scripts/frontend-facilities.json', 'utf8'));
    
    for (const facility of facilitiesData) {
      try {
        const [result] = await connection.execute(
          `INSERT INTO facilities (title, description, short_description, features, icon, is_active, display_order, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            facility.title,
            facility.description,
            facility.short_description,
            facility.features,
            facility.icon,
            facility.is_active,
            facility.display_order
          ]
        );
        console.log(`✅ Inserted facility: ${facility.title} (ID: ${result.insertId})`);
      } catch (error) {
        console.log(`❌ Failed to insert facility ${facility.title}: ${error.message}`);
      }
    }

    // Upload Gallery Images
    console.log('\n📤 Uploading Gallery Images...');
    const galleryData = JSON.parse(fs.readFileSync('src/scripts/frontend-gallery.json', 'utf8'));
    
    for (const image of galleryData) {
      try {
        const [result] = await connection.execute(
          `INSERT INTO gallery_images (title, description, image_url, category, is_featured, display_order, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            image.title,
            image.description,
            image.image_url,
            image.category,
            image.is_featured,
            image.display_order
          ]
        );
        console.log(`✅ Inserted gallery image: ${image.title} (ID: ${result.insertId})`);
      } catch (error) {
        console.log(`❌ Failed to insert gallery image ${image.title}: ${error.message}`);
      }
    }

    console.log('\n🎉 Upload completed! Checking results...');
    
    // Verify the upload
    const tables = ['programs', 'coaches', 'achievements', 'facilities', 'gallery_images'];
    for (const table of tables) {
      const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`📊 ${table}: ${rows[0].count} records`);
    }

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔐 Database connection closed');
    }
  }
}

uploadData();
