import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const facilities = [
    {
        title: '15 Practice Nets',
        description: '15 high-performance practice nets with a variety of surfaces, including turf, astro-turf, cement, and matting, to simulate different match conditions. Equipped with LED floodlights for training after dark.',
        short_description: '15 high-performance practice nets with various surfaces and floodlights.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.15-PM-1.jpeg',
        features: ['Turf', 'Astro-turf', 'Cement', 'Matting', 'LED Floodlights'],
        icon: '🏏'
    },
    {
        title: 'Professional Turf Ground',
        description: 'A full-size cricket ground with a premium turf wicket is available for matches and practice games. It includes professional boundary ropes, a scoreboard, a PA system, and seating for spectators.',
        short_description: 'Full-size cricket ground with premium turf wicket and professional amenities.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.14-PM.jpeg',
        features: ['Premium Turf Wicket', 'Boundary Ropes', 'Scoreboard', 'PA System', 'Spectator Seating'],
        icon: '🏟️'
    },
    {
        title: 'Indoor Training Hall',
        description: 'A 3,000 sq ft, climate-controlled indoor facility allows for training to continue year-round, regardless of the weather. It features synthetic wicket strips and a bowling machine setup.',
        short_description: '3,000 sq ft climate-controlled indoor facility with synthetic wickets and bowling machine.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-25-at-2.38.15-PM.jpeg',
        features: ['Climate Controlled', 'Synthetic Wicket Strips', 'Bowling Machine'],
        icon: '🏢'
    },
    {
        title: 'Modern Fitness Center',
        description: 'The academy has a fully equipped gym with equipment specifically for cricket training. Professional trainers are available to guide players through strength, agility, and cardio programs.',
        short_description: 'Fully equipped gym with cricket-specific training equipment and professional trainers.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/2-2.jpg',
        features: ['Cricket-specific equipment', 'Professional trainers', 'Strength, agility, and cardio programs'],
        icon: '🏋️'
    },
    {
        title: 'Video Analysis Technology',
        description: 'The academy utilizes technology such as video analysis to track and improve player performance.',
        short_description: 'Video analysis technology to track and improve player performance.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/1-3.jpg',
        features: ['Performance tracking', 'Technique analysis'],
        icon: '📹'
    }
];

const achievements = [
    {
        title: 'IPL Selection',
        description: 'The academy has had players selected for the Indian Premier League (IPL).',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/4-1.jpg',
        date_achieved: '2023-01-01',
        category: 'Professional',
        is_featured: true
    },
    {
        title: 'Under-18 National Team Selection',
        description: 'Players from the academy have been selected for the Under-18 National Team.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/3-2.jpg',
        date_achieved: '2023-01-01',
        category: 'National',
        is_featured: true
    },
    {
        title: 'State Team Selection',
        description: 'The academy has seen its players selected for state-level teams.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/2-3.jpg',
        date_achieved: '2023-01-01',
        category: 'State',
        is_featured: true
    },
    {
        title: 'Best Cricket Academy Award',
        description: 'Kalyan Cricket Academy was recognized as the "Best Cricket Academy" in January 2023.',
        image_url: 'https://kalyancricketacademy.in/wp-content/uploads/2023/01/1-4.jpg',
        date_achieved: '2023-01-01',
        category: 'Award',
        is_featured: true
    }
];

async function login() {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            username: 'admin',
            password: 'password'
        });
        console.log('Login successful, token:', response.data.data.accessToken);
        return response.data.data.accessToken;
    } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function getProfile(token) {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_BASE_URL}/auth/profile`, { headers });
        console.log('Successfully fetched profile:', response.data);
    } catch (error) {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
    }
}

async function addFacility(token, facility) {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.post(`${API_BASE_URL}/facilities`, facility, {
            headers: headers
        });
        console.log(`Successfully added facility: ${facility.title}`);
    } catch (error) {
        console.error(`Error adding facility: ${facility.title}`, error.response ? error.response.data : error.message);
    }
}

async function addAchievement(token, achievement) {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.post(`${API_BASE_URL}/achievements`, achievement, {
            headers: headers
        });
        console.log(`Successfully added achievement: ${achievement.title}`);
    } catch (error) {
        console.error(`Error adding achievement: ${achievement.title}`, error.response ? error.response.data : error.message);
    }
}

async function main() {
    const token = await login();
    if (!token) {
        console.error('Could not get auth token. Exiting.');
        return;
    }

    await getProfile(token);

    console.log('Adding facilities...');
    for (const facility of facilities) {
        await addFacility(token, facility);
    }

    console.log('\nAdding achievements...');
    for (const achievement of achievements) {
        await addAchievement(token, achievement);
    }
}

main();