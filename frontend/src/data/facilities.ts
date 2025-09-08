export interface Facility {
  id: string;
  name: string;
  description: string;
  image_url: string;
  features: string[];
  status: 'available' | 'maintenance' | 'upcoming';
  created_at: string;
  updated_at: string;
}

const facilitiesData = [
  {
    "title": "High-Performance Practice Nets",
    "description": "15 nets with Turf, Astro-Turf, Cement & Matting surfaces. Train in diverse conditions to improve batting, bowling & adaptability.",
    "short_description": "15 professional nets with multiple surface types",
    "features": '["15 professional nets", "Multiple surface types", "Turf & Astro-Turf", "Cement & Matting surfaces"]',
    "icon": "🏏",
    "is_active": true,
    "display_order": 1
  },
  {
    "title": "All-Weather Indoor Cricket Nets",
    "description": "Indoor practice for uninterrupted training, rain or shine. Perfect for skill refinement, technical drills & high-intensity sessions.",
    "short_description": "Weather-proof indoor training facility",
    "features": '["Weather-proof training", "Technical drill focus", "High-intensity sessions", "Year-round availability"]',
    "icon": "🏠",
    "is_active": true,
    "display_order": 2
  },
  {
    "title": "Floodlit Nets & Ground",
    "description": "Evening & night practice with professional floodlit setup. Enhances visibility, reflexes & adaptability to different lighting conditions.",
    "short_description": "Professional floodlit training facility",
    "features": '["Professional floodlights", "Evening & night practice", "Enhanced visibility training", "Reflex improvement"]',
    "icon": "💡",
    "is_active": true,
    "display_order": 3
  },
  {
    "title": "Full-Fledged Match Ground",
    "description": "International-standard ground for matches & professional training. Ideal for team games, simulations & skill enhancement.",
    "short_description": "International standard match ground",
    "features": '["International standards", "Match simulations", "Team games", "Professional training"]',
    "icon": "🏟️",
    "is_active": true,
    "display_order": 4
  }
];

export const facilities: Facility[] = facilitiesData.map((facility, index) => ({
  id: `${index + 1}`,
  name: facility.title,
  description: facility.description,
  image_url: `https://picsum.photos/seed/${index + 1}/600/400`, // Placeholder image
  features: JSON.parse(facility.features),
  status: facility.is_active ? 'available' : 'maintenance',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));