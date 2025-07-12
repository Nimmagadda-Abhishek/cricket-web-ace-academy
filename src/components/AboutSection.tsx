
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [finishedCounts, setFinishedCounts] = useState([false, false, false, false]);
  
  const stats = [
    { number: '500+', value: 500, label: 'Students Trained', icon: '👨‍🎓', color: 'bg-blue-500', suffix: '+' },
    { number: '15+', value: 15, label: 'Years Experience', icon: '🏏', color: 'bg-cricket-orange', suffix: '+' },
    { number: '50+', value: 50, label: 'Professional Players', icon: '🏆', color: 'bg-cricket-gold', suffix: '+' },
    { number: '98%', value: 98, label: 'Success Rate', icon: '📈', color: 'bg-green-500', suffix: '%' },
  ];
  
  // Detect when stats section is visible
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
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      if (statsRef.current) {
        observer.disconnect();
      }
    };
  }, []);
  
  // Animate the counting when visible
  useEffect(() => {
    if (!isVisible) return;
    
    // Create separate animations for each stat with staggered starts
    stats.forEach((stat, index) => {
      const duration = 2000; // 2 seconds
      const delay = index * 200; // 200ms delay between each stat starting
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      
      // Start the animation after the delay
      const timer = setTimeout(() => {
        let frame = 0;
        const countUp = () => {
          const progress = frame / totalFrames;
          
          // Custom easing with slight bounce at the end
          let easeProgress;
          if (progress < 0.9) {
            // First 90% of animation - smooth acceleration
            easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress / 0.9);
          } else {
            // Last 10% - add a slight bounce
            const bounceProgress = (progress - 0.9) / 0.1; // normalize to 0-1 for the last 10%
            easeProgress = 0.97 + Math.sin(bounceProgress * Math.PI) * 0.03; // small sine wave bounce
          }
          
          // Update just this stat's count
          setCounts(prevCounts => {
            const newCounts = [...prevCounts];
            newCounts[index] = Math.floor(easeProgress * stat.value);
            return newCounts;
          });
          
          frame++;
          
          if (frame <= totalFrames) {
            requestAnimationFrame(countUp);
          } else {
            // Mark this count as finished to trigger the finish animation
            setFinishedCounts(prev => {
              const newFinished = [...prev];
              newFinished[index] = true;
              return newFinished;
            });
          }
        };
        
        requestAnimationFrame(countUp);
      }, delay);
      
      return () => clearTimeout(timer);
    });
  }, [isVisible]);

  const features = [
    { title: 'High-Performance Training', description: '15 nets with Turf, Astro-Turf, Cement & Matting surfaces for diverse training conditions', icon: '🏏' },
    { title: 'Video Analysis', description: 'Advanced video analysis setup for performance tracking & technique improvement', icon: '📹' },
    { title: 'International Exposure', description: 'Official collaborations with clubs in Sri Lanka & Nepal for international opportunities', icon: '🌍' },
    { title: 'HCA League Teams', description: 'Participation in One-Day, Two-Day & Three-Day HCA League matches', icon: '🏆' }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 relative overflow-hidden parallax-section">
      {/* Enhanced Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-cricket-orange/10 to-cricket-purple/10 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-cricket-green/10 to-cricket-orange/10 rounded-full parallax-bg-element-2"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-cricket-purple/10 to-cricket-green/10 rounded-full parallax-bg-element-3"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-cricket-orange/8 to-cricket-purple/8 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-cricket-green/8 to-cricket-orange/8 rounded-full parallax-bg-element-2"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold font-poppins gradient-text-about mb-6">
            About Kalyan Cricket Academy
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            KCA is more than just a coaching center; it fosters a community of students, coaches, and parents working together to develop skilled cricketers. 
      
            including state, national, and international competitions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src="https://kalyancricketacademy.in/wp-content/uploads/2025/03/Untitled-design-28-1024x576.png"
                    alt="Cricket Training"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src="https://kalyancricketacademy.in/wp-content/uploads/2025/03/cricket-1-1024x682-1.webp"
                    alt="Cricket Match"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src="https://kalyancricketacademy.in/wp-content/uploads/2025/03/Kalyan-Cricket-Academy-%E2%80%83-1024x576.jpg"
                    alt="Cricket Coaching"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src="https://kalyancricketacademy.in/wp-content/uploads/2025/03/Untitled-design-28-1024x576.png"
                    alt="Cricket Practice"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-secondary mb-6">
                At Kalyan Cricket Academy, we believe everyone should have the opportunity to enjoy 
                cricket and achieve their personal goals. We provide comprehensive training 
                programs that focus on technique, strategy, and mental strength.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-cricket-orange mr-3 text-xl">✓</span>
                    <span className="text-primary-body">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div ref={statsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.color} text-white text-2xl mb-4`}>
                {stat.icon}
              </div>
              
              <div className="text-4xl font-bold text-cricket-green mb-2">
                {isVisible ? (
                  <span className="inline-block" style={{ minWidth: '3ch' }}>
                    {counts[index]}{stat.suffix}
                  </span>
                ) : (
                  <span className="inline-block" style={{ minWidth: '3ch' }}>
                    0{stat.suffix}
                  </span>
                )}
              </div>
              
              <div className="text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
