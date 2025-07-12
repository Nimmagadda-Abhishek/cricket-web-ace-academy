
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
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
    <nav className={`fixed w-full z-50 ai-navbar${scrolled ? ' scrolled' : ''}`} style={{fontFamily: 'var(--ai-font)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center text-2xl font-bold" style={{color: 'var(--ai-heading)', fontFamily: 'var(--ai-font)'}}>
                <img src="/images/logo/logo.png" alt="Logo" className="h-10 w-auto mr-2" />
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-base font-medium transition-all duration-300 ai-body hover:gradient-text"
                  style={{color: 'var(--ai-heading)'}}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={e => {
                    if (item.href.startsWith('#')) {
                      e.preventDefault();
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-base font-medium transition-all duration-300 ai-body hover:gradient-text"
                  style={{color: 'var(--ai-heading)'}}
                >
                  {item.name}
                </a>
              )
            ))}
            <button
              type="button"
              onClick={() => {
                if (isHomePage) document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
                else window.location.href = '/programs';
              }}
              className="ai-btn ml-2"
            >
              🚀 Join Now
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-2xl ai-body"
              aria-label="Open menu"
            >
              <svg className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white ai-card">
            {navigation.map((item, index) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 ai-body hover:gradient-text ai-rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 ai-body hover:gradient-text ai-rounded"
                  onClick={e => {
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
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (isHomePage) document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
                  else window.location.href = '/programs';
                }}
                className="ai-btn w-full"
              >
                🚀 Join Now
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;


