
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center parallax-bg"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
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
              <div className="text-6xl animate-float">🏏</div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-poppins text-white mb-6 text-shadow">
            Master the Art of
            <span className="block gradient-text">Cricket</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your passion into perfection with professional coaching, 
            world-class facilities, and personalized training programs designed for champions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-cricket-orange hover:bg-cricket-orange/90 text-white px-10 py-6 text-lg font-semibold rounded-full hover-glow ripple-effect transform transition-all duration-300 hover:scale-105"
            >
              🚀 Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-cricket-green px-10 py-6 text-lg font-semibold rounded-full glass-effect transform transition-all duration-300 hover:scale-105"
            >
              📹 Watch Demo
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
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
