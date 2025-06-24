
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CoachesSection = () => {
  const coaches = [
    {
      name: 'Michael Johnson',
      role: 'Head Coach & Former International Player',
      experience: '15 years coaching experience',
      specialization: 'Batting & Leadership',
      achievements: ['Former National Team Captain', '50+ International Matches', 'Level 4 Coaching Certification'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Sarah Williams',
      role: 'Bowling Specialist',
      experience: '12 years coaching experience',
      specialization: 'Fast Bowling & Technique',
      achievements: ['Former State Player', 'Youth Development Expert', 'Sports Science Degree'],
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      gradient: 'from-cricket-orange to-cricket-gold'
    },
    {
      name: 'David Thompson',
      role: 'Wicket Keeping Coach',
      experience: '10 years coaching experience',
      specialization: 'Wicket Keeping & Fielding',
      achievements: ['Former Professional Keeper', '100+ First Class Matches', 'Fielding Innovation Award'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      gradient: 'from-green-500 to-green-700'
    },
    {
      name: 'Emily Davis',
      role: 'Youth Development Coach',
      experience: '8 years coaching experience',
      specialization: 'Junior Programs & Fitness',
      achievements: ['Child Psychology Certification', 'Junior Cricket Award Winner', 'Fitness Specialist'],
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      gradient: 'from-purple-500 to-purple-700'
    }
  ];

  return (
    <section id="coaches" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cricket-orange/5 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cricket-green/5 rounded-full translate-y-48 -translate-x-48"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-5xl font-bold font-poppins heading-gradient mb-6">
            Meet Our Expert Coaches
          </h2>
          <div className="w-24 h-1 bg-cricket-orange mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Learn from the best with our team of experienced, certified coaches who bring 
            professional expertise, passion, and proven results to every training session.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coaches.map((coach, index) => (
            <Card key={index} className="group hover-lift border-0 shadow-xl overflow-hidden bg-white relative">
              <CardContent className="p-0">
                {/* Coach Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={coach.image} 
                    alt={coach.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${coach.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold font-poppins mb-1">{coach.name}</h3>
                    <p className="text-sm opacity-90">{coach.role}</p>
                  </div>
                </div>

                {/* Coach Details */}
                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="px-3 py-1 bg-cricket-orange/10 text-cricket-orange text-sm font-medium rounded-full">
                      {coach.experience}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 group-hover:bg-cricket-orange/5 transition-colors duration-300">
                    <h4 className="font-semibold text-cricket-green mb-2 text-center">Specialization</h4>
                    <p className="text-sm text-gray-700 text-center">{coach.specialization}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-cricket-green text-sm text-center mb-3">Key Achievements</h4>
                    {coach.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-center space-x-3 group/achievement">
                        <div className="w-4 h-4 bg-cricket-orange rounded-full flex items-center justify-center group-hover/achievement:scale-110 transition-transform duration-200">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-gray-700 text-xs group-hover/achievement:text-cricket-green transition-colors duration-200">{achievement}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button 
                      type="button"
                      onClick={() => {
                        console.log(`Viewing profile for ${coach.name}`);
                        window.location.href = `/coaches/${index + 1}`;
                      }}
                      className="w-full py-2 px-4 bg-gradient-to-r from-cricket-green to-cricket-orange text-white rounded-full font-medium text-sm hover:from-cricket-orange hover:to-cricket-green transition-all duration-300 transform hover:scale-105"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '50+', label: 'Years Combined Experience', icon: '⏰' },
            { number: '200+', label: 'International Matches', icon: '🌍' },
            { number: '15', label: 'Coaching Certifications', icon: '🏆' },
            { number: '1000+', label: 'Players Trained', icon: '👥' }
          ].map((stat, index) => (
            <div key={index} className="text-center animate-scaleIn" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cricket-orange to-cricket-gold rounded-full text-2xl mb-3 shadow-lg">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold font-poppins text-cricket-green mb-1">{stat.number}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoachesSection;
