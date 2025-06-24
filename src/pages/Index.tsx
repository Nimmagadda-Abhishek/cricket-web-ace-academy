
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProgramsSection from '@/components/ProgramsSection';

import FacilitiesSection from '@/components/FacilitiesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProgramsSection />

      <FacilitiesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      
      {/* Admin Access Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <a
          href="/admin"
          className="bg-cricket-green text-white p-3 rounded-full shadow-lg hover:bg-cricket-dark transition-all duration-300 hover:scale-110 animate-bounce"
          title="Admin Panel"
        >
          ⚙️
        </a>
      </div>
    </div>
  );
};

export default Index;
