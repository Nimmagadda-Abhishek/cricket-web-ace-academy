
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Facilities from './Facilities';
import { supabase } from '@/integrations/supabase/client';

const FacilitiesSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [useDynamicFacilities, setUseDynamicFacilities] = useState(false);
  
  // State for typing animation
  const [descriptionText, setDescriptionText] = useState("");
  const fullDescription = "Train like a professional with our state-of-the-art facilities designed to enhance every aspect of your cricket development";

  // Check if we have facilities in the database
  useEffect(() => {
    const checkFacilities = async () => {
      try {
        const { count } = await supabase
          .from('facilities')
          .select('*', { count: 'exact', head: true });
        
        setUseDynamicFacilities(count !== null && count > 0);
      } catch (error) {
        console.error('Error checking facilities:', error);
        setUseDynamicFacilities(false);
      }
    };
    
    checkFacilities();
  }, []);
  
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
  
  // Check when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);
  
  // Description typing animation (starts after title is complete)
  useEffect(() => {
    if (!isVisible) return;
    
    // Reset the description text
    setDescriptionText("");
    
    let currentIndex = 0;
    const typingSpeed = 30; // faster for description
    
    const typeDescription = () => {
      if (currentIndex <= fullDescription.length) {
        setDescriptionText(fullDescription.substring(0, currentIndex));
        currentIndex++;
        setTimeout(typeDescription, typingSpeed);
      }
    };
    
    // Start description typing after a short delay
    const timer = setTimeout(typeDescription, 300);
    
    return () => {
      clearTimeout(timer);
      setDescriptionText(fullDescription);
    };
  }, [isVisible, fullDescription]);
  
  // State for facility cards animation
  const [visibleCards, setVisibleCards] = useState<boolean[]>(Array(facilities.length).fill(false));
  
  // Animate facility cards after description is complete
  useEffect(() => {
    if (!isVisible) return;
    
    // Show all cards after a delay
    const timer = setTimeout(() => {
      setVisibleCards(Array(facilities.length).fill(true));
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isVisible, facilities.length]);

  return (
    <>
      {useDynamicFacilities ? (
        <Facilities />
      ) : (
        <section id="facilities" className="py-20 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden parallax-section" ref={sectionRef}>
          {/* Enhanced Parallax Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-28 h-28 bg-gradient-to-br from-cricket-green/15 to-cricket-orange/15 rounded-full parallax-bg-element-2"></div>
            <div className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-br from-cricket-purple/15 to-cricket-green/15 rounded-full parallax-bg-element"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-cricket-orange/15 to-cricket-purple/15 rounded-full parallax-bg-element-3"></div>
            <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-cricket-green/10 to-cricket-orange/10 rounded-full parallax-bg-element"></div>
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-cricket-purple/10 to-cricket-orange/10 rounded-full parallax-bg-element-2"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold font-poppins gradient-text-facilities mb-6">
                World-Class Facilities
              </h2>
              <p className="text-xl text-secondary max-w-3xl mx-auto">
                Train like a professional with our state-of-the-art facilities designed to enhance every aspect of your cricket development
              </p>
            </div>

            {/* Apple Intelligence Style Cards Container */}
            <div className="relative">
              {/* Scroll Buttons */}
              <button
                onClick={() => {
                  const container = document.getElementById('facilities-scroll');
                  if (container) {
                    container.scrollBy({ left: -400, behavior: 'smooth' });
                  }
                }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => {
                  const container = document.getElementById('facilities-scroll');
                  if (container) {
                    container.scrollBy({ left: 400, behavior: 'smooth' });
                  }
                }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Cards Container */}
              <div 
                id="facilities-scroll"
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 px-2 smooth-scroll"
              >
                {facilities.map((facility, index) => (
                  <div 
                    key={index} 
                    className="min-w-[400px] max-w-[400px] flex-shrink-0"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Apple Intelligence Style Card */}
                    <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-[500px] flex flex-col card-fade-in">
                      {/* Card Header */}
                      <div className="p-8 pb-6 flex-shrink-0">
                        <div className="text-5xl mb-6">{facility.icon}</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-cricket-orange transition-colors duration-300">
                          {facility.title}
                        </h3>
                        <p className="text-secondary leading-relaxed">
                          {facility.description}
                        </p>
                      </div>
                      
                      {/* Features List */}
                      <div className="px-8 pb-8 flex-1 flex flex-col justify-end">
                        <div className="space-y-3">
                          {facility.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-cricket-orange to-cricket-purple rounded-full flex-shrink-0"></div>
                              <span className="text-primary-body text-sm font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cricket-green/0 via-cricket-green/5 to-cricket-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FacilitiesSection;
