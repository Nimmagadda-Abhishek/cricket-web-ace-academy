import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'http://localhost:5000/api';
const WEBSITE_URL = 'https://kalyancricketacademy.in';

// Updated facilities data from Kalyan Cricket Academy
const facilitiesData = [
    {
        title: '15 Practice Nets',
        description: '15 high-performance practice nets with a variety of surfaces, including turf, astro-turf, cement, and matting, to simulate different match conditions. Equipped with LED floodlights for training after dark.',
        short_description: '15 high-performance practice nets with various surfaces and floodlights.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.15-PM-1.jpeg',
        features: ['Turf Surface', 'Astro-turf Surface', 'Cement Surface', 'Matting Surface', 'LED Floodlights', 'Night Training'],
        icon: '🏏',
        display_order: 1
    },
    {
        title: 'Professional Turf Ground',
        description: 'A full-size cricket ground with a premium turf wicket is available for matches and practice games. It includes professional boundary ropes, a scoreboard, a PA system, and seating for spectators.',
        short_description: 'Full-size cricket ground with premium turf wicket and professional amenities.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.14-PM.jpeg',
        features: ['Premium Turf Wicket', 'Professional Boundary Ropes', 'Digital Scoreboard', 'PA System', 'Spectator Seating', 'Match Quality Ground'],
        icon: '🏟️',
        display_order: 2
    },
    {
        title: 'Indoor Training Hall',
        description: 'A 3,000 sq ft, climate-controlled indoor facility allows for training to continue year-round, regardless of the weather. It features synthetic wicket strips and a bowling machine setup.',
        short_description: '3,000 sq ft climate-controlled indoor facility with synthetic wickets and bowling machine.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.15-PM.jpeg',
        features: ['Climate Controlled', 'Synthetic Wicket Strips', 'Bowling Machine', 'Year-round Training', 'Weather Independent'],
        icon: '🏢',
        display_order: 3
    },
    {
        title: 'Modern Fitness Center',
        description: 'The academy has a fully equipped gym with equipment specifically for cricket training. Professional trainers are available to guide players through strength, agility, and cardio programs.',
        short_description: 'Fully equipped gym with cricket-specific training equipment and professional trainers.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/2-2.jpg',
        features: ['Cricket-specific Equipment', 'Professional Trainers', 'Strength Training', 'Agility Programs', 'Cardio Programs', 'Fitness Assessment'],
        icon: '🏋️',
        display_order: 4
    },
    {
        title: 'Video Analysis Technology',
        description: 'The academy utilizes advanced technology such as video analysis to track and improve player performance. High-speed cameras capture batting and bowling techniques for detailed analysis.',
        short_description: 'Advanced video analysis technology to track and improve player performance.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/1-3.jpg',
        features: ['High-speed Cameras', 'Performance Tracking', 'Technique Analysis', 'Slow Motion Replay', 'Technical Improvement'],
        icon: '📹',
        display_order: 5
    },
    {
        title: 'Residential Accommodation',
        description: 'Comfortable residential facilities for outstation players with modern amenities, nutritious meals, and a conducive environment for focused training.',
        short_description: 'Comfortable residential facilities for outstation players with modern amenities.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/accommodation.jpg',
        features: ['Modern Rooms', 'Nutritious Meals', 'Study Areas', 'Recreation Facilities', 'Security', '24/7 Support'],
        icon: '🏠',
        display_order: 6
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

// Function to download and save images
async function downloadImage(imageUrl, filename) {
    try {
        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'stream'
        });

        const uploadsDir = path.join(__dirname, '..', 'uploads', 'kalyan-images');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, filename);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`Downloaded: ${filename}`);
                resolve(filePath);
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading image ${imageUrl}:`, error.message);
        return null;
    }
}

// Function to login and get auth token
async function login() {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            username: 'admin',
            password: 'password'
        });
        console.log('Login successful');
        return response.data.data.accessToken;
    } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
        return null;
    }
}

// Function to add facility to database
async function addFacility(token, facility) {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.post(`${API_BASE_URL}/facilities`, facility, { headers });
        console.log(`✅ Successfully added facility: ${facility.title}`);
        return response.data.data.facility;
    } catch (error) {
        if (error.response?.status === 409) {
            console.log(`⚠️  Facility already exists: ${facility.title}`);
        } else {
            console.error(`❌ Error adding facility: ${facility.title}`, error.response ? error.response.data : error.message);
        }
        return null;
    }
}

// Function to add achievement to database
async function addAchievement(token, achievement) {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.post(`${API_BASE_URL}/achievements`, achievement, { headers });
        console.log(`✅ Successfully added achievement: ${achievement.title}`);
        return response.data.data.achievement;
    } catch (error) {
        if (error.response?.status === 409) {
            console.log(`⚠️  Achievement already exists: ${achievement.title}`);
        } else {
            console.error(`❌ Error adding achievement: ${achievement.title}`, error.response ? error.response.data : error.message);
        }
        return null;
    }
}

// Function to get existing facilities
async function getExistingFacilities(token) {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_BASE_URL}/facilities?limit=100`, { headers });
        return response.data.data.facilities || [];
    } catch (error) {
        console.error('Error fetching existing facilities:', error.message);
        return [];
    }
}

