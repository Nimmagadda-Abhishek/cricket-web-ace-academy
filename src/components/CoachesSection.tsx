
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
      image: '👨‍🏫'
    },
    {
      name: 'Sarah Williams',
      role: 'Bowling Specialist',
      experience: '12 years coaching experience',
      specialization: 'Fast Bowling & Technique',
      achievements: ['Former State Player', 'Youth Development Expert', 'Sports Science Degree'],
      image: '👩‍🏫'
    },
    {
      name: 'David Thompson',
      role: 'Wicket Keeping Coach',
      experience: '10 years coaching experience',
      specialization: 'Wicket Keeping & Fielding',
      achievements: ['Former Professional Keeper', '100+ First Class Matches', 'Fielding Innovation Award'],
      image: '🥅'
    },
    {
      name: 'Emily Davis',
      role: 'Youth Development Coach',
      experience: '8 years coaching experience',
      specialization: 'Junior Programs & Fitness',
      achievements: ['Child Psychology Certification', 'Junior Cricket Award Winner', 'Fitness Specialist'],
      image: '👩‍🎓'
    }
  ];

  return (
    <section id="coaches" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-poppins text-cricket-green mb-4">
            Meet Our Expert Coaches
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from the best with our team of experienced, certified coaches who bring 
            professional expertise and passion to every training session
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coaches.map((coach, index) => (
            <Card key={index} className="hover-lift border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">{coach.image}</div>
                <h3 className="text-xl font-bold font-poppins text-cricket-green mb-1">
                  {coach.name}
                </h3>
                <p className="text-cricket-orange font-medium mb-2">{coach.role}</p>
                <p className="text-gray-600 text-sm mb-4">{coach.experience}</p>
                
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-cricket-green mb-2">Specialization</h4>
                  <p className="text-sm text-gray-700">{coach.specialization}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-cricket-green text-sm">Key Achievements</h4>
                  {coach.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cricket-orange rounded-full"></div>
                      <span className="text-gray-700 text-xs">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoachesSection;
