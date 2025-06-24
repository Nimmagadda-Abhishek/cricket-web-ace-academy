
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Alex Rodriguez',
      role: 'State Team Player',
      content: 'Kalyan Cricket Academy transformed my game completely. The coaching staff helped me develop both technically and mentally. Now I\'m playing at state level!',
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
    <section id="gallery" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 text-8xl animate-rotate-slow">🏏</div>
        <div className="absolute bottom-20 right-20 text-6xl animate-float">⭐</div>
        <div className="absolute top-1/2 right-1/4 text-4xl animate-pulse-slow">🏆</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Testimonials Section */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-5xl font-bold font-poppins heading-gradient mb-6 animate-slideDown">
            What Our Players Say
          </h2>
          <div className="w-24 h-1 bg-cricket-orange mx-auto mb-6 rounded-full animate-shimmer"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slideUp">
            Hear from our successful players and their families about their incredible journey with us
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={`card-hover gradient-card border-0 shadow-xl overflow-hidden relative group animate-bounceIn stagger-${index + 1}`}
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cricket-orange/10 to-cricket-gold/10 rounded-full -translate-y-4 translate-x-4 animate-pulse-slow"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-cricket-green/10 to-cricket-orange/10 rounded-full translate-y-4 -translate-x-4 animate-float"></div>
              
              <CardContent className="p-6 relative z-10">
                {/* Enhanced Star Rating */}
                <div className="flex items-center justify-center mb-4 space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-yellow-400 text-xl animate-zoomIn hover:animate-wiggle cursor-pointer stagger-${i + 1}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                
                {/* Enhanced Quote */}
                <div className="relative mb-6">
                  <div className="text-6xl text-cricket-orange/20 absolute -top-4 -left-2">"</div>
                  <p className="text-gray-700 italic leading-relaxed text-center relative z-10 animate-fadeInUp">
                    {testimonial.content}
                  </p>
                  <div className="text-6xl text-cricket-orange/20 absolute -bottom-8 -right-2 rotate-180">"</div>
                </div>
                
                {/* Enhanced Author Info */}
                <div className="flex items-center justify-center space-x-3 animate-slideUp">
                  <div className="text-4xl animate-heartbeat bg-gradient-to-br from-cricket-orange/20 to-cricket-gold/20 p-2 rounded-full">
                    {testimonial.image}
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-cricket-green hover:text-cricket-orange transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-cricket-orange font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Gallery Section */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-5xl font-bold font-poppins heading-gradient mb-6 animate-slideDown">
            Academy Gallery
          </h2>
          <div className="w-24 h-1 bg-cricket-orange mx-auto mb-6 rounded-full animate-shimmer"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slideUp">
            Take a look at life at Kalyan Cricket Academy - from training sessions to celebrations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <Card 
              key={index} 
              className={`card-hover border-0 shadow-xl overflow-hidden cursor-pointer group gradient-border animate-bounceIn stagger-${index + 1}`}
            >
              <CardContent className="p-0 relative">
                <div className="aspect-square bg-cover bg-center relative overflow-hidden image-overlay">
                  <img 
                    src={image.image} 
                    alt={image.title}
                    className="w-full h-full object-cover image-zoom hover-brightness"
                  />
                  
                  {/* Enhanced Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Enhanced Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="font-semibold text-lg mb-1 animate-slideUp">{image.title}</h4>
                    <p className="text-sm opacity-90 animate-slideUp" style={{ animationDelay: '0.1s' }}>{image.category}</p>
                  </div>
                  
                  {/* Decorative Corner Element */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-cricket-orange/80 rounded-full flex items-center justify-center animate-bounceIn">
                      <span className="text-white text-xs">🔍</span>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 bg-cricket-green/90 text-white px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-slideDown">
                    {image.category}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fadeInUp">
          <div className="bg-gradient-to-r from-cricket-green to-cricket-orange rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 animate-slideDown">Join Our Success Stories!</h3>
              <p className="text-xl mb-6 animate-slideUp">Be part of our growing family of successful cricketers and create your own success story.</p>
              <button className="bg-white text-cricket-green px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 ripple-effect animate-bounceIn">
                🌟 Start Your Journey
              </button>
            </div>
            
            {/* Floating Decorative Elements */}
            <div className="absolute top-4 right-4 animate-float">
              <div className="text-4xl opacity-30">🏏</div>
            </div>
            <div className="absolute bottom-4 left-4 animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-3xl opacity-30">⭐</div>
            </div>
            <div className="absolute top-1/2 left-8 animate-float" style={{ animationDelay: '2s' }}>
              <div className="text-2xl opacity-20">🏆</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
