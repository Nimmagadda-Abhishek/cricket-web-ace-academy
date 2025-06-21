
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Coaches', href: '#coaches' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-lg animate-slideDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold font-poppins text-cricket-green hover:text-cricket-orange transition-colors duration-300 cursor-pointer animate-slideInLeft">
                <span className="inline-block animate-wiggle">🏏</span> Kalyan Cricket Academy
              </h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-gray-700 hover:text-cricket-orange transition-all duration-300 font-medium relative group animate-slideInRight stagger-${index + 1}`}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cricket-orange group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <Button className="bg-cricket-orange hover:bg-cricket-orange/90 hover:scale-105 transition-all duration-300 ripple-effect animate-bounceIn">
              🚀 Join Now
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-cricket-orange transition-all duration-300 hover:scale-110 animate-slideInRight"
            >
              <svg className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden animate-slideDown">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-gray-700 hover:text-cricket-orange hover:bg-cricket-orange/10 transition-all duration-300 rounded-lg animate-slideInLeft stagger-${index + 1}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="px-3 py-2">
              <Button className="w-full bg-cricket-orange hover:bg-cricket-orange/90 hover:scale-105 transition-all duration-300 ripple-effect animate-bounceIn">
                🚀 Join Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
