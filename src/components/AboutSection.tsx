
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  const stats = [
    { number: '500+', label: 'Students Trained', icon: '👨‍🎓' },
    { number: '15+', label: 'Years Experience', icon: '🏏' },
    { number: '50+', label: 'Professional Players', icon: '🏆' },
    { number: '98%', label: 'Success Rate', icon: '📈' },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-poppins text-cricket-green mb-4">
            About CricketPro Academy
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For over 15 years, we've been nurturing cricket talent and transforming 
            passionate players into champions through expert coaching and dedication.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fadeInUp">
            <h3 className="text-3xl font-bold font-poppins text-cricket-green mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              At CricketPro Academy, we believe everyone should have the opportunity to enjoy 
              cricket and achieve their personal goals. We provide comprehensive training 
              programs that focus on technique, strategy, and mental strength.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cricket-orange rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Professional coaching staff</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cricket-orange rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Modern training facilities</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cricket-orange rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Personalized training programs</span>
              </div>
            </div>
          </div>

          <div className="animate-slideInRight">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-2xl font-bold font-poppins text-cricket-green mb-6">
                Why Choose Us
              </h4>
              <div className="space-y-4">
                <div className="border-l-4 border-cricket-orange pl-4">
                  <h5 className="font-semibold text-cricket-green">Expert Coaching</h5>
                  <p className="text-gray-600">Learn from former professional players and certified coaches</p>
                </div>
                <div className="border-l-4 border-cricket-orange pl-4">
                  <h5 className="font-semibold text-cricket-green">State-of-the-art Facilities</h5>
                  <p className="text-gray-600">Train with the latest equipment and technology</p>
                </div>
                <div className="border-l-4 border-cricket-orange pl-4">
                  <h5 className="font-semibold text-cricket-green">Proven Track Record</h5>
                  <p className="text-gray-600">Hundreds of successful players developed over the years</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover-lift">
              <CardContent className="p-6">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold font-poppins text-cricket-green mb-2">
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
