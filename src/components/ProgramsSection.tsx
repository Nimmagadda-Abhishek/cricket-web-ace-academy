
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProgramsSection = () => {
  const programs = [
    {
      title: 'Junior Cricket (6-12 years)',
      description: 'Fun-based learning with focus on basic skills, hand-eye coordination, and team spirit through engaging activities.',
      features: ['Basic batting & bowling', 'Fielding fundamentals', 'Team games & drills', 'Safety first approach'],
      price: '₹6,500/month',
      duration: '2 hours/week',
      icon: '🏏',
      color: 'from-blue-400 to-blue-600',
      image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Youth Development (13-17 years)',
      description: 'Comprehensive training focusing on technique refinement, competitive play, and character development.',
      features: ['Advanced techniques', 'Match strategies', 'Fitness training', 'Mental conditioning'],
      price: '₹10,000/month',
      duration: '4 hours/week',
      icon: '⚡',
      color: 'from-cricket-orange to-cricket-gold',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Adult Programs (18+ years)',
      description: 'Professional coaching for adults looking to improve their game, stay fit, and enjoy competitive cricket.',
      features: ['Skill development', 'Match preparation', 'Fitness coaching', 'League preparation'],
      price: '₹12,500/month',
      duration: '5 hours/week',
      icon: '🎯',
      color: 'from-green-400 to-green-600',
      image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Elite Training',
      description: 'High-performance program for aspiring professional players with personalized coaching and advanced analytics.',
      features: ['1-on-1 coaching', 'Video analysis', 'Sports psychology', 'Tournament prep'],
      price: '₹25,000/month',
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
            <Card 
              key={index} 
              className={`group card-hover gradient-card border-0 shadow-xl overflow-hidden bg-white relative animate-bounceIn stagger-${index + 1}`}
            >
              {/* Background Image with Enhanced Effects */}
              <div className="image-overlay absolute inset-0 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover opacity-10 group-hover:opacity-20 image-zoom transition-all duration-500"
                />
              </div>
              
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cricket-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative z-10 text-center pb-4">
                {/* Enhanced Icon with Multiple Animations */}
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${program.color} text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg animate-zoomIn animate-heartbeat`}>
                  {program.icon}
                </div>
                
                {/* Animated Title */}
                <CardTitle className="text-xl font-poppins text-cricket-green mb-3 group-hover:text-cricket-orange transition-colors duration-300 animate-slideUp">
                  {program.title}
                </CardTitle>
                
                {/* Description with Animation */}
                <p className="text-gray-600 text-sm leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  {program.description}
                </p>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                {/* Enhanced Features List */}
                <div className="space-y-3">
                  {program.features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center space-x-3 group/item animate-slideInLeft stagger-${idx + 1}`}
                    >
                      <div className="w-5 h-5 bg-cricket-orange rounded-full flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200 animate-bounceIn">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 text-sm group-hover/item:text-cricket-green transition-colors duration-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Enhanced Pricing Section */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2 animate-slideInRight">
                    <span className="text-gray-500 text-sm">Duration:</span>
                    <span className="font-medium text-cricket-green animate-shimmer">{program.duration}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6 animate-slideInRight" style={{ animationDelay: '0.1s' }}>
                    <span className="text-gray-500 text-sm">Price:</span>
                    <span className="text-2xl font-bold text-cricket-orange animate-shimmer">{program.price}</span>
                  </div>
                  
                  {/* Enhanced Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-cricket-green to-cricket-orange hover:from-cricket-orange hover:to-cricket-green text-white font-semibold py-3 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ripple-effect animate-bounceIn"
                    style={{ animationDelay: '0.3s' }}
                  >
                    🚀 Enroll Now
                  </Button>
                </div>
              </CardContent>
              
              {/* Floating Decorative Elements */}
              <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <div className="text-lg animate-float">{program.icon}</div>
              </div>
              <div className="absolute bottom-2 left-2 opacity-10 group-hover:opacity-30 transition-opacity duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-cricket-orange/30 to-cricket-gold/30 rounded-full animate-pulse-slow"></div>
              </div>
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
