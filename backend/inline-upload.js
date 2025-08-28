import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function uploadDataInline() {
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

    // Programs data inline
    const programsData = [
      {
        title: "Group Training",
        description: "Ideal for players looking to build strong fundamentals. Develops skills, teamwork, and match awareness through structured group sessions.",
        short_description: "Build strong fundamentals with team-focused training",
        price: 8000.00,
        duration: "1 month",
        age_group: "All ages",
        skill_level: "beginner",
        max_participants: 25,
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Personalized Training",
        description: "Designed for players who want individualized guidance. Enhances technique, confidence and match performance through customized coaching.",
        short_description: "Individual coaching for technique enhancement",
        price: 15000.00,
        duration: "1 month",
        age_group: "12+ years",
        skill_level: "intermediate",
        max_participants: 10,
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "One-on-One Elite Coaching",
        description: "Tailored coaching to refine techniques and game awareness. Master coach guidance for advanced skill development and tournament preparation.",
        short_description: "Elite coaching for advanced skill development",
        price: 25000.00,
        duration: "Flexible",
        age_group: "14+ years",
        skill_level: "advanced",
        max_participants: 5,
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Corporate Cricket Program",
        description: "Designed for corporate teams to improve cricket skills and team dynamics. Blends fitness, strategy and leadership in a fun, engaging format.",
        short_description: "Corporate team building through cricket",
        price: 20000.00,
        duration: "1 month",
        age_group: "22+ years",
        skill_level: "all",
        max_participants: 20,
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ];

    // Coaches data inline
    const coachesData = [
      {
        name: "Coach Vikram",
        bio: "Experienced group training specialist with 10 years in cricket coaching. Expert in building strong fundamentals and team dynamics.",
        specialization: "Group Training, Team Development, Fundamentals",
        experience_years: 10,
        phone: "+91 9908008425",
        email: "vikram@kalyancricketacademy.com",
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Coach Priya",
        bio: "Specialist in personalized training with 12 years of experience in technique analysis and individual skill development.",
        specialization: "Personalized Training, Technique Analysis, Video Analysis",
        experience_years: 12,
        phone: "+91 9908008426",
        email: "priya@kalyancricketacademy.com",
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1494790108755-2616c95e8b73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Coach Rajesh",
        bio: "Elite performance coach with 15 years of experience in advanced techniques and tournament preparation. Former state-level player.",
        specialization: "Elite Performance, Advanced Techniques, Tournament Preparation",
        experience_years: 15,
        phone: "+91 9908008427",
        email: "rajesh@kalyancricketacademy.com",
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Coach Arjun",
        bio: "Corporate training specialist with 8 years of experience in team building and leadership development through cricket.",
        specialization: "Corporate Training, Team Building, Leadership Development",
        experience_years: 8,
        phone: "+91 9908008428",
        email: "arjun@kalyancricketacademy.com",
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ];

    // Achievements data inline
    const achievementsData = [
      {
        title: "State Team Selection",
        description: "5 of our students were selected for the state cricket team in 2023, showcasing our academy's excellence in training.",
        date_achieved: "2023-06-15",
        category: "Team Selection",
        image_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_featured: true
      },
      {
        title: "IPL Selection",
        description: "Two of our academy graduates were picked in the IPL auction, marking a significant milestone in their professional careers.",
        date_achieved: "2022-12-20",
        category: "Professional",
        image_url: "https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_featured: true
      },
      {
        title: "Under-18 National Team",
        description: "Three students selected for the Under-18 National Cricket Team, representing our academy at the highest youth level.",
        date_achieved: "2023-08-10",
        category: "Youth",
        image_url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_featured: true
      },
      {
        title: "Best Cricket Academy",
        description: "Awarded as the Best Cricket Academy in the region for 2023, recognizing our commitment to excellence in cricket training.",
        date_achieved: "2023-01-15",
        category: "Academy",
        image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        is_featured: true
      }
    ];

    // Facilities data inline
    const facilitiesData = [
      {
        title: "High-Performance Practice Nets",
        description: "15 nets with Turf, Astro-Turf, Cement & Matting surfaces. Train in diverse conditions to improve batting, bowling & adaptability.",
        short_description: "15 professional nets with multiple surface types",
        features: JSON.stringify(["15 professional nets", "Multiple surface types", "Turf & Astro-Turf", "Cement & Matting surfaces"]),
        icon: "🏏",
        is_active: true,
        display_order: 1
      },
      {
        title: "All-Weather Indoor Cricket Nets",
        description: "Indoor practice for uninterrupted training, rain or shine. Perfect for skill refinement, technical drills & high-intensity sessions.",
        short_description: "Weather-proof indoor training facility",
        features: JSON.stringify(["Weather-proof training", "Technical drill focus", "High-intensity sessions", "Year-round availability"]),
        icon: "🏠",
        is_active: true,
        display_order: 2
      },
      {
        title: "Floodlit Nets & Ground",
        description: "Evening & night practice with professional floodlit setup. Enhances visibility, reflexes & adaptability to different lighting conditions.",
        short_description: "Professional floodlit training facility",
        features: JSON.stringify(["Professional floodlights", "Evening & night practice", "Enhanced visibility training", "Reflex improvement"]),
        icon: "💡",
        is_active: true,
        display_order: 3
      },
      {
        title: "Full-Fledged Match Ground",
        description: "International-standard ground for matches & professional training. Ideal for team games, simulations & skill enhancement.",
        short_description: "International standard match ground",
        features: JSON.stringify(["International standards", "Match simulations", "Team games", "Professional training"]),
        icon: "🏟️",
        is_active: true,
        display_order: 4
      }
    ];

    // Gallery data inline
    const galleryData = [
      {
        title: "Training Session - Batting Practice",
        description: "Students practicing batting techniques under professional guidance",
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "training",
        is_featured: true,
        display_order: 1
      },
      {
        title: "Match Day - Inter Academy Tournament",
        description: "Competitive match during inter-academy tournament",
        image_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "matches",
        is_featured: true,
        display_order: 2
      },
      {
        title: "Academy Facilities - Practice Nets",
        description: "State-of-the-art practice nets for skill development",
        image_url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "facilities",
        is_featured: false,
        display_order: 3
      },
      {
        title: "Award Ceremony - Best Academy 2023",
        description: "Receiving the Best Cricket Academy award for 2023",
        image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "events",
        is_featured: true,
        display_order: 4
      }
    ];

    // Upload Programs
    console.log('\n📤 Uploading Programs...');
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
    const tables = ['students', 'programs', 'coaches', 'achievements', 'facilities', 'gallery_images'];
    console.log('\n📊 Final Database Statistics:');
    for (const table of tables) {
      const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`   ${table}: ${rows[0].count} records`);
    }

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔐 Database connection closed');
    }
  }
}

uploadDataInline();
