import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const dbConfig = {
    host: 'sql12.freesqldatabase.com',
    port: 3306,
    user: 'sql12796347',
    password: 'E2r5rL2UWc',
    database: 'sql12796347'
};

// Updated facilities data from Kalyan Cricket Academy
const facilitiesData = [
    {
        title: '15 Practice Nets',
        description: '15 high-performance practice nets with a variety of surfaces, including turf, astro-turf, cement, and matting, to simulate different match conditions. Equipped with LED floodlights for training after dark.',
        short_description: '15 high-performance practice nets with various surfaces and floodlights.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.15-PM-1.jpeg',
        features: JSON.stringify(['Turf Surface', 'Astro-turf Surface', 'Cement Surface', 'Matting Surface', 'LED Floodlights', 'Night Training']),
        icon: '🏏',
        display_order: 1,
        is_active: true
    },
    {
        title: 'Professional Turf Ground',
        description: 'A full-size cricket ground with a premium turf wicket is available for matches and practice games. It includes professional boundary ropes, a scoreboard, a PA system, and seating for spectators.',
        short_description: 'Full-size cricket ground with premium turf wicket and professional amenities.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.14-PM.jpeg',
        features: JSON.stringify(['Premium Turf Wicket', 'Professional Boundary Ropes', 'Digital Scoreboard', 'PA System', 'Spectator Seating', 'Match Quality Ground']),
        icon: '🏟️',
        display_order: 2,
        is_active: true
    },
    {
        title: 'Indoor Training Hall',
        description: 'A 3,000 sq ft, climate-controlled indoor facility allows for training to continue year-round, regardless of the weather. It features synthetic wicket strips and a bowling machine setup.',
        short_description: '3,000 sq ft climate-controlled indoor facility with synthetic wickets and bowling machine.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.15-PM.jpeg',
        features: JSON.stringify(['Climate Controlled', 'Synthetic Wicket Strips', 'Bowling Machine', 'Year-round Training', 'Weather Independent']),
        icon: '🏢',
        display_order: 3,
        is_active: true
    },
    {
        title: 'Modern Fitness Center',
        description: 'The academy has a fully equipped gym with equipment specifically for cricket training. Professional trainers are available to guide players through strength, agility, and cardio programs.',
        short_description: 'Fully equipped gym with cricket-specific training equipment and professional trainers.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/2-2.jpg',
        features: JSON.stringify(['Cricket-specific Equipment', 'Professional Trainers', 'Strength Training', 'Agility Programs', 'Cardio Programs', 'Fitness Assessment']),
        icon: '🏋️',
        display_order: 4,
        is_active: true
    },
    {
        title: 'Video Analysis Technology',
        description: 'The academy utilizes advanced technology such as video analysis to track and improve player performance. High-speed cameras capture batting and bowling techniques for detailed analysis.',
        short_description: 'Advanced video analysis technology to track and improve player performance.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/1-3.jpg',
        features: JSON.stringify(['High-speed Cameras', 'Performance Tracking', 'Technique Analysis', 'Slow Motion Replay', 'Technical Improvement']),
        icon: '📹',
        display_order: 5,
        is_active: true
    },
    {
        title: 'Residential Accommodation',
        description: 'Comfortable residential facilities for outstation players with modern amenities, nutritious meals, and a conducive environment for focused training.',
        short_description: 'Comfortable residential facilities for outstation players with modern amenities.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/accommodation.jpg',
        features: JSON.stringify(['Modern Rooms', 'Nutritious Meals', 'Study Areas', 'Recreation Facilities', 'Security', '24/7 Support']),
        icon: '🏠',
        display_order: 6,
        is_active: true
    }
];

