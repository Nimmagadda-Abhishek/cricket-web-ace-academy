
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  const stats = [
    { number: '500+', label: 'Students Trained', icon: '👨‍🎓', color: 'bg-blue-500' },
    { number: '15+', label: 'Years Experience', icon: '🏏', color: 'bg-cricket-orange' },
    { number: '50+', label: 'Professional Players', icon: '🏆', color: 'bg-cricket-gold' },
    { number: '98%', label: 'Success Rate', icon: '📈', color: 'bg-green-500' },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-5xl font-bold font-poppins heading-gradient mb-6">
            About CricketPro Academy
          </h2>
          <div className="w-24 h-1 bg-cricket-orange mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            For over 15 years, we've been nurturing cricket talent and transforming 
            passionate players into champions through expert coaching and unwavering dedication.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="animate-slideInLeft">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-cricket-orange/10 rounded-2xl"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-cricket-orange rounded-full flex items-center justify-center text-2xl mr-4">
                    🎯
                  </div>
                  <h3 className="text-3xl font-bold font-poppins text-cricket-green">
                    Our Mission
                  </h3>
                </div>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  At CricketPro Academy, we believe everyone should have the opportunity to enjoy 
                  cricket and achieve their personal goals. We provide comprehensive training 
                  programs that focus on technique, strategy, and mental strength.
                </p>
                
                <div className="space-y-4">
                  {[
                    'Professional coaching staff with international experience',
                    'Modern training facilities with latest technology',
                    'Personalized training programs for every skill level'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 group">
                      <div className="w-8 h-8 bg-cricket-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 group-hover:text-cricket-green transition-colors duration-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="animate-slideInRight">
            <div className="relative">
              <div 
                className="aspect-square bg-cover bg-center rounded-2xl shadow-2xl"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-cricket-green/80 to-cricket-orange/80 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <h4 className="text-3xl font-bold font-poppins mb-4">Why Choose Us</h4>
                    <div className="space-y-6">
                      {[
                        { title: 'Expert Coaching', desc: 'Learn from former professional players', icon: '🏆' },
                        { title: 'Modern Facilities', desc: 'Train with cutting-edge equipment', icon: '🏢' },
                        { title: 'Proven Results', desc: 'Hundreds of successful players', icon: '📈' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                          <div className="text-3xl">{item.icon}</div>
                          <div className="text-left">
                            <h5 className="font-semibold text-lg">{item.title}</h5>
                            <p className="text-sm opacity-90">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="interactive-card hover-lift gradient-card border-0 shadow-xl overflow-hidden group">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cricket-orange/20 to-cricket-gold/20 rounded-full -translate-y-4 translate-x-4"></div>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.color} text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold font-poppins text-cricket-green mb-2 group-hover:text-cricket-orange transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
