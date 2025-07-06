
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
  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const fullTitle = "World-Class Facilities";
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
  
  // Title typing animation
  useEffect(() => {
    if (!isVisible) return;
    
    // Reset the text first
    setTitleText("");
    
    let currentIndex = 0;
    const typingSpeed = 80; // ms per character
    
    const typeTitle = () => {
      if (currentIndex <= fullTitle.length) {
        setTitleText(fullTitle.substring(0, currentIndex));
        currentIndex++;
        setTimeout(typeTitle, typingSpeed);
      }
    };
    
    // Start typing after a short delay
    setTimeout(typeTitle, 500);
    
    return () => {
      // Clean up any pending timeouts
      setTitleText(fullTitle);
    };
  }, [isVisible, fullTitle]);
  
  // Description typing animation (starts after title is complete)
  useEffect(() => {
    if (!isVisible || titleText !== fullTitle) return;
    
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
  }, [isVisible, titleText, fullDescription]);
  
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
        <section id="facilities" className="py-20 bg-white" ref={sectionRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold font-poppins text-cricket-green mb-4 min-h-[3rem]">
                {titleText}
                {titleText !== fullTitle && isVisible && (
                  <span className="inline-block w-0.5 h-8 bg-cricket-orange ml-1 align-middle animate-blink"></span>
                )}
                {!isVisible && (
                  <span className="opacity-0">World-Class Facilities</span>
                )}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto min-h-[4rem]">
                {descriptionText}
                {descriptionText !== fullDescription && isVisible && titleText === fullTitle && (
                  <span className="inline-block w-0.5 h-6 bg-cricket-orange ml-1 align-middle animate-blink"></span>
                )}
                {!isVisible && (
                  <span className="opacity-0">Train like a professional with our state-of-the-art facilities designed to enhance every aspect of your cricket development</span>
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((facility, index) => (
                <div 
                  key={index} 
                  className={`transition-all duration-700 transform ${
                    visibleCards[index] || !isVisible
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                >
                  <Card className="hover-lift border-0 shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className="text-5xl mb-4">{facility.icon}</div>
                      <h3 className="text-xl font-bold font-poppins text-cricket-green mb-3">
                        {facility.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{facility.description}</p>
                      
                      <div className="space-y-2">
                        {facility.features.map((feature, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center space-x-2 transition-all duration-500"
                          >
                            <div className="w-4 h-4 bg-cricket-orange rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FacilitiesSection;