// Updated achievements data from Kalyan Cricket Academy
const achievementsData = [
    {
        title: 'IPL Player Development',
        description: 'Multiple academy players have been selected for the Indian Premier League (IPL), showcasing the quality of training and development programs.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/4-1.jpg',
        date_achieved: '2023-03-15',
        category: 'Professional',
        is_featured: true
    },
    {
        title: 'Under-19 National Team Selection',
        description: 'Several players from the academy have been selected for the Under-19 National Team, representing India in international competitions.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/3-2.jpg',
        date_achieved: '2023-02-20',
        category: 'National',
        is_featured: true
    },
    {
        title: 'State Team Representation',
        description: 'Over 50 academy players have been selected for various state-level teams across different age groups and formats.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/2-3.jpg',
        date_achieved: '2023-01-10',
        category: 'State',
        is_featured: true
    },
    {
        title: 'Best Cricket Academy Award 2023',
        description: 'Kalyan Cricket Academy was recognized as the "Best Cricket Academy" by the Cricket Association for excellence in training and player development.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/1-4.jpg',
        date_achieved: '2023-01-25',
        category: 'Award',
        is_featured: true
    },
    {
        title: 'Ranji Trophy Players',
        description: 'Academy has produced multiple Ranji Trophy players who have represented their states in the premier domestic cricket tournament.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/ranji-players.jpg',
        date_achieved: '2022-12-01',
        category: 'Domestic',
        is_featured: true
    },
    {
        title: '100+ District Level Selections',
        description: 'Over 100 academy students have been selected for district-level teams, demonstrating consistent talent development.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/district-selections.jpg',
        date_achieved: '2023-04-01',
        category: 'District',
        is_featured: false
    }
];

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database successfully');
        return connection;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return null;
    }
}

async function insertFacilities(connection) {
    console.log('\n🏗️  Inserting facilities...');
    
    for (const facility of facilitiesData) {
        try {
            // Check if facility already exists
            const [existing] = await connection.execute(
                'SELECT id FROM facilities WHERE title = ?',
                [facility.title]
            );
            
            if (existing.length > 0) {
                console.log(`⏭️  Facility already exists: ${facility.title}`);
                continue;
            }
            
            // Insert new facility
            const [result] = await connection.execute(
                `INSERT INTO facilities (title, description, short_description, image_url, features, icon, display_order, is_active, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [
                    facility.title,
                    facility.description,
                    facility.short_description,
                    facility.image_url,
                    facility.features,
                    facility.icon,
                    facility.display_order,
                    facility.is_active
                ]
            );
            
            console.log(`✅ Added facility: ${facility.title} (ID: ${result.insertId})`);
        } catch (error) {
            console.error(`❌ Error adding facility ${facility.title}:`, error.message);
        }
    }
}

async function insertAchievements(connection) {
    console.log('\n🏆 Inserting achievements...');
    
    for (const achievement of achievementsData) {
        try {
            // Check if achievement already exists
            const [existing] = await connection.execute(
                'SELECT id FROM achievements WHERE title = ?',
                [achievement.title]
            );
            
            if (existing.length > 0) {
                console.log(`⏭️  Achievement already exists: ${achievement.title}`);
                continue;
            }
            
            // Insert new achievement
            const [result] = await connection.execute(
                `INSERT INTO achievements (title, description, image_url, date_achieved, category, is_featured, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                [
                    achievement.title,
                    achievement.description,
                    achievement.image_url,
                    achievement.date_achieved,
                    achievement.category,
                    achievement.is_featured
                ]
            );
            
            console.log(`✅ Added achievement: ${achievement.title} (ID: ${result.insertId})`);
        } catch (error) {
            console.error(`❌ Error adding achievement ${achievement.title}:`, error.message);
        }
    }
}

async function main() {
    console.log('🚀 Starting Kalyan Cricket Academy data update...\n');
    
    const connection = await connectToDatabase();
    if (!connection) {
        console.error('❌ Cannot proceed without database connection');
        return;
    }
    
    try {
        await insertFacilities(connection);
        await insertAchievements(connection);
        
        console.log('\n✅ Data update completed successfully!');
        console.log('📊 Summary:');
        console.log(`   - Facilities processed: ${facilitiesData.length}`);
        console.log(`   - Achievements processed: ${achievementsData.length}`);
        
    } catch (error) {
        console.error('❌ Error during data update:', error.message);
    } finally {
        await connection.end();
        console.log('🔌 Database connection closed');
    }
}

// Run the script
main().catch(console.error);
