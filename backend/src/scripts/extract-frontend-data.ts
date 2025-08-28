import fs from 'fs';
import path from 'path';

// Extract data from frontend components and create JSON files for database import

// 1. PROGRAMS DATA (from frontend/src/services/api.ts mockPrograms)
const programsData = [
  {
    title: 'Group Training',
    description: 'Ideal for players looking to build strong fundamentals. Develops skills, teamwork, and match awareness through structured group sessions.',
    short_description: 'Build strong fundamentals with team-focused training',
    price: 8000.00,
    duration: '1 month',
    age_group: 'All ages',
    skill_level: 'beginner',
    max_participants: 25,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Personalized Training',
    description: 'Designed for players who want individualized guidance. Enhances technique, confidence & match performance through customized coaching.',
    short_description: 'Individual coaching for technique enhancement',
    price: 15000.00,
    duration: '1 month',
    age_group: '12+ years',
    skill_level: 'intermediate',
    max_participants: 10,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'One-on-One Elite Coaching',
    description: 'Tailored coaching to refine techniques & game awareness. Master coach guidance for advanced skill development and tournament preparation.',
    short_description: 'Elite coaching for advanced skill development',
    price: 25000.00,
    duration: 'Flexible',
    age_group: '14+ years',
    skill_level: 'advanced',
    max_participants: 5,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Corporate Cricket Program',
    description: 'Designed for corporate teams to improve cricket skills & team dynamics. Blends fitness, strategy & leadership in a fun, engaging format.',
    short_description: 'Corporate team building through cricket',
    price: 20000.00,
    duration: '1 month',
    age_group: '22+ years',
    skill_level: 'all',
    max_participants: 20,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

// 2. ACHIEVEMENTS DATA (from frontend/src/components/AchievementsSection.tsx)
const achievementsData = [
  {
    title: 'State Team Selection',
    description: '5 of our students were selected for the state cricket team in 2023, showcasing our academy\'s excellence in training.',
    date_achieved: '2023-06-15',
    category: 'Team Selection',
    image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_featured: true
  },
  {
    title: 'IPL Selection',
    description: 'Two of our academy graduates were picked in the IPL auction, marking a significant milestone in their professional careers.',
    date_achieved: '2022-12-20',
    category: 'Professional',
    image_url: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_featured: true
  },
  {
    title: 'Under-18 National Team',
    description: 'Three students selected for the Under-18 National Cricket Team, representing our academy at the highest youth level.',
    date_achieved: '2023-08-10',
    category: 'Youth',
    image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_featured: true
  },
  {
    title: 'Best Cricket Academy',
    description: 'Awarded as the Best Cricket Academy in the region for 2023, recognizing our commitment to excellence in cricket training.',
    date_achieved: '2023-01-15',
    category: 'Academy',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_featured: true
  }
];

// 3. FACILITIES DATA (from frontend/src/components/FacilitiesSection.tsx)
const facilitiesData = [
  {
    title: 'High-Performance Practice Nets',
    description: '15 nets with Turf, Astro-Turf, Cement & Matting surfaces. Train in diverse conditions to improve batting, bowling & adaptability.',
    short_description: '15 professional nets with multiple surface types',
    features: JSON.stringify(['15 professional nets', 'Multiple surface types', 'Turf & Astro-Turf', 'Cement & Matting surfaces']),
    icon: '🏏',
    is_active: true,
    display_order: 1
  },
  {
    title: 'All-Weather Indoor Cricket Nets',
    description: 'Indoor practice for uninterrupted training, rain or shine. Perfect for skill refinement, technical drills & high-intensity sessions.',
    short_description: 'Weather-proof indoor training facility',
    features: JSON.stringify(['Weather-proof training', 'Technical drill focus', 'High-intensity sessions', 'Year-round availability']),
    icon: '🏠',
    is_active: true,
    display_order: 2
  },
  {
    title: 'Floodlit Nets & Ground',
    description: 'Evening & night practice with professional floodlit setup. Enhances visibility, reflexes & adaptability to different lighting conditions.',
    short_description: 'Professional floodlit training facility',
    features: JSON.stringify(['Professional floodlights', 'Evening & night practice', 'Enhanced visibility training', 'Reflex improvement']),
    icon: '💡',
    is_active: true,
    display_order: 3
  },
  {
    title: 'Full-Fledged Match Ground',
    description: 'International-standard ground for matches & professional training. Ideal for team games, simulations & skill enhancement.',
    short_description: 'International standard match ground',
    features: JSON.stringify(['International standards', 'Match simulations', 'Team games', 'Professional training']),
    icon: '🏟️',
    is_active: true,
    display_order: 4
  },
  {
    title: 'Strength & Conditioning Center',
    description: 'Cricket-specific training with state-of-the-art fitness equipment. Expert coaches for strength, endurance & agility development.',
    short_description: 'Cricket-specific fitness training center',
    features: JSON.stringify(['State-of-the-art equipment', 'Cricket-specific training', 'Strength & endurance', 'Agility development']),
    icon: '💪',
    is_active: true,
    display_order: 5
  },
  {
    title: 'Advanced Video Analysis',
    description: 'Dedicated setup for performance tracking & technique improvement. Personalized feedback for refining gameplay.',
    short_description: 'Video analysis for technique improvement',
    features: JSON.stringify(['Performance tracking', 'Technique analysis', 'Personalized feedback', 'Gameplay refinement']),
    icon: '📹',
    is_active: true,
    display_order: 6
  },
  {
    title: 'HCA League Club Teams',
    description: 'Participation in One-Day, Two-Day & Three-Day HCA League matches. Build match temperament with top-level competition.',
    short_description: 'HCA League match participation',
    features: JSON.stringify(['HCA League participation', 'Multiple match formats', 'Competitive exposure', 'Match temperament building']),
    icon: '🏆',
    is_active: true,
    display_order: 7
  },
  {
    title: 'International Exposure & Tie-Ups',
    description: 'Official collaborations with clubs in State and Sri Lanka & Nepal. Exclusive opportunities to train & play with international teams.',
    short_description: 'International cricket collaborations',
    features: JSON.stringify(['International collaborations', 'Sri Lanka & Nepal tie-ups', 'Exclusive opportunities', 'International exposure']),
    icon: '🌍',
    is_active: true,
    display_order: 8
  },
  {
    title: 'Nutrition & Recovery Program',
    description: 'Sports nutrition plans for peak performance & endurance. Physiotherapy, ice baths & injury prevention programs.',
    short_description: 'Complete nutrition and recovery programs',
    features: JSON.stringify(['Sports nutrition plans', 'Physiotherapy services', 'Ice bath facilities', 'Injury prevention']),
    icon: '🥗',
    is_active: true,
    display_order: 9
  }
];

// 4. CONTACT DETAILS (from frontend/src/components/ContactSection.tsx)
const contactData = [
  {
    name: 'Academy Address',
    email: 'info@kalyancricketacademy.com',
    phone: '+91 9908008424',
    subject: 'Contact Information',
    message: 'Main academy location: 123 Cricket Ground, Sports Complex, Hyderabad, Telangana 500001. Training Hours - Monday-Friday: 6:00 AM - 9:00 PM, Saturday: 7:00 AM - 8:00 PM, Sunday: 8:00 AM - 6:00 PM',
    is_read: true,
    replied: false
  }
];

// 5. GALLERY DATA (sample from the gallery component structure)
const galleryData = [
  {
    title: 'Training Session - Batting Practice',
    description: 'Students practicing batting techniques under professional guidance',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'training',
    is_featured: true,
    display_order: 1
  },
  {
    title: 'Match Day - Inter Academy Tournament',
    description: 'Competitive match during inter-academy tournament',
    image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'matches',
    is_featured: true,
    display_order: 2
  },
  {
    title: 'Academy Facilities - Practice Nets',
    description: 'State-of-the-art practice nets for skill development',
    image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'facilities',
    is_featured: false,
    display_order: 3
  },
  {
    title: 'Award Ceremony - Best Academy 2023',
    description: 'Receiving the Best Cricket Academy award for 2023',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'events',
    is_featured: true,
    display_order: 4
  },
  {
    title: 'Team Building Event',
    description: 'Corporate team building session with professional training',
    image_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'events',
    is_featured: false,
    display_order: 5
  },
  {
    title: 'Fitness Training Session',
    description: 'Cricket-specific fitness and conditioning training',
    image_url: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'training',
    is_featured: false,
    display_order: 6
  }
];

// 6. COACHES DATA (based on the programs data)
const coachesData = [
  {
    name: 'Coach Vikram',
    bio: 'Experienced group training specialist with 10 years in cricket coaching. Expert in building strong fundamentals and team dynamics.',
    specialization: 'Group Training, Team Development, Fundamentals',
    experience_years: 10,
    phone: '+91 9908008425',
    email: 'vikram@kalyancricketacademy.com',
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Coach Priya',
    bio: 'Specialist in personalized training with 12 years of experience in technique analysis and individual skill development.',
    specialization: 'Personalized Training, Technique Analysis, Video Analysis',
    experience_years: 12,
    phone: '+91 9908008426',
    email: 'priya@kalyancricketacademy.com',
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1494790108755-2616c95e8b73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Coach Rajesh',
    bio: 'Elite performance coach with 15 years of experience in advanced techniques and tournament preparation. Former state-level player.',
    specialization: 'Elite Performance, Advanced Techniques, Tournament Preparation',
    experience_years: 15,
    phone: '+91 9908008427',
    email: 'rajesh@kalyancricketacademy.com',
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Coach Arjun',
    bio: 'Corporate training specialist with 8 years of experience in team building and leadership development through cricket.',
    specialization: 'Corporate Training, Team Building, Leadership Development',
    experience_years: 8,
    phone: '+91 9908008428',
    email: 'arjun@kalyancricketacademy.com',
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

// Function to create JSON files
async function createDataFiles() {
  const scriptsDir = path.dirname(__filename);
  
  // Create data files
  const dataFiles = [
    { filename: 'frontend-programs.json', data: programsData },
    { filename: 'frontend-achievements.json', data: achievementsData },
    { filename: 'frontend-facilities.json', data: facilitiesData },
    { filename: 'frontend-contact.json', data: contactData },
    { filename: 'frontend-gallery.json', data: galleryData },
    { filename: 'frontend-coaches.json', data: coachesData }
  ];
  
  for (const { filename, data } of dataFiles) {
    const filePath = path.join(scriptsDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Created ${filename} with ${data.length} records`);
  }
  
  console.log('\n🎉 All frontend data files created successfully!');
  console.log('\nNext steps:');
  console.log('1. Upload programs: npm run db-script import programs src/scripts/frontend-programs.json');
  console.log('2. Upload achievements: npm run db-script import achievements src/scripts/frontend-achievements.json');
  console.log('3. Upload facilities: npm run db-script import facilities src/scripts/frontend-facilities.json');
  console.log('4. Upload contact: npm run db-script import contact_messages src/scripts/frontend-contact.json');
  console.log('5. Upload gallery: npm run db-script import gallery_images src/scripts/frontend-gallery.json');
  console.log('6. Upload coaches: npm run db-script import coaches src/scripts/frontend-coaches.json');
}

// Run the extraction
if (import.meta.url === `file://${process.argv[1]}`) {
  createDataFiles().catch(console.error);
}

export { createDataFiles, programsData, achievementsData, facilitiesData, contactData, galleryData, coachesData };
