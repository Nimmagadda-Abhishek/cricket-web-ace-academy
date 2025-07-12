
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const slides = [
    { url: '/images/hero/cricket-stadium.jpg', alt: 'Cricket stadium with players' },
    { url: '/images/hero/cricket-coaching.jpg', alt: 'Cricket coaching session' },
    { url: '/images/hero/cricket-batting.jpg', alt: 'Cricket player batting' }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  
  const goToSlide = (index: number) => setCurrentSlide(index);
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden ai-fade-in parallax-section" style={{background: 'var(--ai-bg)'}}>
      {/* Enhanced Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cricket-orange/15 to-cricket-purple/15 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-cricket-green/15 to-cricket-orange/15 rounded-full parallax-bg-element-2"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-cricket-purple/15 to-cricket-green/15 rounded-full parallax-bg-element-3"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-cricket-orange/10 to-cricket-purple/10 rounded-full parallax-bg-element"></div>
        <div className="absolute top-3/4 left-1/3 w-28 h-28 bg-gradient-to-br from-cricket-green/12 to-cricket-orange/12 rounded-full parallax-bg-element-2"></div>
        <div className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-gradient-to-br from-cricket-purple/12 to-cricket-green/12 rounded-full parallax-bg-element-3"></div>
      </div>

      {/* Background Slideshow */}
      <div className="absolute inset-0 slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide bg-cover bg-center ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide.url}')` }}
          />
        ))}
      </div>
      
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
      
      <div className="absolute inset-0" style={{background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(245,245,247,0.80) 100%)'}}></div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ai-fade-in">
          <div className="mb-6 ai-scale-in">
            <div className="inline-block p-4 rounded-full bg-white/60 backdrop-blur-md border border-white/30 mb-6 hover:bg-white/80 transition-all duration-300 hover:scale-110">
              <img src="/images/logo/logo.png" alt="Kalyan Cricket Academy Logo" className="h-24 w-auto" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up" style={{fontFamily: 'var(--ai-font)'}}>
            <span className="gradient-text-hero" style={{display: 'inline-block'}}>Kalyan</span>
            <span className="block gradient-text-hero">Cricket Academy</span>
          </h1>
          
          <p className="text-secondary text-xl md:text-2xl mb-8 max-w-3xl mx-auto ai-slide-up leading-relaxed">
            Structured training for long-term growth with hands-on coaching, match simulations & real-game exposure. Focus on skill-building, teamwork & performance excellence.
          </p>
          
          <div className="flex justify-center mb-8 ai-fade-in">
            <button 
              type="button"
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/80 backdrop-blur-md border border-gray-200 text-primary-headline px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 glass-button hover-lift"
            >
              📋 View Programs
            </button>
          </div>
          
          {/* Floating Stats */}
          <div className="flex justify-center space-x-8 mt-12">
            <div className="text-center animate-fade-in-scale" style={{animationDelay: '0.2s'}}>
              <div className="text-3xl font-bold text-cricket-orange mb-2">500+</div>
              <div className="text-sm text-tertiary">Active Students</div>
            </div>
            <div className="text-center animate-fade-in-scale" style={{animationDelay: '0.4s'}}>
              <div className="text-3xl font-bold text-cricket-green mb-2">15+</div>
              <div className="text-sm text-tertiary">Expert Coaches</div>
            </div>
            <div className="text-center animate-fade-in-scale" style={{animationDelay: '0.6s'}}>
              <div className="text-3xl font-bold text-cricket-purple mb-2">10+</div>
              <div className="text-sm text-tertiary">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


