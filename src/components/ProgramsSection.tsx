
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProgramsSection = () => {
  const programs = [
    {
      title: 'Junior Cricket (6-12 years)',
      description: 'Fun-based learning with focus on basic skills, hand-eye coordination, and team spirit through engaging activities.',
      features: ['Basic batting & bowling', 'Fielding fundamentals', 'Team games & drills', 'Safety first approach'],
      price: '$80/month',
      duration: '2 hours/week',
      icon: '🏏',
      color: 'from-blue-400 to-blue-600',
      image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Youth Development (13-17 years)',
      description: 'Comprehensive training focusing on technique refinement, competitive play, and character development.',
      features: ['Advanced techniques', 'Match strategies', 'Fitness training', 'Mental conditioning'],
      price: '$120/month',
      duration: '4 hours/week',
      icon: '⚡',
      color: 'from-cricket-orange to-cricket-gold',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Adult Programs (18+ years)',
      description: 'Professional coaching for adults looking to improve their game, stay fit, and enjoy competitive cricket.',
      features: ['Skill development', 'Match preparation', 'Fitness coaching', 'League preparation'],
      price: '$150/month',
      duration: '5 hours/week',
      icon: '🎯',
      color: 'from-green-400 to-green-600',
      image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Elite Training',
      description: 'High-performance program for aspiring professional players with personalized coaching and advanced analytics.',
      features: ['1-on-1 coaching', 'Video analysis', 'Sports psychology', 'Tournament prep'],
      price: '$300/month',
      duration: '10 hours/week',
      icon: '👑',
      color: 'from-purple-400 to-purple-600',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="programs" className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cricket-orange rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-cricket-green rounded-full animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cricket-gold rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-5xl font-bold font-poppins heading-gradient mb-6">
            Training Programs
          </h2>
          <div className="w-24 h-1 bg-cricket-orange mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Choose from our comprehensive range of cricket programs designed for all ages and skill levels,
            each crafted to unlock your full potential on the field.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <Card key={index} className="group hover-lift border-0 shadow-xl overflow-hidden bg-white relative">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundImage: `url('${program.image}')` }}
              ></div>
              
              <CardHeader className="relative z-10 text-center pb-4">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${program.color} text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {program.icon}
                </div>
                <CardTitle className="text-xl font-poppins text-cricket-green mb-3 group-hover:text-cricket-orange transition-colors duration-300">
                  {program.title}
                </CardTitle>
                <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                <div className="space-y-3">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3 group/item">
                      <div className="w-5 h-5 bg-cricket-orange rounded-full flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 text-sm group-hover/item:text-cricket-green transition-colors duration-200">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">Duration:</span>
                    <span className="font-medium text-cricket-green">{program.duration}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 text-sm">Price:</span>
                    <span className="text-2xl font-bold text-cricket-orange">{program.price}</span>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-cricket-green to-cricket-orange hover:from-cricket-orange hover:to-cricket-green text-white font-semibold py-3 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    🚀 Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center animate-fadeInUp">
          <div className="bg-gradient-to-r from-cricket-green to-cricket-orange rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-3xl font-bold font-poppins mb-4">Not Sure Which Program to Choose?</h3>
            <p className="text-xl mb-6 opacity-90">Book a free consultation with our expert coaches to find the perfect program for your goals.</p>
            <Button className="bg-white text-cricket-green hover:bg-gray-100 px-8 py-3 font-semibold rounded-full transform transition-all duration-300 hover:scale-105">
              📞 Book Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
