import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Programs = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const programs = [
    {
      id: '1',
      title: 'Group Training',
      category: 'group',
      description: 'Ideal for players looking to build strong fundamentals. Develops skills, teamwork, and match awareness through structured group sessions.',
      ageGroup: 'All ages',
      level: 'Beginner to Intermediate',
      icon: '🏆',
      color: 'from-blue-400 to-blue-600',
      image: 'https://kalyancricketacademy.in/wp-content/uploads/2025/03/Kalyan-Cricket-Academy-%E2%80%83-1024x576.jpg',
      features: [
        '5 Days a Week - Balanced skill & fitness sessions',
        'Skill Drills (2 Days) - Batting, bowling & game strategy',
        'Team building activities',
        'Match simulations'
      ],
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        time: '4:00 PM - 6:00 PM',
        venue: 'Main Practice Ground'
      },
      coach: {
        name: 'Coach Vikram',
        experience: '10 years'
      }
    },
    {
      id: '2',
      title: 'Personalized Training',
      category: 'individual',
      description: 'Designed for players who want individualized guidance. Enhances technique, confidence & match performance through one-on-one attention.',
      ageGroup: '12+ years',
      level: 'Intermediate',
      icon: '🎯',
      color: 'from-orange-400 to-orange-600',
      image: 'https://kalyancricketacademy.in/wp-content/uploads/2025/03/cricket-1-1024x682-1.webp',
      features: [
        'Skill Refinement - Master batting, bowling & strategy',
        'Video Analysis - Expert review to fine-tune techniques',
        'Individual attention from coaches',
        'Customized training plans'
      ],
      schedule: {
        days: ['Tuesday', 'Thursday', 'Saturday'],
        time: '5:00 PM - 7:00 PM',
        venue: 'Individual Training Nets'
      },
      coach: {
        name: 'Coach Priya',
        experience: '12 years'
      }
    },
    {
      id: '3',
      title: 'One-on-One Elite Coaching',
      category: 'elite',
      description: 'Tailored coaching to refine techniques & game awareness. Master coach guidance for advanced skill development and professional preparation.',
      ageGroup: '14+ years',
      level: 'Advanced',
      icon: '🥇',
      color: 'from-purple-400 to-purple-600',
      image: 'https://kalyancricketacademy.in/wp-content/uploads/2025/03/Untitled-design-28-1024x576.png',
      features: [
        'Specialized Training - Batting, bowling & fielding with turf practice',
        'Video Analysis & Feedback - Track progress & improve techniques',
        'Elite coach mentorship',
        'Tournament preparation'
      ],
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
        time: '6:00 AM - 9:00 AM',
        venue: 'Elite Training Center'
      },
      coach: {
        name: 'Coach Rajesh',
        experience: '15 years'
      }
    },
    {
      id: '4',
      title: 'Corporate Cricket Program',
      category: 'corporate',
      description: 'Designed for corporate teams to improve cricket skills & team dynamics. Blends fitness, strategy & leadership in a fun, engaging format.',
      ageGroup: '22+ years',
      level: 'All Levels',
      icon: '🏢',
      color: 'from-green-400 to-green-600',
      image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: [
        'Skill Training - Improve batting, bowling & fielding',
        'Fitness & Strength - Build endurance & prevent injuries',
        'Team building exercises',
        'Corporate tournaments'
      ],
      schedule: {
        days: ['Saturday', 'Sunday'],
        time: '9:00 AM - 12:00 PM',
        venue: 'Corporate Training Ground'
      },
      coach: {
        name: 'Coach Arjun',
        experience: '8 years'
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Programs', icon: '🏏' },
    { id: 'group', name: 'Group Training', icon: '👥' },
    { id: 'individual', name: 'Individual', icon: '🎯' },
    { id: 'elite', name: 'Elite', icon: '🥇' },
    { id: 'corporate', name: 'Corporate', icon: '🏢' }
  ];

  const filteredPrograms = selectedCategory === 'all' 
    ? programs 
    : programs.filter(program => program.category === selectedCategory);

  const handleEnrollNow = (programId: string) => {
    navigate('/contact');
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-cricket-green to-cricket-orange overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold font-poppins text-white mb-6">
                Our Training
                <span className="block text-white">Programs</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                Choose from our comprehensive range of cricket training programs designed to elevate your game at every level
              </p>
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                  <span className="text-white font-semibold">🎯 Find Your Perfect Program</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-12 bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-cricket-orange text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {filteredPrograms.map((program, index) => (
                <Card 
                  key={program.id} 
                  className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br ${program.color} text-white`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="text-4xl">{program.icon}</div>
                        <div>
                          <CardTitle className="text-2xl font-bold font-poppins text-white mb-2">
                            {program.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                              {program.level}
                            </Badge>
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                              {program.ageGroup}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-white/90 leading-relaxed">{program.description}</p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Schedule Info */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <span className="mr-2">📅</span> Schedule
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-white/90">
                          <div>
                            <span className="font-medium">Days:</span>
                            <div>{program.schedule.days.join(', ')}</div>
                          </div>
                          <div>
                            <span className="font-medium">Time:</span>
                            <div>{program.schedule.time}</div>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Venue:</span>
                            <div>{program.schedule.venue}</div>
                          </div>
                        </div>
                      </div>

                      {/* Coach Info */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <span className="mr-2">👨‍🏫</span> Coach
                        </h4>
                        <div className="text-sm text-white/90">
                          <div className="font-medium">{program.coach.name}</div>
                          <div>{program.coach.experience} experience</div>
                        </div>
                      </div>

                      {/* Features List */}
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <span className="mr-2">🎯</span> What You'll Learn
                        </h4>
                        <div className="space-y-2">
                          {program.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-white/90 text-sm">
                              <span className="text-yellow-300 mt-1">✓</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-4">
                        <Button
                          onClick={() => handleEnrollNow(program.id)}
                          className="flex-1 bg-white text-cricket-green hover:bg-gray-100 font-semibold py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                          🚀 Enroll Now
                        </Button>
                        <Button
                          variant="outline"
                          className="px-6 border-white/30 text-white hover:bg-white/10 rounded-full transition-all duration-300"
                          onClick={() => navigate('/contact')}
                        >
                          📞 Contact
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-cricket-green to-cricket-orange">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div>
              <h2 className="text-4xl font-bold font-poppins text-white mb-6">
                Ready to Start Your Cricket Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join hundreds of successful students who have transformed their game with our expert coaching
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-cricket-green hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/contact')}
                >
                  📞 Book Free Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-cricket-green px-8 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/')}
                >
                  🏠 Back to Home
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Programs;