
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
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      <AchievementsSection />
      
      <AboutSection />
      <ProgramsSection />

      <FacilitiesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      
      {/* WhatsApp Contact Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Contact us on WhatsApp"
        >
          <img 
            src="/icons/whatsapp-icon.svg" 
            alt="WhatsApp" 
            className="w-full h-full"
          />
        </a>
      </div>
    </div>
  );
};

export default Index;

