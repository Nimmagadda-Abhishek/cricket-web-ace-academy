
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const FacilitiesSection = () => {
  const navigate = useNavigate();
  
  const facilities = [
    {
      title: 'High-Performance Practice Nets',
      description: '15 nets with Turf, Astro-Turf, Cement & Matting surfaces. Train in diverse conditions to improve batting, bowling & adaptability.',
      features: ['15 professional nets', 'Multiple surface types', 'Turf & Astro-Turf', 'Cement & Matting surfaces'],
      icon: '🏏'
    },
    {
      title: 'All-Weather Indoor Cricket Nets',
      description: 'Indoor practice for uninterrupted training, rain or shine. Perfect for skill refinement, technical drills & high-intensity sessions.',
      features: ['Weather-proof training', 'Technical drill focus', 'High-intensity sessions', 'Year-round availability'],
      icon: '🏠'
    },
    {
      title: 'Floodlit Nets & Ground',
      description: 'Evening & night practice with professional floodlit setup. Enhances visibility, reflexes & adaptability to different lighting conditions.',
      features: ['Professional floodlights', 'Evening & night practice', 'Enhanced visibility training', 'Reflex improvement'],
      icon: '💡'
    },
    {
      title: 'Full-Fledged Match Ground',
      description: 'International-standard ground for matches & professional training. Ideal for team games, simulations & skill enhancement.',
      features: ['International standards', 'Match simulations', 'Team games', 'Professional training'],
      icon: '🏟️'
    },
    {
      title: 'Strength & Conditioning Center',
      description: 'Cricket-specific training with state-of-the-art fitness equipment. Expert coaches for strength, endurance & agility development.',
      features: ['State-of-the-art equipment', 'Cricket-specific training', 'Strength & endurance', 'Agility development'],
      icon: '💪'
    },
    {
      title: 'Advanced Video Analysis',
      description: 'Dedicated setup for performance tracking & technique improvement. Personalized feedback for refining gameplay.',
      features: ['Performance tracking', 'Technique analysis', 'Personalized feedback', 'Gameplay refinement'],
      icon: '📹'
    },
    {
      title: 'HCA League Club Teams',
      description: 'Participation in One-Day, Two-Day & Three-Day HCA League matches. Build match temperament with top-level competition.',
      features: ['HCA League participation', 'Multiple match formats', 'Competitive exposure', 'Match temperament building'],
      icon: '🏆'
    },
    {
      title: 'International Exposure & Tie-Ups',
      description: 'Official collaborations with clubs in State and Sri Lanka & Nepal. Exclusive opportunities to train & play with international teams.',
      features: ['International collaborations', 'Sri Lanka & Nepal tie-ups', 'Exclusive opportunities', 'International exposure'],
      icon: '🌍'
    },
    {
      title: 'Nutrition & Recovery Program',
      description: 'Sports nutrition plans for peak performance & endurance. Physiotherapy, ice baths & injury prevention programs.',
      features: ['Sports nutrition plans', 'Physiotherapy services', 'Ice bath facilities', 'Injury prevention'],
      icon: '🥗'
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
            why Kalyan Cricket Academy is the premier choice for cricket training.
          </p>
          <button 
            type="button"
            onClick={() => navigate('/contact')}
            className="bg-white text-cricket-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Schedule Tour
          </button>
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
