
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProgramsSection = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showAllCards, setShowAllCards] = useState(false);
  
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
      image: '/images/corporate-cricket-program.jpg',
      coach: 'Coach Arjun',
      experience: '8+ Years',
      schedule: 'Weekends',
      time: '9:00 AM - 12:00 PM',
      highlights: ['Team Building', 'Corporate Events', 'Fitness Focus', 'Leadership Skills']
    },
    {
      title: 'Youth Development',
      description: 'Specialized training for young players aged 6-12. Focus on fundamentals and fun.',
      level: 'Beginner',
      ageGroup: '6-12 Years',
      icon: '🌟',
      color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      image: 'https://kalyancricketacademy.in/wp-content/uploads/2025/03/Kalyan-Cricket-Academy-%E2%80%83-1024x576.jpg',
      coach: 'Coach Meera',
      experience: '8+ Years',
      schedule: 'Sat, Sun',
      time: '10:00 AM - 12:00 PM',
      highlights: ['Fun Learning', 'Basic Skills', 'Team Spirit', 'Confidence Building']
    },
    {
      title: 'Advanced Batting',
      description: 'Specialized batting techniques and strategies for advanced players.',
      level: 'Advanced',
      ageGroup: '16+ Years',
      icon: '🏏',
      color: 'bg-gradient-to-br from-red-500 to-pink-600',
      image: 'https://kalyancricketacademy.in/wp-content/uploads/2025/03/cricket-1-1024x682-1.webp',
      coach: 'Coach Rahul',
      experience: '14+ Years',
      schedule: 'Tue, Thu',
      time: '7:00 PM - 9:00 PM',
      highlights: ['Batting Mastery', 'Shot Selection', 'Match Strategy', 'Mental Toughness']
    }
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleViewMore = () => {
    navigate('/programs');
  };

  const displayedPrograms = showAllCards ? programs : programs.slice(0, 4);

  return (
    <section id="programs" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden parallax-section">
      {/* Enhanced Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cricket-orange/12 to-cricket-purple/12 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-cricket-green/12 to-cricket-orange/12 rounded-full parallax-bg-element-2"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-cricket-purple/12 to-cricket-green/12 rounded-full parallax-bg-element-3"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-cricket-orange/8 to-cricket-purple/8 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-gradient-to-br from-cricket-green/8 to-cricket-orange/8 rounded-full parallax-bg-element-2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold font-poppins gradient-text-programs mb-6">
            Training Programs
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Choose from our comprehensive range of cricket programs designed for all ages and skill levels
          </p>
        </div>

        {/* Apple Intelligence Style Cards Container */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayedPrograms.map((program, index) => (
              <div 
                key={index} 
                className="min-w-[380px] max-w-[380px] flex-shrink-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Apple Intelligence Style Card */}
                <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 card-fade-in">
                  {/* Card Header with Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Icon Badge */}
                    <div className={`absolute top-4 right-4 w-14 h-14 ${program.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg backdrop-blur-md`}>
                      {program.icon}
                    </div>
                    
                    {/* Level Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-full px-3 py-1 text-xs font-semibold text-gray-800">
                      {program.level}
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-cricket-orange transition-colors duration-300">
                      {program.title}
                    </h3>
                    <p className="text-secondary mb-4 text-sm leading-relaxed">
                      {program.description}
                    </p>
                    
                    {/* Program Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <span className="text-cricket-orange font-semibold mr-2">Age:</span>
                        <span className="text-primary-body">{program.ageGroup}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-cricket-orange font-semibold mr-2">Coach:</span>
                        <span className="text-primary-body">{program.coach} ({program.experience})</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-cricket-orange font-semibold mr-2">Schedule:</span>
                        <span className="text-primary-body">{program.schedule} • {program.time}</span>
                      </div>
                    </div>
                    
                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {program.highlights.map((highlight, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gradient-to-r from-cricket-orange/10 to-cricket-purple/10 text-cricket-orange text-xs font-medium rounded-full border border-cricket-orange/20">
                          {highlight}
                        </span>
                      ))}
                    </div>
                    
                    {/* Action Button */}
                    <button 
                      type="button"
                      onClick={() => navigate('/programs')}
                      className="w-full bg-gradient-to-r from-cricket-green to-cricket-orange text-white py-3 px-6 rounded-2xl font-semibold hover:from-cricket-orange hover:to-cricket-purple transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Get Started
                    </button>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cricket-orange/0 via-cricket-orange/5 to-cricket-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleViewMore}
            className="bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 px-8 py-3 rounded-2xl font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            View All Programs
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProgramsSection;
