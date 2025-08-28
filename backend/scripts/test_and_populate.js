const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'sql12.freesqldatabase.com',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'sql12796347',
    password: process.env.DB_PASSWORD || 'E2r5rL2UWc',
    database: process.env.DB_NAME || 'sql12796347'
};

// Test data
const facilitiesData = [
    {
        title: '15 Practice Nets',
        description: '15 high-performance practice nets with a variety of surfaces, including turf, astro-turf, cement, and matting, to simulate different match conditions. Equipped with LED floodlights for training after dark.',
        short_description: '15 high-performance practice nets with various surfaces and floodlights.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.15-PM-1.jpeg',
        features: JSON.stringify(['Turf Surface', 'Astro-turf Surface', 'Cement Surface', 'Matting Surface', 'LED Floodlights', 'Night Training']),
        icon: '🏏',
        display_order: 1
    },
    {
        title: 'Professional Turf Ground',
        description: 'A full-size cricket ground with a premium turf wicket is available for matches and practice games. It includes professional boundary ropes, a scoreboard, a PA system, and seating for spectators.',
        short_description: 'Full-size cricket ground with premium turf wicket and professional amenities.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.14-PM.jpeg',
        features: JSON.stringify(['Premium Turf Wicket', 'Professional Boundary Ropes', 'Digital Scoreboard', 'PA System', 'Spectator Seating']),
        icon: '🏟️',
        display_order: 2
    },
    {
        title: 'Indoor Training Hall',
        description: 'A 3,000 sq ft, climate-controlled indoor facility allows for training to continue year-round, regardless of the weather. It features synthetic wicket strips and a bowling machine setup.',
        short_description: '3,000 sq ft climate-controlled indoor facility with synthetic wickets and bowling machine.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.15-PM.jpeg',
        features: JSON.stringify(['Climate Controlled', 'Synthetic Wicket Strips', 'Bowling Machine', 'Year-round Training']),
        icon: '🏢',
        display_order: 3
    }
];

const achievementsData = [
    {
        title: 'IPL Player Development',
        description: 'Multiple academy players have been selected for the Indian Premier League (IPL), showcasing the quality of training and development programs.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/4-1.jpg',
        date_achieved: '2023-03-15',
        category: 'Professional',
        is_featured: 1
    },
    {
        title: 'Under-19 National Team Selection',
        description: 'Several players from the academy have been selected for the Under-19 National Team, representing India in international competitions.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/3-2.jpg',
        date_achieved: '2023-02-20',
        category: 'National',
        is_featured: 1
    },
    {
        title: 'Best Cricket Academy Award 2023',
        description: 'Kalyan Cricket Academy was recognized as the "Best Cricket Academy" by the Cricket Association for excellence in training and player development.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/1-4.jpg',
        date_achieved: '2023-01-25',
        category: 'Award',
        is_featured: 1
    }
];

const galleryData = [
    {
        title: 'Training Session',
        description: 'Students practicing batting techniques',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/training-1.jpg',
        category: 'Training',
        is_featured: 1,
        display_order: 1
    },
    {
        title: 'Match Day',
        description: 'Academy team in action during a match',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/match-1.jpg',
        category: 'Matches',
        is_featured: 1,
        display_order: 2
    },
    {
        title: 'Facilities Overview',
        description: 'Overview of our world-class facilities',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/facilities-1.jpg',
        category: 'Facilities',
        is_featured: 0,
        display_order: 3
    }
];

async function testDatabaseConnection() {
    console.log('🔍 Testing database connection...');
    console.log('Database config:', {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        database: dbConfig.database
    });

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Database connection successful');
        
        // Test basic query
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Database query test successful:', rows[0]);
        
        return connection;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return null;
    }
}

async function checkTables(connection) {
    console.log('\n🔍 Checking database tables...');
    
    const tables = ['facilities', 'achievements', 'gallery'];
    
    for (const table of tables) {
        try {
            const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
            if (rows.length > 0) {
                console.log(`✅ Table '${table}' exists`);
                
                // Check table structure
                const [columns] = await connection.execute(`DESCRIBE ${table}`);
                console.log(`   Columns: ${columns.map(col => col.Field).join(', ')}`);
                
                // Check record count
                const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`   Records: ${count[0].count}`);
            } else {
                console.log(`❌ Table '${table}' does not exist`);
            }
        } catch (error) {
            console.error(`❌ Error checking table '${table}':`, error.message);
        }
    }
}

