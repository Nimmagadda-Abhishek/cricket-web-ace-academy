import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProgramsSection = () => {
  const navigate = useNavigate();
  const [showAllCards, setShowAllCards] = useState(false);
  
  const programs = [
    {
      title: 'Group Training',
      description: 'Perfect for beginners and team building. Develop fundamental skills in a supportive group environment.',
      level: 'Beginner to Intermediate',
      icon: '👥',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      image: '/images/programs/01.jpg',
      highlights: ['Team Building', 'Basic Skills', 'Match Practice', 'Fitness Training']
    },
    {
      title: 'Personal Training',
      description: 'One-on-one coaching for rapid skill improvement. Customized training plans for individual goals.',
      level: 'Intermediate',
      icon: '🎯',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      image: '/images/programs/02.webp',
      highlights: ['Individual Focus', 'Video Analysis', 'Technique Refinement', 'Performance Tracking']
    },
    {
      title: 'Elite Coaching',
      description: 'Advanced training for serious players. Professional-level coaching for competitive cricket.',
      level: 'Advanced',
      icon: '🏆',
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      image: '/images/programs/03.webp',
      highlights: ['Elite Training', 'Tournament Prep', 'Mental Coaching', 'Career Guidance']
    },
    {
      title: 'Corporate Program',
      description: 'Team building through cricket. Perfect for corporate groups and office teams.',
      level: 'All Levels',
      icon: '🏢',
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      image: '/images/corporate-cricket-program.jpg',
      highlights: ['Team Building', 'Corporate Events', 'Fitness Focus', 'Leadership Skills']
    },
    {
      title: 'Youth Development',
      description: 'Specialized training for young players. Focus on fundamentals and fun.',
      level: 'Beginner',
      icon: '🌟',
      color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      image: 'https://kalyancricketacademy.in/wp-content/uploads/2025/03/Kalyan-Cricket-Academy-%E2%80%83-1024x576.jpg',
      highlights: ['Fun Learning', 'Basic Skills', 'Team Spirit', 'Confidence Building']
    },
    {
      title: 'Advanced Batting',
      description: 'Specialized batting techniques and strategies for advanced players.',
      level: 'Advanced',
      icon: '🏏',
      color: 'bg-gradient-to-br from-red-500 to-pink-600',
      image: 'https://kalyancricketacademy.in/wp-content/uploads/2025/03/cricket-1-1024x682-1.webp',
      highlights: ['Batting Mastery', 'Shot Selection', 'Match Strategy', 'Mental Toughness']
    }
  ];

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
            Choose from our comprehensive range of cricket programs designed for all skill levels
          </p>
        </div>

        {/* Apple Intelligence Style Cards Container */}
        <div className="relative">
        {/* Responsive Grid Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate('/programs')}
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden rounded-lg">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>

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
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-cricket-orange transition-colors duration-300 font-sf-pro">
                  {program.title}
                </h3>
                <p className="text-secondary mb-4 text-sm leading-relaxed font-sf-pro">
                  {program.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {program.highlights.map((highlight, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gradient-to-r from-cricket-orange/10 to-cricket-purple/10 text-cricket-orange text-xs font-medium rounded-full border border-cricket-orange/20 font-sf-pro">
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Ghost Style Button */}
                <button
                  type="button"
                  onClick={() => navigate('/programs')}
                  className="w-full border border-cricket-orange text-cricket-orange py-2 px-6 rounded-full font-semibold hover:bg-cricket-orange hover:text-white transition-colors duration-300"
                >
                  Get Started
                </button>
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

