
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  const stats = [
    { number: '500+', label: 'Students Trained', icon: '👨‍🎓', color: 'bg-blue-500' },
    { number: '15+', label: 'Years Experience', icon: '🏏', color: 'bg-cricket-orange' },
    { number: '50+', label: 'Professional Players', icon: '🏆', color: 'bg-cricket-gold' },
    { number: '98%', label: 'Success Rate', icon: '📈', color: 'bg-green-500' },
  ];

  const features = [
    { title: 'Expert Coaching', description: 'Learn from certified professionals with international experience', icon: '🎯' },
    { title: 'Modern Facilities', description: 'Train with state-of-the-art equipment and facilities', icon: '🏟️' },
    { title: 'Personalized Training', description: 'Customized programs tailored to your skill level and goals', icon: '⚡' },
    { title: 'Match Opportunities', description: 'Regular tournaments and matches to showcase your skills', icon: '🏏' }
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
            For over 15 years, we've been nurturing cricket talent and transforming 
            passionate individuals into skilled players through comprehensive training programs.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Side - Image Gallery */}
          <div className="animate-slideInLeft">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="image-overlay rounded-xl overflow-hidden card-hover">
                  <img
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    alt="Cricket Training"
                    className="w-full h-48 object-cover image-zoom hover-brightness"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                    <p className="text-white text-sm font-medium">Professional Training</p>
                  </div>
                </div>
                <div className="image-overlay rounded-xl overflow-hidden card-hover">
                  <img
                    src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1605&q=80"
                    alt="Cricket Equipment"
                    className="w-full h-32 object-cover image-zoom hover-brightness"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                    <p className="text-white text-xs font-medium">Quality Equipment</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="image-overlay rounded-xl overflow-hidden card-hover">
                  <img
                    src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Cricket Stadium"
                    className="w-full h-32 object-cover image-zoom hover-brightness"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                    <p className="text-white text-xs font-medium">World-Class Facilities</p>
                  </div>
                </div>
                <div className="image-overlay rounded-xl overflow-hidden card-hover">
                  <img
                    src="https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    alt="Cricket Coaching"
                    className="w-full h-48 object-cover image-zoom hover-brightness"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                    <p className="text-white text-sm font-medium">Expert Coaching</p>
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
            <div className="image-overlay rounded-2xl overflow-hidden hover-shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Cricket Training Session"
                className="w-full h-96 object-cover image-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
                <div className="text-white">
                  <h4 className="text-2xl font-bold mb-2 animate-slideUp">Professional Training</h4>
                  <p className="text-white/90 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    Experience world-class coaching in our modern facilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                
                {/* Number */}
                <div className="text-4xl font-bold font-poppins text-cricket-green mb-2 group-hover:text-cricket-orange transition-colors duration-300 animate-shimmer">
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-gray-600 font-medium animate-fadeInUp">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fadeInUp">
          <div className="bg-gradient-to-r from-cricket-green to-cricket-orange rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 animate-slideDown">Ready to Start Your Cricket Journey?</h3>
              <p className="text-xl mb-6 animate-slideUp">Join hundreds of successful students who have transformed their game with us.</p>
              <button className="bg-white text-cricket-green px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 ripple-effect animate-bounceIn">
                Get Started Today
              </button>
            </div>
            <div className="absolute top-4 right-4 animate-float">
              <div className="text-4xl opacity-30">🏏</div>
            </div>
            <div className="absolute bottom-4 left-4 animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-3xl opacity-30">🏆</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
