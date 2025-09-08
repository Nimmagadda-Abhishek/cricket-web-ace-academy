
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { contactsApi } from '@/services/api';

const ContactSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      };
      
      const response = await contactsApi.submitContact(submitData);
      
      if (response.success) {
        toast({
          title: "Message Sent Successfully!",
          description: "We'll get back to you within 24 hours.",
        });
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Error Sending Message",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      title: 'Address',
      content: 'Plot No.18, beside Akshara international school, near Chittaramma Temple Road, Srikrishna Nagar, Kukatpally, Hyderabad, Telangana 500072',
      icon: '📍'
    },
    {
      title: 'Phone',
      content: '91 9908008424',
      icon: '📞'
    },
    {
      title: 'Email',
      content: 'info@kalyancricketacademy.com',
      icon: '✉️'
    },
    {
      title: 'Training Hours',
      content: 'Monday to Saturday: 5:30am to 8:30 pm',
      icon: '⏰'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50 relative overflow-hidden parallax-section">
      {/* Enhanced Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cricket-orange/12 to-cricket-purple/12 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-cricket-green/12 to-cricket-orange/12 rounded-full parallax-bg-element-2"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-cricket-purple/12 to-cricket-green/12 rounded-full parallax-bg-element-3"></div>
        <div className="absolute top-1/3 left-1/3 w-28 h-28 bg-gradient-to-br from-cricket-orange/8 to-cricket-purple/8 rounded-full parallax-bg-element"></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-gradient-to-br from-cricket-green/8 to-cricket-orange/8 rounded-full parallax-bg-element-2"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold font-poppins gradient-text-contact mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Ready to start your cricket journey? Contact us today for more information 
            about our programs or to schedule a trial session
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-primary-headline mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent transition-all duration-300"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-primary-headline mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent transition-all duration-300"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-headline mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-primary-headline mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent transition-all duration-300"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary-headline mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us about your cricket goals and any questions you have..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cricket-green to-cricket-orange text-white py-3 px-6 rounded-lg font-semibold hover:from-cricket-orange hover:to-cricket-purple transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-cricket-orange rounded-full flex items-center justify-center text-white mr-4">
                    📍
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-secondary">Plot No.18, beside Akshara international school, near Chittaramma Temple Road, Srikrishna Nagar, Kukatpally, Hyderabad, Telangana 500072</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-cricket-orange rounded-full flex items-center justify-center text-white mr-4">
                    📞
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-headline">Phone</h4>
                    <p className="text-secondary">+91 9908008424</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-cricket-orange rounded-full flex items-center justify-center text-white mr-4">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-headline">Email</h4>
                    <p className="text-secondary">info@kalyancricketacademy.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Training Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary">Monday to Saturday</span>
                  <span className="font-semibold text-primary-headline">5:30am to 8:30 pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
