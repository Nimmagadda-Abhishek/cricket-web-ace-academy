
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'YouTube', icon: '📺', url: '#' },
  ];

  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Programs', href: '/programs' },
    { name: 'Facilities', href: '/facilities' },
  ];

  const programs = [
    { name: 'Group Training', href: '#programs' },
    { name: 'Personalized Training', href: '#programs' },
    { name: 'One-on-One Elite Coaching', href: '#programs' },
    { name: 'Corporate Cricket Program', href: '#programs' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Academy Info */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/images/logo/logo.png" 
                alt="Kalyan Cricket Academy Logo" 
                className="h-12 w-auto mr-3"
              />
              <h3 className="text-2xl font-bold font-poppins text-cricket-orange">
                Kalyan Cricket Academy
              </h3>
            </div>
            <p className="text-gray-300 mb-6">
              Developing cricket excellence through professional coaching, 
              world-class facilities, and personalized training programs.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="text-2xl hover:text-cricket-orange transition-colors"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold font-poppins text-cricket-orange mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-cricket-orange transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-cricket-orange transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <Link
                  to="/gallery"
                  className="text-gray-300 hover:text-cricket-orange transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-cricket-orange transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold font-poppins text-cricket-orange mb-4">
              Programs
            </h4>
            <ul className="space-y-2">
              {programs.map((program, index) => (
                <li key={index}>
                  <a
                    href={program.href}
                    className="text-gray-300 hover:text-cricket-orange transition-colors"
                  >
                    {program.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold font-poppins text-cricket-orange mb-4">
              Contact Info
            </h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-2">
                <span>📍</span>
                <span>Kukatpally, Hyderabad, Telangana 500072</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✉️</span>
                <span>info@kalyancricketacademy.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <span>⏰</span>
                <div>
                  <div>Mon-Fri: 11AM-11PM</div>
                  <div>Sat-Sun: 11AM-1AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 Kalyan Cricket Academy. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-cricket-orange text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-cricket-orange text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-cricket-orange text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
