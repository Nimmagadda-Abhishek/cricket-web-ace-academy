
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProgramsSection = () => {
  const programs = [
    {
      title: 'Junior Cricket (6-12 years)',
      description: 'Fun-based learning with focus on basic skills, hand-eye coordination, and team spirit.',
      features: ['Basic batting & bowling', 'Fielding fundamentals', 'Team games', 'Safety first approach'],
      price: '$80/month',
      duration: '2 hours/week',
      icon: '🏏'
    },
    {
      title: 'Youth Development (13-17 years)',
      description: 'Comprehensive training focusing on technique refinement and competitive play.',
      features: ['Advanced techniques', 'Match strategies', 'Fitness training', 'Mental conditioning'],
      price: '$120/month',
      duration: '4 hours/week',
      icon: '⚡'
    },
    {
      title: 'Adult Programs (18+ years)',
      description: 'Professional coaching for adults looking to improve their game or stay fit.',
      features: ['Skill development', 'Match preparation', 'Fitness coaching', 'League preparation'],
      price: '$150/month',
      duration: '5 hours/week',
      icon: '🎯'
    },
    {
      title: 'Elite Training',
      description: 'High-performance program for aspiring professional players.',
      features: ['1-on-1 coaching', 'Video analysis', 'Sports psychology', 'Tournament prep'],
      price: '$300/month',
      duration: '10 hours/week',
      icon: '👑'
    }
  ];

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-poppins text-cricket-green mb-4">
            Training Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of cricket programs designed for all ages and skill levels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <Card key={index} className="hover-lift border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="text-5xl mb-4">{program.icon}</div>
                <CardTitle className="text-xl font-poppins text-cricket-green mb-2">
                  {program.title}
                </CardTitle>
                <p className="text-gray-600 text-sm">{program.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-cricket-orange rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-cricket-green">{program.duration}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Price:</span>
                    <span className="text-2xl font-bold text-cricket-orange">{program.price}</span>
                  </div>
                  <Button className="w-full bg-cricket-green hover:bg-cricket-green/90">
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
