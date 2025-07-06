
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  // Slideshow images - cricket and coaching related
  const slides = [
    {
      url: '/images/hero/cricket-stadium.jpg',
      alt: 'Cricket stadium with players'
    },
    {
      url: '/images/hero/cricket-coaching.jpg',
      alt: 'Cricket coaching session'
    },
    {
      url: '/images/hero/cricket-batting.jpg',
      alt: 'Cricket player batting'
    }
  ];
  


  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide bg-cover bg-center ${
              index === currentSlide ? 'active' : ''
            }`}
            style={{
              backgroundImage: `url('${slide.url}')`
            }}
          />
        ))}
      </div>
      
      {/* Slideshow Indicators */}
      <div className="slideshow-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 gradient-hero opacity-90"></div>
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-20 h-20 bg-cricket-orange/20 rounded-full animate-pulse-slow"></div>
      </div>
      <div className="absolute bottom-32 right-16 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-16 h-16 bg-cricket-gold/20 rounded-full animate-pulse-slow"></div>
      </div>
      <div className="absolute top-1/3 right-20 animate-rotate-slow">
        <div className="text-6xl opacity-20">🏏</div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fadeInUp">
          <div className="mb-6 animate-scaleIn">
            <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <img 
                src="/images/logo/logo.png" 
                alt="Kalyan Cricket Academy Logo" 
                className="h-24 w-auto animate-float"
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-poppins text-white mb-6 text-shadow">
            Kalyan Cricket
            <span className="block gradient-text">Academy</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            Structured training for long-term growth with hands-on coaching, match simulations & real-game exposure. 
            Focus on skill-building, teamwork & performance excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              size="lg" 
              type="button"
              onClick={() => navigate('/contact')}
              className="bg-cricket-orange hover:bg-cricket-orange/90 text-white px-10 py-6 text-lg font-semibold rounded-full hover-glow ripple-effect transform transition-all duration-300 hover:scale-105"
            >
              🚀 Book A Demo
            </Button>
            <Button 
              size="lg" 
              type="button"
              variant="outline" 
              onClick={() => {
                console.log("View Programs clicked");
                document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-white text-white hover:bg-white hover:text-cricket-green px-10 py-6 text-lg font-semibold rounded-full glass-effect transform transition-all duration-300 hover:scale-105"
            >
              📋 View Programs
            </Button>
          </div>

          {/* Stats Counter */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
            <div className="text-center animate-scaleIn" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl md:text-4xl font-bold text-cricket-gold">500+</div>
              <div className="text-white/80">Students</div>
            </div>
            <div className="text-center animate-scaleIn" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl md:text-4xl font-bold text-cricket-gold">15+</div>
              <div className="text-white/80">Years</div>
            </div>
            <div className="text-center animate-scaleIn" style={{ animationDelay: '0.6s' }}>
              <div className="text-3xl md:text-4xl font-bold text-cricket-gold">98%</div>
              <div className="text-white/80">Success</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      
    </section>
  );
};

export default HeroSection;


