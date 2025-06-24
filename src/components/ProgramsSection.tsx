
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProgramsSection = () => {
  const navigate = useNavigate();
  
  const programs = [
    {
      title: 'Group Training',
      description: 'Perfect for beginners and team building. Develop fundamental skills in a supportive group environment.',
      level: 'Beginner to Intermediate',
      ageGroup: 'All Ages',
      icon: '👥',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      image: 'https://kalyancricketacademy.in/wp-content/uploads/2025/03/Kalyan-Cricket-Academy-%E2%80%83-1024x576.jpg',
      coach: 'Coach Vikram',
      experience: '10+ Years',
      schedule: 'Mon, Wed, Fri',
      time: '4:00 PM - 6:00 PM',
      highlights: ['Team Building', 'Basic Skills', 'Match Practice', 'Fitness Training']
    },
    {
      title: 'Personal Training',
      description: 'One-on-one coaching for rapid skill improvement. Customized training plans for individual goals.',
      level: 'Intermediate',
      ageGroup: '12+ Years',
      icon: '🎯',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      image: 'https://kalyancricketacademy.in/wp-content/uploads/2025/03/cricket-1-1024x682-1.webp',
      coach: 'Coach Priya',
      experience: '12+ Years',
      schedule: 'Tue, Thu, Sat',
      time: '5:00 PM - 7:00 PM',
      highlights: ['Individual Focus', 'Video Analysis', 'Technique Refinement', 'Performance Tracking']
    },
    {
      title: 'Elite Coaching',
      description: 'Advanced training for serious players. Professional-level coaching for competitive cricket.',
      level: 'Advanced',
      ageGroup: '14+ Years',
      icon: '🏆',
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      image: 'https://kalyancricketacademy.in/wp-content/uploads/2025/03/Untitled-design-28-1024x576.png',
      coach: 'Coach Rajesh',
      experience: '15+ Years',
      schedule: 'Mon-Fri',
      time: '6:00 AM - 9:00 AM',
      highlights: ['Elite Training', 'Tournament Prep', 'Mental Coaching', 'Career Guidance']
    },
    {
      title: 'Corporate Program',
      description: 'Team building through cricket. Perfect for corporate groups and office teams.',
      level: 'All Levels',
      ageGroup: '22+ Years',
      icon: '🏢',
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      coach: 'Coach Arjun',
      experience: '8+ Years',
      schedule: 'Weekends',
      time: '9:00 AM - 12:00 PM',
      highlights: ['Team Building', 'Corporate Events', 'Fitness Focus', 'Leadership Skills']
    }
  ];

  return (
    <section id="programs" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cricket-orange rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-cricket-green rounded-full animate-float"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-5xl font-bold font-poppins heading-gradient mb-6">
            Training Programs
          </h2>
          <div className="w-24 h-1 bg-cricket-orange mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Choose from our comprehensive range of cricket programs designed for all ages and skill levels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <Card 
              key={index} 
              className={`group card-hover border-0 shadow-xl overflow-hidden bg-white relative animate-bounceIn stagger-${index + 1} hover:shadow-2xl transition-all duration-500`}
            >
              {/* Program Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Program Icon */}
                <div className={`absolute top-4 right-4 w-12 h-12 ${program.color} rounded-full flex items-center justify-center text-white text-xl shadow-lg`}>
                  {program.icon}
                </div>
              </div>

              <CardContent className="p-6">
                {/* Program Title */}
                <h3 className="text-xl font-bold text-cricket-green mb-2 group-hover:text-cricket-orange transition-colors duration-300">
                  {program.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {program.description}
                </p>

                {/* Program Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Level:</span>
                    <span className="font-medium text-cricket-green">{program.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Age Group:</span>
                    <span className="font-medium text-cricket-green">{program.ageGroup}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Coach:</span>
                    <span className="font-medium text-cricket-green">{program.coach}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Schedule:</span>
                    <span className="font-medium text-cricket-green">{program.schedule}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Program Highlights:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {program.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cricket-orange rounded-full"></div>
                        <span className="text-xs text-gray-600">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  type="button"
                  onClick={() => navigate('/programs')}
                  className="w-full bg-cricket-green hover:bg-cricket-orange text-white font-semibold py-3 rounded-lg transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center animate-fadeInUp">
          <div className="bg-gradient-to-r from-cricket-green to-cricket-orange rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-3xl font-bold font-poppins mb-4">Ready to Start Your Cricket Journey?</h3>
            <p className="text-xl mb-6 opacity-90">Book a free consultation with our expert coaches to find the perfect program for your goals.</p>
            <Button 
              type="button"
              onClick={() => navigate('/contact')}
              className="bg-white text-cricket-green hover:bg-gray-100 px-8 py-3 font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
            >
              📞 Book Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
