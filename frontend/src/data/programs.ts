export interface Program {
  _id: string;
  title: string;
  description: string;
  image: string;
  level: string;
  highlights?: string[];
  ageGroup?: string;
  duration?: string;
  price?: number;
  maxStudents?: number;
}

export const programsData: Program[] = [
  {
    _id: '1',
    title: 'Group Training',
    description: 'Perfect for beginners and team building. Develop fundamental skills in a supportive group environment.',
    level: 'Beginner to Intermediate',
    image: '/images/programs/01.jpg',
    highlights: ['Team Building', 'Basic Skills', 'Match Practice', 'Fitness Training'],
    ageGroup: '8-16 years',
    duration: '2 hours/session',
    price: 1500,
    maxStudents: 20
  },
  {
    _id: '2',
    title: 'Personal Training',
    description: 'One-on-one coaching for rapid skill improvement. Customized training plans for individual goals.',
    level: 'Intermediate',
    image: '/images/programs/02.webp',
    highlights: ['Individual Focus', 'Video Analysis', 'Technique Refinement', 'Performance Tracking'],
    ageGroup: '10-25 years',
    duration: '1.5 hours/session',
    price: 2500,
    maxStudents: 1
  },
  {
    _id: '3',
    title: 'Elite Coaching',
    description: 'Advanced training for serious players. Professional-level coaching for competitive cricket.',
    level: 'Advanced',
    image: '/images/programs/03.webp',
    highlights: ['Elite Training', 'Tournament Prep', 'Mental Coaching', 'Career Guidance'],
    ageGroup: '14-25 years',
    duration: '3 hours/session',
    price: 3500,
    maxStudents: 10
  },
  {
    _id: '4',
    title: 'Corporate Program',
    description: 'Team building through cricket. Perfect for corporate groups and office teams.',
    level: 'All Levels',
    image: '/images/corporate-cricket-program.jpg',
    highlights: ['Team Building', 'Corporate Events', 'Fitness Focus', 'Leadership Skills'],
    ageGroup: '18-50 years',
    duration: '2-3 hours/session',
    price: 5000,
    maxStudents: 25
  },
  {
    _id: '5',
    title: 'NRI Excellence Program',
    description: 'Intensive short-term program for overseas players with high-intensity drills, match simulations, and adaptation to Indian conditions.',
    level: 'Intermediate to Advanced',
    image: 'https://content.jdmagicbox.com/comp/def_content/cricket-coaching-classes/shutterstock-647586433-cricket-coaching-classes-9-qtn7q.jpg',
    highlights: [
      'High-intensity drills',
      'Match sims: turf & matting',
      'Adapt to Indian conditions',
      'Specialist coaching & machines'
    ],
    ageGroup: '16-30 years',
    duration: '4-6 weeks',
    price: 15000,
    maxStudents: 15
  },
  {
    _id: '6',
    title: 'Youth Development',
    description: 'Comprehensive program for young cricketers focusing on skill development, physical fitness, and mental toughness.',
    level: 'Beginner to Advanced',
    image: 'https://t4.ftcdn.net/jpg/01/26/92/89/360_F_126928965_WANqrNFyyLVvL35WLrV6Wpt9G6cnQFQn.jpg',
    highlights: ['Skill Development', 'Physical Fitness', 'Mental Training', 'Regular Assessments'],
    ageGroup: '8-18 years',
    duration: '2 hours/session',
    price: 2000,
    maxStudents: 15
  }
];

export const getPrograms = (): Program[] => {
  return programsData;
};

export const getProgramById = (id: string): Program | undefined => {
  return programsData.find(program => program._id === id);
};
