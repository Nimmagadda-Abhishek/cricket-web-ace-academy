export interface Achievement {
  id: number;
  title: string;
  description: string;
  achievement_date: string;
  color: string;
  image_url: string;
  category: string;
  display_order: number;
  status: 'active' | 'inactive';
}

export const achievementsData: Achievement[] = [
  {
    id: 1,
    title: 'State Team Selection',
    description: '5 of our students were selected for the state cricket team in 2023, showcasing our academy\'s excellence in training.',
    achievement_date: '2023-06-15',
    color: 'from-cricket-green to-cricket-green/80',
    image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Team',
    display_order: 1,
    status: 'active'
  },
  {
    id: 2,
    title: 'IPL Selection',
    description: 'Two of our academy graduates were picked in the IPL auction, marking a significant milestone in their professional careers.',
    achievement_date: '2022-12-20',
    color: 'from-cricket-orange to-cricket-orange/80',
    image_url: 'https://images.firstpost.com/uploads/2025/05/Indian-Premier-League-trophy-KKR-RCB-IPL-2025-Reuters-1200-2025-05-fb9dfc355fa99461a298bd2058300b8f.jpg?im=FitAndFill=(596,336)',
    category: 'Professional',
    display_order: 2,
    status: 'active'
  },
  {
    id: 3,
    title: 'Under-18 National Team',
    description: 'Three students selected for the Under-18 National Cricket Team, representing our academy at the highest youth level.',
    achievement_date: '2023-08-10',
    color: 'from-blue-500 to-blue-600',
    image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Youth',
    display_order: 3,
    status: 'active'
  },
  {
    id: 4,
    title: 'Best Cricket Academy',
    description: 'Awarded as the Best Cricket Academy in the region for 2023, recognizing our commitment to excellence in cricket training.',
    achievement_date: '2023-01-15',
    color: 'from-purple-600 to-purple-700',
    image_url: 'https://www.sportsboom.com/_next/image?url=https%3A%2F%2Fassets.sportsboom.com%2FGetty_Images_1247348876_807c2f9fcb.jpg&w=3840&q=75',
    category: 'Academy',
    display_order: 4,
    status: 'active'
  },
  {
    id: 5,
    title: 'Century Makers',
    description: 'Over 50 students have scored centuries under our coaching, developing into formidable batsmen.',
    achievement_date: '2023-09-20',
    color: 'from-green-500 to-green-600',
    image_url: 'https://p.imgci.com/db/PICTURES/CMS/390300/390312.jpg',
    category: 'Batting',
    display_order: 5,
    status: 'active'
  },
  {
    id: 6,
    title: 'Wicket Keeping Excellence',
    description: 'Our wicket-keeping training has produced 8 professional wicket-keepers currently playing in various leagues.',
    achievement_date: '2023-07-05',
    color: 'from-yellow-500 to-yellow-600',
    image_url: 'https://www.cricketlab.co/wp-content/uploads/2015/03/CRICKETLAB_Wicket_Keeper2.jpg',
    category: 'Wicket Keeping',
    display_order: 6,
    status: 'active'
  }
];

export const getActiveAchievements = (): Achievement[] => {
  return achievementsData
    .filter(achievement => achievement.status === 'active')
    .sort((a, b) => a.display_order - b.display_order);
};
