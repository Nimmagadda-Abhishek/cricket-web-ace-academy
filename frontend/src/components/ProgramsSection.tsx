import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProgramsSection = () => {
  const navigate = useNavigate();
  const [showAllCards, setShowAllCards] = useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);
  
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
      title: 'NRI Excellence Program',
      description: 'Intensive short-term program for overseas players with high-intensity drills, match simulations, and adaptation to Indian conditions.',
      level: 'Intermediate to Advanced',
      icon: '🌍',
      color: 'bg-gradient-to-br from-teal-500 to-sky-600',
      image: 'https://content.jdmagicbox.com/comp/def_content/cricket-coaching-classes/shutterstock-647586433-cricket-coaching-classes-9-qtn7q.jpg',
      highlights: [
        'High-intensity drills',
        'Match sims: turf & matting',
        'Adapt to Indian conditions',
        'Specialist coaching & machines'
      ]
    },
  ];

  const handleViewMore = () => {
    navigate('/programs');
  };

  const displayedPrograms = programs.slice(0, 3);

  return (
    <section id="programs" className="py-20 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden parallax-section" ref={sectionRef}>
      {/* Enhanced Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-28 h-28 bg-gradient-to-br from-cricket-green/15 to-cricket-orange/15 rounded-full parallax-bg-element-2"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-br from-cricket-purple/15 to-cricket-green/15 rounded-full parallax-bg-element"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-cricket-orange/15 to-cricket-purple/15 rounded-full parallax-bg-element-3"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-cricket-green/10 to-cricket-orange/10 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-cricket-purple/10 to-cricket-orange/10 rounded-full parallax-bg-element-2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold font-poppins gradient-text-facilities mb-6">
            Training Programs
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Choose from our comprehensive range of cricket programs designed for all skill levels
          </p>
        </div>

        {/* Apple Intelligence Style Cards Container */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => {
              const container = document.getElementById('programs-scroll');
              if (container) {
                container.scrollBy({ left: -400, behavior: 'smooth' });
              }
            }}
            className="w-12 h-12 bg-gradient-to-r from-cricket-green to-cricket-orange text-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:from-cricket-orange hover:to-cricket-purple hover:scale-110 absolute left-0 top-1/2 transform -translate-y-1/2 z-20"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => {
              const container = document.getElementById('programs-scroll');
              if (container) {
                container.scrollBy({ left: 400, behavior: 'smooth' });
              }
            }}
            className="w-12 h-12 bg-gradient-to-r from-cricket-green to-cricket-orange text-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:from-cricket-orange hover:to-cricket-purple hover:scale-110 absolute right-0 top-1/2 transform -translate-y-1/2 z-20"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div 
            id="programs-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 px-2 smooth-scroll"
          >
            {programs.map((program, index) => (
              <div 
                key={index} 
                className="min-w-[380px] max-w-[380px] flex-shrink-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Apple Intelligence Style Card */}
                <div
                  className="group relative bg-white/30 backdrop-blur-lg rounded-[24px] shadow-lg p-6 hover:shadow-xl hover:scale-[1.05] transition-transform duration-500 cursor-pointer animate-fadeIn flex flex-col h-[520px]"
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

                    {/* Level Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-full px-3 py-1 text-xs font-semibold text-gray-800">
                      {program.level}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col flex-grow mt-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-cricket-orange transition-colors duration-300 font-sf-pro">
                      {program.title}
                    </h3>
                    <p className="text-secondary mb-4 text-sm leading-relaxed font-sf-pro line-clamp-2">
                      {program.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
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
                      className="w-full mt-auto bg-gradient-to-r from-cricket-green to-cricket-orange text-white py-3 px-6 rounded-xl font-semibold hover:from-cricket-orange hover:to-cricket-purple transition-all duration-300 transform hover:scale-105"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* View More Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleViewMore}
            className="bg-gradient-to-r from-cricket-green to-cricket-orange text-white px-8 py-3 rounded-lg font-semibold hover:from-cricket-orange hover:to-cricket-purple transition-all duration-300 transform hover:scale-105"
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

