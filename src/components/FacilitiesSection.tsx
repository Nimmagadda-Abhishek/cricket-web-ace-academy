
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const FacilitiesSection = () => {
  const facilities = [
    {
      title: 'Indoor Training Nets',
      description: 'Climate-controlled indoor nets with professional bowling machines and video analysis systems.',
      features: ['6 professional nets', 'Video analysis', 'Bowling machines', 'Climate controlled'],
      icon: '🏠'
    },
    {
      title: 'Outdoor Practice Grounds',
      description: 'Full-size grass wickets and practice areas for match simulation and skill development.',
      features: ['3 grass wickets', 'Practice pitches', 'Boundary ropes', 'Flood lighting'],
      icon: '🌱'
    },
    {
      title: 'Fitness Center',
      description: 'Modern gym equipped with cricket-specific training equipment and recovery facilities.',
      features: ['Modern equipment', 'Cricket-specific training', 'Recovery room', 'Physiotherapy'],
      icon: '💪'
    },
    {
      title: 'Sports Science Lab',
      description: 'Advanced biomechanical analysis and performance monitoring equipment.',
      features: ['Motion capture', 'Performance analysis', 'Biomechanics', 'Speed guns'],
      icon: '🔬'
    },
    {
      title: 'Meeting Rooms',
      description: 'Modern classrooms for theoretical sessions, strategy discussions, and mental training.',
      features: ['Smart boards', 'Video analysis', 'Strategy sessions', 'Mental training'],
      icon: '📚'
    },
    {
      title: 'Pro Shop',
      description: 'Fully stocked cricket equipment store with latest gear and custom fitting services.',
      features: ['Latest equipment', 'Custom fitting', 'Repairs service', 'Expert advice'],
      icon: '🛍️'
    }
  ];

  return (
    <section id="facilities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-poppins text-cricket-green mb-4">
            World-Class Facilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Train like a professional with our state-of-the-art facilities designed to 
            enhance every aspect of your cricket development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <Card key={index} className="hover-lift border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">{facility.icon}</div>
                <h3 className="text-xl font-bold font-poppins text-cricket-green mb-3">
                  {facility.title}
                </h3>
                <p className="text-gray-600 mb-4">{facility.description}</p>
                
                <div className="space-y-2">
                  {facility.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-cricket-orange rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-cricket-green to-cricket-orange rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold font-poppins text-white mb-4">
            Book a Facility Tour
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Experience our world-class facilities firsthand. Schedule a personal tour and see 
            why CricketPro Academy is the premier choice for cricket training.
          </p>
          <button className="bg-white text-cricket-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Schedule Tour
          </button>
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
