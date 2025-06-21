
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Alex Rodriguez',
      role: 'State Team Player',
      content: 'CricketPro Academy transformed my game completely. The coaching staff helped me develop both technically and mentally. Now I\'m playing at state level!',
      rating: 5,
      image: '🏏'
    },
    {
      name: 'Emma Thompson',
      role: 'Junior Player',
      content: 'I joined as a complete beginner and now I\'m captain of my school team. The coaches here make learning fun and challenging at the same time.',
      rating: 5,
      image: '⭐'
    },
    {
      name: 'James Wilson',
      role: 'Club Captain',
      content: 'The facilities here are incredible. The indoor nets with video analysis helped me identify and fix technical issues I never knew I had.',
      rating: 5,
      image: '🎯'
    },
    {
      name: 'Sarah Mitchell',
      role: 'Parent',
      content: 'My daughter has been training here for 2 years. Not only has her cricket improved, but so has her confidence and leadership skills.',
      rating: 5,
      image: '👨‍👩‍👧'
    }
  ];

  const galleryImages = [
    { 
      title: 'Indoor Training Session', 
      category: 'Training', 
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Team Building Activity', 
      category: 'Team Work', 
      image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Match Preparation', 
      category: 'Matches', 
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Coaching Session', 
      category: 'Coaching', 
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Fitness Training', 
      category: 'Fitness', 
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Awards Ceremony', 
      category: 'Achievements', 
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Junior Programs', 
      category: 'Youth', 
      image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    { 
      title: 'Advanced Training', 
      category: 'Elite', 
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-poppins text-cricket-green mb-4">
            What Our Players Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our successful players and their families about their journey with us
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-lift border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div>
                    <h4 className="font-semibold text-cricket-green">{testimonial.name}</h4>
                    <p className="text-sm text-cricket-orange">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gallery */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-poppins text-cricket-green mb-4">
            Academy Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a look at life at CricketPro Academy - from training sessions to celebrations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <Card key={index} className="hover-lift border-0 shadow-lg overflow-hidden cursor-pointer group">
              <CardContent className="p-0">
                <div className="aspect-square bg-cover bg-center relative overflow-hidden">
                  <img 
                    src={image.image} 
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="font-semibold text-sm">{image.title}</h4>
                    <p className="text-xs opacity-90">{image.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
