
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Different navigation items based on current page
  const navigation = isHomePage
    ? [
        { name: 'Home', href: '#home' },
        { name: 'Facilities', href: '/facilities' },
        { name: 'Programs', href: '#programs' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '/contact' },
      ]
    : [
        { name: 'Home', href: '/' },
        { name: 'Facilities', href: '/facilities' },
        { name: 'Programs', href: '/programs' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'About', href: '/#about' },
        { name: 'Contact', href: '/contact' },
      ];

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-lg animate-slideDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold font-poppins text-cricket-green hover:text-cricket-orange transition-colors duration-300 cursor-pointer animate-slideInLeft">
                <span className="inline-block animate-wiggle">🏏</span> Kalyan Cricket Academy
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-700 hover:text-cricket-orange transition-all duration-300 font-medium relative group animate-slideInRight stagger-${index + 1}`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cricket-orange group-hover:w-full transition-all duration-300"></span>
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith('#')) {
                      e.preventDefault();
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`text-gray-700 hover:text-cricket-orange transition-all duration-300 font-medium relative group animate-slideInRight stagger-${index + 1}`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cricket-orange group-hover:w-full transition-all duration-300"></span>
                </a>
              )
            ))}
            <Button 
              type="button"
              onClick={() => {
                console.log("Join Now clicked from navbar");
                if (isHomePage) {
                  document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/programs';
                }
              }}
              className="bg-cricket-orange hover:bg-cricket-orange/90 hover:scale-105 transition-all duration-300 ripple-effect animate-bounceIn"
            >
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
              item.href.startsWith('/') ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-gray-700 hover:text-cricket-orange hover:bg-cricket-orange/10 transition-all duration-300 rounded-lg animate-slideInLeft stagger-${index + 1}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-gray-700 hover:text-cricket-orange hover:bg-cricket-orange/10 transition-all duration-300 rounded-lg animate-slideInLeft stagger-${index + 1}`}
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    if (item.href.startsWith('#')) {
                      e.preventDefault();
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {item.name}
                </a>
              )
            ))}
            <div className="px-3 py-2">
              <Button 
                type="button"
                onClick={() => {
                  console.log("Join Now clicked from mobile menu");
                  setIsMenuOpen(false);
                  if (isHomePage) {
                    document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/programs';
                  }
                }}
                className="w-full bg-cricket-orange hover:bg-cricket-orange/90 hover:scale-105 transition-all duration-300 ripple-effect animate-bounceIn"
              >
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
