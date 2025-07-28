
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProgramsSection from '@/components/ProgramsSection';
import FacilitiesSection from '@/components/FacilitiesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import AchievementsSection from '@/components/AchievementsSection';
import '@/styles/animations.css';

const Index = () => {
  return (
    <div className="parallax-container">
      {/* Parallax Background Elements */}
      <div className="parallax-background">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cricket-orange/5 to-cricket-purple/5 rounded-full parallax-bg-element"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-cricket-green/5 to-cricket-orange/5 rounded-full parallax-bg-element-2"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-cricket-purple/5 to-cricket-green/5 rounded-full parallax-bg-element-3"></div>
        <div className="absolute top-2/3 right-1/3 w-20 h-20 bg-gradient-to-br from-cricket-orange/3 to-cricket-purple/3 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-br from-cricket-green/4 to-cricket-orange/4 rounded-full parallax-bg-element-2"></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-cricket-purple/4 to-cricket-green/4 rounded-full parallax-bg-element-3"></div>
      </div>

      <div className="parallax-content">
        <Navbar />
        <HeroSection />
        
        <AchievementsSection />
        
        <AboutSection />
        <ProgramsSection />

        <FacilitiesSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;

