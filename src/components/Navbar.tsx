import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Building2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isBlogPost = (location.pathname.startsWith('/blog/') && location.pathname !== '/blog/editor') || location.pathname.startsWith('/portal');
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: href.substring(1) } });
    } else if (href) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { name: 'Diensten', href: '#services' },
    { name: 'Over Ons', href: '#about' },
    { name: 'Projecten', href: '#gallery' },
    { name: 'Blog', href: '#blog' },
    { name: 'Referenties', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    setIsOpen(false);
  };

  const handlePortalClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/portal');
    }
    setIsOpen(false);
  };

  if (isLoginPage) {
    return null;
  }

  return (
    <>
      <div className="fixed w-full top-0 z-50 transition-all duration-300">
        <nav className={`relative max-w-7xl mx-auto transition-all duration-300 md:mt-5`}>
          {/* Mobile menu button */}
          <div className="fixed top-6 right-4 md:hidden z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-3.5 rounded-full transition-all duration-300 ${
                scrolled
                  ? 'bg-white text-gray-700 shadow-lg hover:bg-green-50'
                  : 'bg-white/20 backdrop-blur-lg text-white hover:bg-white/30 shadow-lg shadow-black/10'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className={`w-fit mx-auto rounded-3xl transition-all duration-300 ${
              scrolled 
                ? 'bg-white/95 backdrop-blur-md shadow-lg' 
                : 'bg-white/10 backdrop-blur-md shadow-lg shadow-black/10'
            }`}>
              <div className="px-4 sm:px-6">
                <div className="flex items-center justify-center h-16">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleHomeClick}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        scrolled
                          ? isBlogPost
                            ? 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                            : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                          : isBlogPost
                            ? 'text-gray-700'
                            : 'text-white hover:bg-white/10'
                      }`}
                      aria-label="Home"
                    >
                      <Home className="h-5 w-5" />
                    </button>
                    {menuItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleLinkClick(item.href)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          scrolled
                            ? isBlogPost
                              ? 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                              : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                            : isBlogPost
                              ? 'text-gray-700'
                              : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                    <button
                      onClick={handlePortalClick}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        scrolled
                          ? isBlogPost
                            ? 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                            : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                          : isBlogPost
                            ? 'text-gray-700'
                            : 'text-white hover:bg-white/10'
                      }`}
                      aria-label="Portal"
                    >
                      <Building2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 px-2 pt-2 pb-3 space-y-1 overflow-y-auto">
            <button
              onClick={handleHomeClick}
              className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors duration-200"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </button>
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleLinkClick(item.href)}
                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={handlePortalClick}
              className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors duration-200"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Portal
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;