// API service for making requests to the backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const IS_DEV = import.meta.env.DEV || process.env.NODE_ENV === 'development';

// Generic fetch function with error handling
async function fetchData(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Programs API
export const programsApi = {
  // Get all public programs
  getPrograms: () => {
    // For development, return mock data
    if (IS_DEV) {
      return Promise.resolve({
        data: {
          programs: mockPrograms,
        },
      });
    }
    return fetchData('/programs/public');
  },
  
  // Get program details by ID
  getProgramById: (id: string) => {
    // For development, return mock data
    if (IS_DEV) {
      const program = mockPrograms.find(p => p._id === id) || mockPrograms[0];
      return Promise.resolve({
        data: {
          program,
        },
      });
    }
    return fetchData(`/programs/${id}`);
  },
};

// Coaches API
export const coachesApi = {
  // Get all public coaches
  getCoaches: () => {
    // For development, return mock data
    if (IS_DEV) {
      return Promise.resolve({
        data: {
          coaches: mockCoaches,
        },
      });
    }
    return fetchData('/coaches/public');
  },
  
  // Get coach details by ID
  getCoachById: (id: string) => {
    // For development, return mock data
    if (IS_DEV) {
      const coach = mockCoaches.find(c => c._id === id) || mockCoaches[0];
      return Promise.resolve({
        data: {
          coach,
        },
      });
    }
    return fetchData(`/coaches/${id}`);
  },
};

// Payments API (for checkout)
export const paymentsApi = {
  // Create a new payment intent
  createPaymentIntent: (data: any) => {
    // For development, simulate payment intent creation
    if (IS_DEV) {
      return Promise.resolve({
        data: {
          clientSecret: 'mock_client_secret_' + Math.random().toString(36).substring(2),
          amount: data.amount,
        },
      });
    }
    return fetchData('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Process enrollment
  processEnrollment: (data: any) => {
    // For development, simulate enrollment processing
    if (IS_DEV) {
      return Promise.resolve({
        data: {
          success: true,
          enrollment: {
            _id: 'ENR' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            ...data,
            status: 'active',
            enrollmentDate: new Date().toISOString(),
          },
        },
      });
    }
    return fetchData('/payments/enroll', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Contacts API
export const contactsApi = {
  // Submit contact form
  submitContactForm: (data: any) => {
    // For development, simulate form submission
    if (IS_DEV) {
      console.log('Contact form data (mock):', data);
      return Promise.resolve({
        data: {
          success: true,
          message: 'Thank you for your message. We will get back to you soon!',
        },
      });
    }
    return fetchData('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Mock Data for Development
const mockPrograms = [
  {
    _id: '1',
    title: 'Junior Cricket Academy',
    description: 'A comprehensive program designed for young cricketers to develop fundamental skills and love for the game.',
    ageGroup: '7-12 years',
    duration: '3 months',
    price: 12000,
    maxStudents: 20,
    currentStudents: 15,
    features: [
      'Basic batting, bowling, and fielding techniques',
      'Fun cricket games and activities',
      'Introduction to cricket rules and etiquette',
      'Personalized feedback and development plans',
      'Mini-tournaments and match practice',
      'Progress reports and certificates'
    ],
    status: 'active',
    coach: {
      _id: '1',
      name: 'Rahul Sharma',
      specialization: ['junior coaching', 'batting'],
      rating: {
        average: 4.8,
      },
    },
    schedule: {
      days: ['monday', 'wednesday', 'friday'],
      time: '4:00 PM - 6:00 PM',
      venue: 'Main Cricket Ground',
      sessionDuration: 120,
    },
    equipment: {
      provided: [
        'Cricket bats (junior size)',
        'Soft training balls',
        'Protective gear',
        'Training cones and markers',
        'Wickets and stumps'
      ],
      required: [
        'Comfortable sports clothing',
        'Sports shoes',
        'Water bottle',
        'Cap/hat for sun protection'
      ],
    },
    level: 'beginner',
    category: 'junior',
    startDate: '2024-07-01',
    icon: '🏏',
    color: 'from-blue-400 to-blue-600',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1167&q=80',
    prerequisites: [],
    certificationProvided: true,
    discount: {
      type: 'percentage',
      value: 10,
      validUntil: '2024-06-30',
      description: 'Early bird discount',
    },
  },
  {
    _id: '2',
    title: 'Advanced Batting Masterclass',
    description: 'Elevate your batting skills with personalized coaching from experienced professionals focusing on technique, strategy, and mental strength.',
    ageGroup: '14-18 years',
    duration: '2 months',
    price: 18000,
    maxStudents: 12,
    currentStudents: 10,
    features: [
      'Advanced batting technique refinement',
      'Shot selection and execution training',
      'Playing against different bowling styles',
      'Video analysis of batting technique',
      'Mental conditioning for batting',
      'Match simulation scenarios',
      'One-on-one coaching sessions'
    ],
    status: 'active',
    coach: {
      _id: '2',
      name: 'Vikram Rathore',
      specialization: ['batting', 'technique analysis'],
      rating: {
        average: 4.9,
      },
    },
    schedule: {
      days: ['tuesday', 'thursday', 'saturday'],
      time: '5:00 PM - 7:30 PM',
      venue: 'Indoor Cricket Academy',
      sessionDuration: 150,
    },
    equipment: {
      provided: [
        'Professional cricket bats',
        'Bowling machines',
        'Video analysis equipment',
        'Training nets',
        'Various types of cricket balls'
      ],
      required: [
        'Personal batting gloves',
        'Helmet',
        'Batting pads',
        'Cricket shoes with spikes',
        'Athletic clothing'
      ],
    },
    level: 'advanced',
    category: 'youth',
    startDate: '2024-08-15',
    icon: '🏆',
    color: 'from-purple-500 to-purple-700',
    image: 'https://images.unsplash.com/photo-1629285483773-6b5cde2171d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
    prerequisites: [
      'Minimum 2 years of cricket experience',
      'Basic understanding of batting techniques',
      'Physical fitness for intensive training'
    ],
    certificationProvided: true,
  },
  {
    _id: '3',
    title: 'Fast Bowling Academy',
    description: 'Develop speed, accuracy, and swing with our specialized fast bowling program designed for aspiring pace bowlers.',
    ageGroup: '15-22 years',
    duration: '3 months',
    price: 20000,
    maxStudents: 10,
    currentStudents: 7,
    features: [
      'Bowling action analysis and correction',
      'Speed enhancement techniques',
      'Swing and seam bowling mastery',
      'Strength and conditioning for fast bowlers',
      'Injury prevention training',
      'Variation deliveries coaching',
      'Match strategy for bowlers'
    ],
    status: 'active',
    coach: {
      _id: '3',
      name: 'Ishant Kumar',
      specialization: ['fast bowling', 'fitness training'],
      rating: {
        average: 4.7,
      },
    },
    schedule: {
      days: ['monday', 'wednesday', 'friday', 'saturday'],
      time: '4:30 PM - 6:30 PM',
      venue: 'Main Cricket Ground',
      sessionDuration: 120,
    },
    equipment: {
      provided: [
        'Various cricket balls (red, white, pink)',
        'Bowling markers and cones',
        'Speed measurement equipment',
        'Video analysis tools',
        'Fitness equipment'
      ],
      required: [
        'Cricket shoes with spikes',
        'Athletic clothing',
        'Personal water bottle',
        'Towel',
        'Sunscreen'
      ],
    },
    level: 'intermediate',
    category: 'elite',
    startDate: '2024-07-10',
    icon: '🔥',
    color: 'from-red-500 to-red-700',
    image: 'https://images.unsplash.com/photo-1626016753999-a73a0a0b1e2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    prerequisites: [
      'Good physical fitness',
      'Basic bowling experience',
      'No recent injuries'
    ],
    certificationProvided: true,
    discount: {
      type: 'fixed',
      value: 2000,
      validUntil: '2024-06-25',
      description: 'Limited time offer',
    },
  },
  {
    _id: '4',
    title: 'Cricket for Beginners',
    description: 'An introductory program for adults who want to learn cricket from scratch in a friendly, supportive environment.',
    ageGroup: '18+ years',
    duration: '2 months',
    price: 15000,
    maxStudents: 15,
    currentStudents: 8,
    features: [
      'Fundamentals of cricket rules and gameplay',
      'Basic batting, bowling, and fielding skills',
      'Cricket terminology and strategies',
      'Fitness and warm-up routines',
      'Fun practice matches and activities',
      'Social cricket environment'
    ],
    status: 'active',
    coach: {
      _id: '4',
      name: 'Priya Desai',
      specialization: ['beginner coaching', 'all-rounder skills'],
      rating: {
        average: 4.9,
      },
    },
    schedule: {
      days: ['saturday', 'sunday'],
      time: '9:00 AM - 11:00 AM',
      venue: 'Community Cricket Field',
      sessionDuration: 120,
    },
    equipment: {
      provided: [
        'All cricket equipment (bats, balls, pads)',
        'Training aids',
        'Protective gear',
        'Practice nets'
      ],
      required: [
        'Comfortable sports clothing',
        'Sports shoes',
        'Water bottle',
        'Enthusiasm to learn'
      ],
    },
    level: 'beginner',
    category: 'adult',
    startDate: '2024-07-15',
    icon: '🌟',
    color: 'from-green-400 to-green-600',
    image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    prerequisites: [],
    certificationProvided: false,
  },
  {
    _id: '5',
    title: 'Spin Bowling Specialist Program',
    description: 'Master the art of spin bowling with expert coaching on technique, variations, and match strategy.',
    ageGroup: '14-25 years',
    duration: '3 months',
    price: 18000,
    maxStudents: 8,
    currentStudents: 5,
    features: [
      'Finger and wrist spin techniques',
      'Developing various spin variations',
      'Flight, drift, and turn mastery',
      'Setting up batsmen tactically',
      'Video analysis of bowling action',
      'Match situation bowling practice',
      'One-on-one specialized coaching'
    ],
    status: 'active',
    coach: {
      _id: '5',
      name: 'Anil Kumble',
      specialization: ['spin bowling', 'strategy'],
      rating: {
        average: 4.8,
      },
    },
    schedule: {
      days: ['tuesday', 'thursday', 'sunday'],
      time: '3:00 PM - 5:00 PM',
      venue: 'Spin Academy Nets',
      sessionDuration: 120,
    },
    equipment: {
      provided: [
        'Various cricket balls for spin practice',
        'Specialized spin training aids',
        'Video analysis equipment',
        'Bowling markers'
      ],
      required: [
        'Cricket shoes',
        'Training clothing',
        'Personal notebook for tips',
        'Water bottle'
      ],
    },
    level: 'intermediate',
    category: 'elite',
    startDate: '2024-08-01',
    icon: '🌀',
    color: 'from-yellow-400 to-yellow-600',
    image: 'https://images.unsplash.com/photo-1595435742656-5272ce021b4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    prerequisites: [
      'Basic understanding of bowling',
      'Some cricket experience preferred',
      'Patience and dedication'
    ],
    certificationProvided: true,
  },
  {
    _id: '6',
    title: 'Wicketkeeping Excellence',
    description: 'Specialized program focusing on all aspects of wicketkeeping from basics to advanced techniques.',
    ageGroup: '13-20 years',
    duration: '2 months',
    price: 16000,
    maxStudents: 6,
    currentStudents: 4,
    features: [
      'Stance and positioning techniques',
      'Catching and stumping drills',
      'Diving and athletic movement training',
      'Keeping to different bowling types',
      'Hand-eye coordination exercises',
      'Wicketkeeper leadership development',
      'Batting for wicketkeepers'
    ],
    status: 'active',
    coach: {
      _id: '6',
      name: 'MS Dhoni',
      specialization: ['wicketkeeping', 'leadership'],
      rating: {
        average: 5.0,
      },
    },
    schedule: {
      days: ['wednesday', 'friday', 'sunday'],
      time: '4:00 PM - 6:00 PM',
      venue: 'Indoor Cricket Academy',
      sessionDuration: 120,
    },
    equipment: {
      provided: [
        'Wicketkeeping gloves',
        'Wicketkeeping pads',
        'Training stumps and bails',
        'Specialized drills equipment',
        'Video analysis tools'
      ],
      required: [
        'Cricket shoes',
        'Athletic clothing',
        'Inner gloves',
        'Water bottle',
        'Protective gear'
      ],
    },
    level: 'intermediate',
    category: 'elite',
    startDate: '2024-07-20',
    icon: '🧤',
    color: 'from-blue-500 to-blue-700',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1305&q=80',
    prerequisites: [
      'Basic cricket knowledge',
      'Good reflexes',
      'Physical fitness'
    ],
    certificationProvided: true,
    discount: {
      type: 'percentage',
      value: 15,
      validUntil: '2024-07-10',
      description: 'Special launch offer',
    },
  },
];

const mockCoaches = [
  {
    _id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    specialization: ['junior coaching', 'batting'],
    experience: 12,
    bio: 'Former first-class cricketer with over a decade of coaching experience specializing in youth development. Rahul has a talent for making cricket fun and accessible for children while building strong technical foundations.',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    certifications: [
      'BCCI Level 2 Coaching Certification',
      'Youth Sports Development Certification',
      'First Aid and Sports Safety'
    ],
    contactInfo: {
      emergencyContact: '+91 9876543211',
      address: '123 Cricket Lane, Mumbai',
      dateOfBirth: '1985-05-15',
    },
    employment: {
      joinDate: '2018-03-10',
      employmentType: 'full-time',
      status: 'active',
    },
    qualifications: [
      {
        degree: 'Bachelor of Physical Education',
        institution: 'Mumbai University',
        year: 2007,
        cricketLevel: 'first-class',
      },
      {
        degree: 'Sports Psychology Diploma',
        institution: 'National Institute of Sports',
        year: 2010,
        cricketLevel: 'first-class',
      }
    ],
    achievements: [
      'Developed 5 players who went on to represent state teams',
      'Coach of the Year Award 2019',
      'Led junior team to regional championship victory',
      'Published author of "Cricket Fundamentals for Kids"'
    ],
    availability: {
      days: ['monday', 'wednesday', 'friday', 'saturday'],
      timeSlots: [
        { start: '9:00 AM', end: '12:00 PM' },
        { start: '3:00 PM', end: '7:00 PM' }
      ],
    },
    rating: {
      average: 4.8,
      count: 45,
      reviews: [
        {
          studentId: 'student1',
          rating: 5,
          comment: 'Coach Rahul made cricket so much fun for my son while teaching him proper technique. Highly recommended!',
          date: '2023-05-20',
        },
        {
          studentId: 'student2',
          rating: 5,
          comment: 'Excellent at working with children. Patient and encouraging.',
          date: '2023-04-15',
        },
        {
          studentId: 'student3',
          rating: 4,
          comment: 'Great coach who knows how to connect with kids and make learning enjoyable.',
          date: '2023-03-10',
        }
      ],
    },
    programs: [
      {
        _id: '1',
        title: 'Junior Cricket Academy',
        currentStudents: 15,
        maxStudents: 20,
        category: 'junior',
        price: 12000,
      },
      {
        _id: '4',
        title: 'Cricket for Beginners',
        currentStudents: 8,
        maxStudents: 15,
        category: 'adult',
        price: 15000,
      }
    ],
  },
  {
    _id: '2',
    name: 'Vikram Rathore',
    email: 'vikram.rathore@example.com',
    phone: '+91 9876543220',
    specialization: ['batting', 'technique analysis'],
    experience: 15,
    bio: 'Former international cricketer with expertise in batting technique and mental aspects of cricket. Vikram uses cutting-edge video analysis and personalized coaching methods to transform batting skills at all levels.',
    image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
    certifications: [
      'ECB Level 3 Coaching Certification',
      'Advanced Performance Analysis Certification',
      'Mental Conditioning Coach Certification'
    ],
    contactInfo: {
      emergencyContact: '+91 9876543221',
      address: '456 Batting Avenue, Delhi',
      dateOfBirth: '1980-08-22',
    },
    employment: {
      joinDate: '2016-06-15',
      employmentType: 'full-time',
      status: 'active',
    },
    qualifications: [
      {
        degree: 'Master of Sports Science',
        institution: 'Delhi University',
        year: 2005,
        cricketLevel: 'international',
      }
    ],
    achievements: [
      'Former national team batting coach',
      'Played 15 test matches and 45 ODIs for India',
      'Developed batting technique analysis software',
      'Mentored 3 current international players'
    ],
    availability: {
      days: ['tuesday', 'thursday', 'saturday'],
      timeSlots: [
        { start: '10:00 AM', end: '1:00 PM' },
        { start: '4:00 PM', end: '8:00 PM' }
      ],
    },
    rating: {
      average: 4.9,
      count: 38,
      reviews: [
        {
          studentId: 'student4',
          rating: 5,
          comment: 'Coach Vikram completely transformed my batting. His technical insights are incredible.',
          date: '2023-05-25',
        },
        {
          studentId: 'student5',
          rating: 5,
          comment: 'The video analysis sessions were eye-opening. I now understand my technique much better.',
          date: '2023-04-18',
        },
        {
          studentId: 'student6',
          rating: 4,
          comment: 'Excellent coach with deep knowledge. Demanding but gets results.',
          date: '2023-03-05',
        }
      ],
    },
    programs: [
      {
        _id: '2',
        title: 'Advanced Batting Masterclass',
        currentStudents: 10,
        maxStudents: 12,
        category: 'youth',
        price: 18000,
      }
    ],
  },
  {
    _id: '3',
    name: 'Ishant Kumar',
    email: 'ishant.kumar@example.com',
    phone: '+91 9876543230',
    specialization: ['fast bowling', 'fitness training'],
    experience: 10,
    bio: 'Former professional fast bowler with expertise in pace development, bowling mechanics, and fitness training. Ishant combines technical coaching with strength and conditioning to develop complete fast bowlers.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    certifications: [
      'BCCI Level 2 Coaching Certification',
      'Certified Strength and Conditioning Specialist',
      'Sports Injury Prevention and Management'
    ],
    contactInfo: {
      emergencyContact: '+91 9876543231',
      address: '789 Pace Bowling Road, Bangalore',
      dateOfBirth: '1988-11-05',
    },
    employment: {
      joinDate: '2019-01-20',
      employmentType: 'full-time',
      status: 'active',
    },
    qualifications: [
      {
        degree: 'Bachelor of Sports Science',
        institution: 'Bangalore University',
        year: 2010,
        cricketLevel: 'first-class',
      },
      {
        degree: 'Diploma in Sports Nutrition',
        institution: 'Sports Science Institute',
        year: 2012,
        cricketLevel: 'first-class',
      }
    ],
    achievements: [
      'Played 75 first-class matches as a fast bowler',
      'Developed specialized training program for young fast bowlers',
      'Coached 2 bowlers who achieved national selection',
      'Specialist consultant for state cricket teams'
    ],
    availability: {
      days: ['monday', 'wednesday', 'friday', 'saturday'],
      timeSlots: [
        { start: '7:00 AM', end: '10:00 AM' },
        { start: '4:00 PM', end: '7:00 PM' }
      ],
    },
    rating: {
      average: 4.7,
      count: 32,
      reviews: [
        {
          studentId: 'student7',
          rating: 5,
          comment: 'Coach Ishant helped me add 15 km/h to my bowling speed while improving accuracy. Amazing results!',
          date: '2023-05-15',
        },
        {
          studentId: 'student8',
          rating: 4,
          comment: 'Great technical coach who also emphasizes fitness and injury prevention.',
          date: '2023-04-10',
        },
        {
          studentId: 'student9',
          rating: 5,
          comment: 'The fitness regimen he designed specifically for fast bowlers has been transformative.',
          date: '2023-03-22',
        }
      ],
    },
    programs: [
      {
        _id: '3',
        title: 'Fast Bowling Academy',
        currentStudents: 7,
        maxStudents: 10,
        category: 'elite',
        price: 20000,
      }
    ],
  },
  {
    _id: '4',
    name: 'Priya Desai',
    email: 'priya.desai@example.com',
    phone: '+91 9876543240',
    specialization: ['beginner coaching', 'all-rounder skills'],
    experience: 8,
    bio: 'Former women\'s cricket team player with a passion for introducing cricket to beginners. Priya creates an inclusive, supportive environment where new players can develop a love for the game while learning proper techniques.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80',
    certifications: [
      'ICC Level 2 Coaching Certification',
      'Inclusive Coaching Certification',
      'First Aid and Safety Training'
    ],
    contactInfo: {
      emergencyContact: '+91 9876543241',
      address: '101 Cricket Street, Chennai',
      dateOfBirth: '1990-04-12',
    },
    employment: {
      joinDate: '2020-02-15',
      employmentType: 'full-time',
      status: 'active',
    },
    qualifications: [
      {
        degree: 'Bachelor of Physical Education',
        institution: 'Chennai University',
        year: 2012,
        cricketLevel: 'national',
      }
    ],
    achievements: [
      'Represented India in women\'s cricket',
      'Developed popular "Cricket for All" program',
      'Featured in sports education documentary',
      'Authored beginner\'s guide to cricket'
    ],
    availability: {
      days: ['tuesday', 'thursday', 'saturday', 'sunday'],
      timeSlots: [
        { start: '9:00 AM', end: '12:00 PM' },
        { start: '2:00 PM', end: '5:00 PM' }
      ],
    },
    rating: {
      average: 4.9,
      count: 40,
      reviews: [
        {
          studentId: 'student10',
          rating: 5,
          comment: 'As a complete beginner, I was nervous, but Coach Priya made learning cricket so enjoyable and accessible.',
          date: '2023-05-28',
        },
        {
          studentId: 'student11',
          rating: 5,
          comment: 'Excellent at breaking down complex skills into simple steps. Perfect for adult beginners.',
          date: '2023-04-20',
        },
        {
          studentId: 'student12',
          rating: 5,
          comment: 'The most patient and encouraging coach. Creates a supportive environment for learning.',
          date: '2023-03-15',
        }
      ],
    },
    programs: [
      {
        _id: '4',
        title: 'Cricket for Beginners',
        currentStudents: 8,
        maxStudents: 15,
        category: 'adult',
        price: 15000,
      }
    ],
  },
  {
    _id: '5',
    name: 'Anil Kumble',
    email: 'anil.kumble@example.com',
    phone: '+91 9876543250',
    specialization: ['spin bowling', 'strategy'],
    experience: 20,
    bio: 'Legendary former international spinner with unparalleled expertise in all aspects of spin bowling. Anil combines technical mastery with tactical acumen to develop complete spin bowlers who can excel in all formats of the game.',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    certifications: [
      'BCCI Level 3 Coaching Certification',
      'Advanced Cricket Strategy Certification',
      'Sports Psychology for Coaches'
    ],
    contactInfo: {
      emergencyContact: '+91 9876543251',
      address: '555 Spin Alley, Bangalore',
      dateOfBirth: '1970-10-17',
    },
    employment: {
      joinDate: '2017-08-05',
      employmentType: 'part-time',
      status: 'active',
    },
    qualifications: [
      {
        degree: 'Bachelor of Engineering',
        institution: 'Bangalore Institute of Technology',
        year: 1992,
        cricketLevel: 'international',
      },
      {
        degree: 'Cricket Management Diploma',
        institution: 'International Cricket Council',
        year: 2010,
        cricketLevel: 'international',
      }
    ],
    achievements: [
      'Over 600 international wickets',
      'Former head coach of Indian national team',
      'ICC Hall of Fame inductee',
      'Developed revolutionary spin bowling analysis methods',
      'Mentored multiple international spinners'
    ],
    availability: {
      days: ['tuesday', 'thursday', 'sunday'],
      timeSlots: [
        { start: '10:00 AM', end: '1:00 PM' },
        { start: '3:00 PM', end: '6:00 PM' }
      ],
    },
    rating: {
      average: 4.8,
      count: 35,
      reviews: [
        {
          studentId: 'student13',
          rating: 5,
          comment: 'Learning from a legend like Coach Anil is a dream come true. His insights are invaluable.',
          date: '2023-05-22',
        },
        {
          studentId: 'student14',
          rating: 5,
          comment: 'The technical details he provides about spin bowling are things you can\'t learn anywhere else.',
          date: '2023-04-12',
        },
        {
          studentId: 'student15',
          rating: 4,
          comment: 'Excellent strategic mind. Teaches not just how to bowl but when and why.',
          date: '2023-03-08',
        }
      ],
    },
    programs: [
      {
        _id: '5',
        title: 'Spin Bowling Specialist Program',
        currentStudents: 5,
        maxStudents: 8,
        category: 'elite',
        price: 18000,
      }
    ],
  },
  {
    _id: '6',
    name: 'MS Dhoni',
    email: 'ms.dhoni@example.com',
    phone: '+91 9876543260',
    specialization: ['wicketkeeping', 'leadership'],
    experience: 18,
    bio: 'Iconic former captain and wicketkeeper with unmatched expertise in all aspects of wicketkeeping and cricket leadership. MS brings calm, methodical coaching that emphasizes technique, game awareness, and mental strength.',
    image: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
    certifications: [
      'BCCI Level 3 Coaching Certification',
      'Advanced Wicketkeeping Techniques Certification',
      'Leadership and Team Management'
    ],
    contactInfo: {
      emergencyContact: '+91 9876543261',
      address: '777 Captain\'s Lane, Ranchi',
      dateOfBirth: '1981-07-07',
    },
    employment: {
      joinDate: '2021-01-10',
      employmentType: 'part-time',
      status: 'active',
    },
    qualifications: [
      {
        degree: 'Bachelor of Business Administration',
        institution: 'Ranchi University',
        year: 2002,
        cricketLevel: 'international',
      }
    ],
    achievements: [
      'Led India to World Cup victory',
      'One of the greatest wicketkeeper-batsmen in cricket history',
      'Developed revolutionary wicketkeeping techniques',
      'Renowned for tactical acumen and leadership',
      'Mentored numerous international wicketkeepers'
    ],
    availability: {
      days: ['wednesday', 'friday', 'sunday'],
      timeSlots: [
        { start: '9:00 AM', end: '12:00 PM' },
        { start: '4:00 PM', end: '7:00 PM' }
      ],
    },
    rating: {
      average: 5.0,
      count: 30,
      reviews: [
        {
          studentId: 'student16',
          rating: 5,
          comment: 'Coach MS has a unique ability to simplify complex wicketkeeping concepts. Incredible mentor.',
          date: '2023-05-18',
        },
        {
          studentId: 'student17',
          rating: 5,
          comment: 'His calm approach to coaching is refreshing. Focuses on fundamentals and mental aspects.',
          date: '2023-04-05',
        },
        {
          studentId: 'student18',
          rating: 5,
          comment: 'Learning from Captain Cool himself is an experience like no other. Worth every penny.',
          date: '2023-03-12',
        }
      ],
    },
    programs: [
      {
        _id: '6',
        title: 'Wicketkeeping Excellence',
        currentStudents: 4,
        maxStudents: 6,
        category: 'elite',
        price: 16000,
      }
    ],
  },
];

export default {
  programs: programsApi,
  coaches: coachesApi,
  payments: paymentsApi,
  contacts: contactsApi,
};