async function createTables(connection) {
    console.log('\n🛠️  Creating missing tables...');
    
    const createFacilitiesTable = `
        CREATE TABLE IF NOT EXISTS facilities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            short_description TEXT,
            image_url TEXT,
            features JSON,
            icon VARCHAR(50),
            display_order INT DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    
    const createAchievementsTable = `
        CREATE TABLE IF NOT EXISTS achievements (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            image_url TEXT,
            date_achieved DATE,
            category VARCHAR(100),
            is_featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    
    const createGalleryTable = `
        CREATE TABLE IF NOT EXISTS gallery (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            image_url TEXT NOT NULL,
            category VARCHAR(100),
            is_featured BOOLEAN DEFAULT FALSE,
            display_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    
    try {
        await connection.execute(createFacilitiesTable);
        console.log('✅ Facilities table created/verified');
        
        await connection.execute(createAchievementsTable);
        console.log('✅ Achievements table created/verified');
        
        await connection.execute(createGalleryTable);
        console.log('✅ Gallery table created/verified');
    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
    }
}

async function populateData(connection) {
    console.log('\n📝 Populating data...');
    
    // Insert facilities
    console.log('Adding facilities...');
    for (const facility of facilitiesData) {
        try {
            const [existing] = await connection.execute(
                'SELECT id FROM facilities WHERE title = ?',
                [facility.title]
            );
            
            if (existing.length === 0) {
                await connection.execute(
                    `INSERT INTO facilities (title, description, short_description, image_url, features, icon, display_order, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                    [
                        facility.title,
                        facility.description,
                        facility.short_description,
                        facility.image_url,
                        facility.features,
                        facility.icon,
                        facility.display_order
                    ]
                );
                console.log(`✅ Added facility: ${facility.title}`);
            } else {
                console.log(`⏭️  Facility already exists: ${facility.title}`);
            }
        } catch (error) {
            console.error(`❌ Error adding facility ${facility.title}:`, error.message);
        }
    }
    
    // Insert achievements
    console.log('\nAdding achievements...');
    for (const achievement of achievementsData) {
        try {
            const [existing] = await connection.execute(
                'SELECT id FROM achievements WHERE title = ?',
                [achievement.title]
            );
            
            if (existing.length === 0) {
                await connection.execute(
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
                console.log(`✅ Added achievement: ${achievement.title}`);
            } else {
                console.log(`⏭️  Achievement already exists: ${achievement.title}`);
            }
        } catch (error) {
            console.error(`❌ Error adding achievement ${achievement.title}:`, error.message);
        }
    }
    
    // Insert gallery items
    console.log('\nAdding gallery items...');
    for (const galleryItem of galleryData) {
        try {
            const [existing] = await connection.execute(
                'SELECT id FROM gallery WHERE title = ?',
                [galleryItem.title]
            );
            
            if (existing.length === 0) {
                await connection.execute(
                    `INSERT INTO gallery (title, description, image_url, category, is_featured, display_order, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                    [
                        galleryItem.title,
                        galleryItem.description,
                        galleryItem.image_url,
                        galleryItem.category,
                        galleryItem.is_featured,
                        galleryItem.display_order
                    ]
                );
                console.log(`✅ Added gallery item: ${galleryItem.title}`);
            } else {
                console.log(`⏭️  Gallery item already exists: ${galleryItem.title}`);
            }
        } catch (error) {
            console.error(`❌ Error adding gallery item ${galleryItem.title}:`, error.message);
        }
    }
}

async function verifyData(connection) {
    console.log('\n🔍 Verifying data...');
    
    try {
        const [facilities] = await connection.execute('SELECT COUNT(*) as count FROM facilities');
        console.log(`✅ Facilities count: ${facilities[0].count}`);
        
        const [achievements] = await connection.execute('SELECT COUNT(*) as count FROM achievements');
        console.log(`✅ Achievements count: ${achievements[0].count}`);
        
        const [gallery] = await connection.execute('SELECT COUNT(*) as count FROM gallery');
        console.log(`✅ Gallery count: ${gallery[0].count}`);
        
        // Show sample data
        console.log('\nSample data:');
        const [sampleFacilities] = await connection.execute('SELECT title FROM facilities LIMIT 3');
        console.log('Facilities:', sampleFacilities.map(f => f.title).join(', '));
        
        const [sampleAchievements] = await connection.execute('SELECT title FROM achievements LIMIT 3');
        console.log('Achievements:', sampleAchievements.map(a => a.title).join(', '));
        
        const [sampleGallery] = await connection.execute('SELECT title FROM gallery LIMIT 3');
        console.log('Gallery:', sampleGallery.map(g => g.title).join(', '));
        
    } catch (error) {
        console.error('❌ Error verifying data:', error.message);
    }
}

async function main() {
    console.log('🚀 Starting database diagnosis and population...\n');
    
    const connection = await testDatabaseConnection();
    if (!connection) {
        console.error('❌ Cannot proceed without database connection');
        return;
    }
    
    try {
        await checkTables(connection);
        await createTables(connection);
        await populateData(connection);
        await verifyData(connection);
        
        console.log('\n✅ Database setup and population completed successfully!');
        console.log('🎯 You can now test the API endpoints:');
        console.log('   - GET /api/facilities');
        console.log('   - GET /api/achievements');
        console.log('   - GET /api/gallery');
        
    } catch (error) {
        console.error('❌ Error during setup:', error.message);
    } finally {
        await connection.end();
        console.log('🔌 Database connection closed');
    }
}

main().catch(console.error);