// Function to get existing achievements
async function getExistingAchievements(token) {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_BASE_URL}/achievements?limit=100`, { headers });
        return response.data.data.achievements || [];
    } catch (error) {
        console.error('Error fetching existing achievements:', error.message);
        return [];
    }
}

// Main function
async function main() {
    console.log('🚀 Starting Kalyan Cricket Academy data collection and update...\n');

    // Login to get auth token
    const token = await login();
    if (!token) {
        console.error('❌ Could not get auth token. Exiting.');
        return;
    }

    // Get existing data to avoid duplicates
    console.log('📋 Checking existing data...');
    const existingFacilities = await getExistingFacilities(token);
    const existingAchievements = await getExistingAchievements(token);

    console.log(`Found ${existingFacilities.length} existing facilities`);
    console.log(`Found ${existingAchievements.length} existing achievements\n`);

    // Download images and update facilities
    console.log('🏗️  Processing facilities...');
    for (const facility of facilitiesData) {
        // Check if facility already exists
        const exists = existingFacilities.some(f => f.title === facility.title);
        if (exists) {
            console.log(`⏭️  Skipping existing facility: ${facility.title}`);
            continue;
        }

        // Download image
        const imageFilename = `facility-${facility.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        const localImagePath = await downloadImage(facility.image_url, imageFilename);
        
        // Update image URL to local path if download successful
        if (localImagePath) {
            facility.image_url = `/uploads/kalyan-images/${imageFilename}`;
        }

        // Add facility to database
        await addFacility(token, facility);
        
        // Add delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Download images and update achievements
    console.log('\n🏆 Processing achievements...');
    for (const achievement of achievementsData) {
        // Check if achievement already exists
        const exists = existingAchievements.some(a => a.title === achievement.title);
        if (exists) {
            console.log(`⏭️  Skipping existing achievement: ${achievement.title}`);
            continue;
        }

        // Download image
        const imageFilename = `achievement-${achievement.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        const localImagePath = await downloadImage(achievement.image_url, imageFilename);
        
        // Update image URL to local path if download successful
        if (localImagePath) {
            achievement.image_url = `/uploads/kalyan-images/${imageFilename}`;
        }

        // Add achievement to database
        await addAchievement(token, achievement);
        
        // Add delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ Data collection and update completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Facilities processed: ${facilitiesData.length}`);
    console.log(`   - Achievements processed: ${achievementsData.length}`);
    console.log('   - Images downloaded to: backend/uploads/kalyan-images/');
}

// Run the script
main().catch(console.error);
