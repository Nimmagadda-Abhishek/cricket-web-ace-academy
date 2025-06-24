
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ContactSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', phone: '', program: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      title: 'Address',
      content: '123 Cricket Lane, Sports District, City 12345',
      icon: '📍'
    },
    {
      title: 'Phone',
      content: '+1 (555) 123-4567',
      icon: '📞'
    },
    {
      title: 'Email',
      content: 'info@kalyancricketacademy.com',
      icon: '✉️'
    },
    {
      title: 'Training Hours',
      content: 'Mon-Fri: 6AM-10PM\nSat-Sun: 8AM-8PM',
      icon: '⏰'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-poppins text-cricket-green mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your cricket journey? Contact us today for more information 
            about our programs or to schedule a trial session
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-poppins text-cricket-green">
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
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
                    />
                  </div>
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
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Interest
                    </label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cricket-orange"
                    >
                      <option value="">Select a program</option>
                      <option value="junior">Junior Cricket (6-12 years)</option>
                      <option value="youth">Youth Development (13-17 years)</option>
                      <option value="adult">Adult Programs (18+ years)</option>
                      <option value="elite">Elite Training</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full"
                    placeholder="Tell us about your cricket goals and any questions you have..."
                  />
                </div>

                <Button 
                  type="submit" 
                  onClick={() => console.log("Send Message form submitted")}
                  className="w-full bg-cricket-orange hover:bg-cricket-orange/90"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold font-poppins text-cricket-green mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-md hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{info.icon}</div>
                        <div>
                          <h4 className="font-semibold text-cricket-green mb-1">
                            {info.title}
                          </h4>
                          <p className="text-gray-700 whitespace-pre-line">
                            {info.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-cricket-green to-cricket-orange">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold text-white mb-2">
                  Ready to Start?
                </h4>
                <p className="text-white/90 mb-4">
                  Book your free trial session today and experience the difference!
                </p>
                <Button 
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="bg-white text-cricket-green hover:bg-gray-100"
                >
                  Book Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
