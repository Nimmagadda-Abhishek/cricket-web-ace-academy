// Mock data for seeding the database

export const mockPrograms = [
  {
    _id: '1',
    title: 'Group Training',
    description: 'Ideal for players looking to build strong fundamentals. Develops skills, teamwork, and match awareness.',
    ageGroup: 'All ages',
    duration: '1 month',
    price: 8000,
    maxStudents: 25,
    currentStudents: 18,
    features: [
      '5 Days a Week - Balanced skill & fitness sessions',
      'Skill Drills (2 Days) - Batting, bowling & game strategy',
      'Team building activities',
      'Match simulations',
      'Group dynamics training',
      'Peer learning environment',
      'Experienced group coaches'
    ],
    status: 'active',
    coach: {
      name: 'Coach Vikram',
      experience: '10 years',
      specialization: ['Group Training', 'Team Development']
    },
    schedule: {
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '4:00 PM - 6:00 PM',
      venue: 'Main Practice Ground',
      sessionDuration: 120,
    },
    equipment: {
      provided: [
        'Cricket bats (various sizes)',
        'Training balls',
        'Stumps and bails',
        'Cones for drills'
      ],
      required: [
        'Sports shoes',
        'Comfortable clothing',
        'Water bottle',
        'Sun hat'
      ],
    },
    level: 'beginner to intermediate',
    category: 'group',
    startDate: '2024-07-01',
    icon: '🏆',
    color: 'from-blue-400 to-blue-600',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    prerequisites: [
      'No prior cricket experience needed',
      'Basic physical fitness',
      'Enthusiasm to learn'
    ],
    certificationProvided: false,
  },
  {
    _id: '2',
    title: 'Personalized Training',
    description: 'Designed for players who want individualized guidance. Enhances technique, confidence & match performance.',
    ageGroup: '12+ years',
    duration: '1 month',
    price: 15000,
    maxStudents: 10,
    currentStudents: 7,
    features: [
      'Skill Refinement - Master batting, bowling & strategy',
      'Video Analysis - Expert review to fine-tune techniques',
      'Individual attention from coaches',
      'Customized training plans',
      'Personal progress tracking',
      'Flexible scheduling options',
      'One-on-one skill sessions'
    ],
    status: 'active',
    coach: {
      name: 'Coach Priya',
      experience: '12 years',
      specialization: ['Personalized Training', 'Technique Analysis']
    },
    schedule: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      time: '5:00 PM - 7:00 PM',
      venue: 'Individual Training Nets',
      sessionDuration: 120,
    },
    equipment: {
      provided: [
        'Professional cricket bats',
        'Leather cricket balls',
        'Video analysis equipment',
        'Training aids'
      ],
      required: [
        'Cricket whites',
        'Cricket shoes',
        'Protective gear',
        'Personal water bottle'
      ],
    },
    level: 'intermediate',
    category: 'personalized',
    startDate: '2024-07-15',
    icon: '🎯',
    color: 'from-orange-400 to-orange-600',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    prerequisites: [
      'Basic cricket knowledge',
      'Some playing experience preferred',
      'Good physical fitness'
    ],
    certificationProvided: true,
  },
  {
    _id: '3',
    title: 'One-on-One Elite Coaching',
    description: 'Tailored coaching to refine techniques & game awareness. Master coach guidance for advanced skill development.',
    ageGroup: '14+ years',
    duration: 'Flexible',
    price: 25000,
    maxStudents: 5,
    currentStudents: 3,
    features: [
      'Specialized Training - Batting, bowling & fielding with turf practice',
      'Video Analysis & Feedback - Track progress & improve techniques',
      'Elite coach mentorship',
      'Tournament preparation',
      'Advanced technique refinement',
      'Game awareness development',
      'Professional skill enhancement'
    ],
    status: 'active',
    coach: {
      name: 'Coach Rajesh',
      experience: '15 years',
      specialization: ['Elite Performance', 'Advanced Techniques']
    },
    schedule: {
      days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
      time: '6:00 AM - 9:00 AM',
      venue: 'Elite Training Center',
      sessionDuration: 180,
    },
    equipment: {
      provided: [
        'High-end cricket equipment',
        'Video analysis tools',
        'Fitness tracking devices',
        'Specialized training aids'
      ],
      required: [
        'Professional cricket kit',
        'Multiple bats for different conditions',
        'Complete protective gear',
        'Training diary'
      ],
    },
    level: 'advanced',
    category: 'elite',
    startDate: '2024-08-01',
    icon: '🥇',
    color: 'from-purple-400 to-purple-600',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1305&q=80',
    prerequisites: [
      'Proven cricket ability',
      'Commitment to intensive training',
      'Physical and mental readiness'
    ],
    certificationProvided: true,
    discount: {
      type: 'percentage',
      value: 10,
      validUntil: '2024-07-20',
      description: 'Early bird discount',
    },
  },
  {
    _id: '4',
    title: 'Corporate Cricket Program',
    description: 'Designed for corporate teams to improve cricket skills & team dynamics. Blends fitness, strategy & leadership in a fun, engaging format.',
    ageGroup: '22+ years',
    duration: '1 month',
    price: 20000,
    maxStudents: 20,
    currentStudents: 12,
    features: [
      'Skill Training - Improve batting, bowling & fielding',
      'Fitness & Strength - Build endurance & prevent injuries',
      'Team building exercises',
      'Corporate tournaments',
      'Leadership development',
      'Strategic team planning',
      'Professional networking'
    ],
    status: 'active',
    coach: {
      name: 'Coach Arjun',
      experience: '8 years',
      specialization: ['Corporate Training', 'Team Building']
    },
    schedule: {
      days: ['Saturday', 'Sunday'],
      time: '9:00 AM - 12:00 PM',
      venue: 'Corporate Training Ground',
      sessionDuration: 180,
    },
    equipment: {
      provided: [
        'Professional cricket equipment',
        'Team building materials',
        'Fitness training gear',
        'Tournament supplies'
      ],
      required: [
        'Corporate sports attire',
        'Sports shoes',
        'Water bottle',
        'Team spirit'
      ],
    },
    level: 'all levels',
    category: 'corporate',
    startDate: '2024-07-10',
    icon: '🏢',
    color: 'from-green-400 to-green-600',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    prerequisites: [
      'Corporate team participation',
      'Basic fitness level',
      'Team collaboration mindset'
    ],
    certificationProvided: true,
  },
];