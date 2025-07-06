
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
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-20 text-9xl animate-rotate-slow">🏏</div>
        <div className="absolute bottom-20 right-20 text-8xl animate-float">⚾</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-pulse-slow">🏆</div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-5xl font-bold font-poppins heading-gradient mb-6 animate-slideDown">
            About Kalyan Cricket Academy
          </h2>
          <div className="w-24 h-1 bg-cricket-orange mx-auto mb-6 rounded-full animate-shimmer"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-slideUp">
            KCA is more than just a coaching center; it fosters a community of students, coaches, and parents working together to develop skilled cricketers. 
            The academy aims to identify talented individuals passionate about cricket and offers them the necessary support and guidance to excel at various levels, 
            including state, national, and international competitions.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Side - Image Gallery */}
          <div className="animate-slideInLeft">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="image-overlay rounded-xl overflow-hidden card-hover shadow-lg">
                  <img
                    src="https://kalyancricketacademy.in/wp-content/uploads/2025/03/Untitled-design-28-1024x576.png"
                    alt="Cricket Training"
                    className="w-full h-64 sm:h-72 md:h-80 object-cover image-zoom hover-brightness"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <p className="text-white text-base font-medium">Professional Training</p>
                  </div>
                </div>
                <div className="image-overlay rounded-xl overflow-hidden card-hover shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1605&q=80"
                    alt="Cricket Equipment"
                    className="w-full h-48 sm:h-56 md:h-64 object-cover image-zoom hover-brightness"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <p className="text-white text-base font-medium">Quality Equipment</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6 mt-10">
                <div className="image-overlay rounded-xl overflow-hidden card-hover shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Cricket Stadium"
                    className="w-full h-48 sm:h-56 md:h-64 object-cover image-zoom hover-brightness"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <p className="text-white text-base font-medium">World-Class Facilities</p>
                  </div>
                </div>
                <div className="image-overlay rounded-xl overflow-hidden card-hover shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    alt="Cricket Coaching"
                    className="w-full h-64 sm:h-72 md:h-80 object-cover image-zoom hover-brightness"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <p className="text-white text-base font-medium">Expert Coaching</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Mission Content */}
          <div className="animate-slideInRight">
            <div className="card-glass rounded-2xl p-8 hover-shadow-lg gradient-border">
              <div className="flex items-center mb-6">
                <div className="bg-cricket-orange text-white p-3 rounded-full mr-4 animate-heartbeat">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-3xl font-bold font-poppins text-cricket-green animate-slideRight">
                  Our Mission
                </h3>
              </div>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed animate-fadeInUp">
                At Kalyan Cricket Academy, we believe everyone should have the opportunity to enjoy 
                cricket and achieve their personal goals. We provide comprehensive training 
                programs that focus on technique, strategy, and mental strength.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`text-center p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg card-hover border border-gray-100 animate-bounceIn stagger-${index + 1}`}
                  >
                    <div className="text-3xl mb-2 animate-wiggle">{feature.icon}</div>
                    <h4 className="font-semibold text-cricket-green mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="animate-slideInLeft">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cricket-orange to-cricket-gold rounded-2xl rotate-3 animate-pulse-slow"></div>
              <div className="relative card-glass rounded-2xl p-8 hover-shadow-lg">
                <h3 className="text-3xl font-bold font-poppins heading-gradient mb-6 animate-slideDown">
                  Why Choose Us?
                </h3>
                <ul className="space-y-4">
                  {[
                    "Professional coaches with international experience",
                    "State-of-the-art training facilities",
                    "Flexible training schedules",
                    "Regular performance assessments",
                    "Individual skill development plans",
                    "Tournament participation opportunities"
                  ].map((item, index) => (
                    <li key={index} className={`flex items-center animate-slideUp stagger-${index + 1}`}>
                      <span className="text-cricket-orange mr-3 text-xl animate-heartbeat">✓</span>
                      <span className="text-gray-700 hover:text-cricket-green transition-colors duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="animate-slideInRight">
            <div className="image-overlay rounded-2xl overflow-hidden hover-shadow-lg shadow-xl">
              <img
                src="https://kalyancricketacademy.in/wp-content/uploads/2025/03/cricket-1-1024x682-1.webp"
                alt="Cricket Training Session"
                className="w-full h-[28rem] sm:h-[32rem] md:h-[36rem] object-cover image-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
                <div className="text-white">
                  <h4 className="text-3xl font-bold mb-3 animate-slideUp">Professional Training</h4>
                  <p className="text-white/90 text-lg animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    Experience world-class coaching in our modern facilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className={`card-hover gradient-card border-0 shadow-xl overflow-hidden group animate-bounceIn stagger-${index + 1}`}>
              <CardContent className="p-8 text-center relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cricket-orange/20 to-cricket-gold/20 rounded-full -translate-y-4 translate-x-4 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-cricket-green/10 to-cricket-orange/10 rounded-full translate-y-4 -translate-x-4 animate-float"></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.color} text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 animate-zoomIn`}>
                  {stat.icon}
                </div>
                
                {/* Number with Animation */}
                <div className="text-4xl font-bold font-poppins text-cricket-green mb-2 group-hover:text-cricket-orange transition-colors duration-300">
                  {isVisible ? (
                    <span 
                      className={`inline-block ${finishedCounts[index] ? 'animate-countFinish' : ''}`} 
                      style={{ minWidth: '3ch' }}
                    >
                      {counts[index]}{stat.suffix}
                    </span>
                  ) : (
                    <span className="inline-block" style={{ minWidth: '3ch' }}>
                      0{stat.suffix}
                    </span>
                  )}
                </div>
                
                {/* Label */}
                <div className="text-gray-600 font-medium animate-fadeInUp">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}

      </div>
    </section>
  );
};

export default AboutSection;
