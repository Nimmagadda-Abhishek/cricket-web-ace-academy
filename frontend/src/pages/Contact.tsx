import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    program: '',
    experience: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const programs = [
    { id: 'group', name: 'Group Training', icon: '👥' },
    { id: 'individual', name: 'Personal Training', icon: '🎯' },
    { id: 'elite', name: 'Elite Coaching', icon: '🏆' },
    { id: 'corporate', name: 'Corporate Program', icon: '🏢' }
  ];

  const contactInfo = [
    {
      title: 'Phone',
      value: '+91 9908008424',
      icon: '📞',
      color: 'from-green-500 to-emerald-600',
      action: 'tel:+919908008424'
    },
    {
      title: 'Email',
      value: 'info@kalyancricketacademy.com',
      icon: '📧',
      color: 'from-blue-500 to-cyan-600',
      action: 'mailto:info@kalyancricketacademy.com'
    },
    {
      title: 'WhatsApp',
      value: '+91 9550858524',
      icon: '💬',
      color: 'from-green-600 to-green-700',
      action: 'https://wa.me/919550858524'
    },
    {
      title: 'Location',
      value: 'Hyderabad, Telangana',
      icon: '📍',
      color: 'from-red-500 to-pink-600',
      action: 'https://maps.app.goo.gl/UgRgniPEa97x34Lv7'
    },
    {
      title: 'Instagram',
      value: '@kalyancricketacademy',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm4.25 3.25a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 1.5a3 3 0 100 6 3 3 0 000-6zm4.75-.75a1.125 1.125 0 110 2.25 1.125 1.125 0 010-2.25z" />
        </svg>
      ),
      color: 'from-pink-500 to-pink-600',
      action: 'https://www.instagram.com/kalyancricketacademy'
    },
    {
      title: 'YouTube',
      value: 'Kalyan Cricket Academy',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 15l5.19-3L10 9v6zm11.54-3.23c-.2-1.5-.8-2.83-2.3-3.33-2.03-.67-10.2-.67-10.2-.67s-8.17 0-10.2.67c-1.5.5-2.1 1.83-2.3 3.33-.2 1.67-.2 5.17 0 6.83.2 1.5.8 2.83 2.3 3.33 2.03.67 10.2.67 10.2.67s8.17 0 10.2-.67c1.5-.5 2.1-1.83 2.3-3.33.2-1.67.2-5.17 0-6.83z" />
        </svg>
      ),
      color: 'from-red-600 to-red-700',
      action: 'https://www.youtube.com/@KALYANCRICKETACADEMY'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your inquiry! We will contact you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        program: '',
        experience: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-cricket-green to-cricket-orange overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold font-poppins text-white mb-6">
                Get In
                <span className="block gradient-text-contact">Touch</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                Ready to start your cricket journey? Contact us today for personalized training programs
              </p>
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                  <span className="text-white font-semibold">🏏 Let's Begin Your Cricket Story</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-poppins heading-gradient mb-4">
                Contact Information
              </h2>
              <p className="text-xl text-gray-600">
                Multiple ways to reach us - choose what works best for you
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {contactInfo.map((contact, index) => (
                <Card 
                  key={index}
                  className="group card-hover shadow-xl overflow-hidden bg-white relative cursor-pointer transform transition-all duration-300 hover:scale-105 border border-gray-200"
                  onClick={() => {
                    if (contact.action.startsWith('http')) {
                      window.open(contact.action, '_blank');
                    } else {
                      window.location.href = contact.action;
                    }
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${contact.color} text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {contact.icon}
                    </div>
                    <h3 className="text-lg font-bold text-cricket-green mb-2 group-hover:text-cricket-orange transition-colors duration-300">
                      {contact.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {contact.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-poppins heading-gradient mb-4">
                Send Us a Message
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <Card className="shadow-2xl overflow-hidden border border-gray-200">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <Input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="Enter your age"
                        min="5"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Program Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Interested Program
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {programs.map((program) => (
                        <label
                          key={program.id}
                          className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            formData.program === program.id
                              ? 'border-cricket-orange bg-cricket-orange/10'
                              : 'border-gray-200 hover:border-cricket-green'
                          }`}
                        >
                          <input
                            type="radio"
                            name="program"
                            value={program.id}
                            checked={formData.program === program.id}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <span className="text-xl">{program.icon}</span>
                          <span className="text-sm font-medium">{program.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cricket Experience
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                    >
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner (Never played)</option>
                      <option value="some">Some Experience (1-2 years)</option>
                      <option value="intermediate">Intermediate (3-5 years)</option>
                      <option value="advanced">Advanced (5+ years)</option>
                      <option value="competitive">Competitive Player</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full"
                      placeholder="Tell us about your goals, availability, or any specific questions..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-cricket-green to-cricket-orange hover:from-cricket-orange hover:to-cricket-green text-white font-semibold py-4 px-12 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          🚀 Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 bg-gradient-to-r from-cricket-green to-cricket-orange">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold font-poppins text-white mb-6">
              Need Immediate Assistance?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Don't wait - reach out to us directly for quick responses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-cricket-green hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
                onClick={() => window.location.href = 'tel:+919876543210'}
              >
                📞 Call Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-cricket-green px-8 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
                onClick={() => window.open('https://wa.me/919550858524', '_blank')}
              >
                💬 WhatsApp
              </Button>
            </div>
          </div>
        </section>

        
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
