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

  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname === '/admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToElement = (elementId: string) => {
    const element = document.querySelector(elementId);
    if (element) {
      const navHeight = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const additionalOffset = -105;
      const offsetPosition = elementPosition - navHeight - additionalOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLinkClick = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: href.substring(1) } });
    } else {
      // Close menu first to prevent visual glitches
      setIsOpen(false);
      
      // Small delay to ensure menu is closed before scrolling
      setTimeout(() => {
        scrollToElement(href);
      }, 100);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore the scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleHomeClick = () => {
    setIsOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // First scroll to top, then navigate
      window.scrollTo({ top: 0 });
      setTimeout(() => {
        navigate('/');
      }, 100);
    }
  };

  const handlePortalClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/portal');
    }
    setIsOpen(false);
  };

  const menuItems = [
    { name: 'Diensten', href: '#services' },
    { name: 'Over Ons', href: '#about' },
    { name: 'Projecten', href: '#gallery' },
    { name: 'Blog', href: '#blog' },
    { name: 'Referenties', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const navbarStyle = () => {
    if (isHomePage && !scrolled) {
      return 'bg-white/20 backdrop-blur-lg text-white hover:bg-white/30';
    } else {
      return 'bg-white/95 backdrop-blur-md';
    }
  };

  const textStyle = () => {
    if (isHomePage && !scrolled) {
      return 'text-white hover:bg-white/10';
    } else {
      return 'text-secondary-700 hover:bg-primary-50 hover:text-primary-700';
    }
  };

  if (isLoginPage || isAdminPage) {
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
              className={`inline-flex items-center justify-center p-3.5 rounded-full transition-all duration-300 shadow-lg ${
                isHomePage && !scrolled
                  ? 'bg-white/20 backdrop-blur-lg text-white hover:bg-white/30'
                  : 'bg-white text-secondary-700 hover:bg-primary-50'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className={`w-fit mx-auto rounded-3xl transition-all duration-300 ${navbarStyle()} shadow-[0_8px_30px_rgb(0,0,0,0.12)]`}>
              <div className="px-4 sm:px-6">
                <div className="flex items-center justify-center h-16">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleHomeClick}
                      className={`p-2 rounded-lg transition-all duration-300 ${textStyle()}`}
                      aria-label="Home"
                    >
                      <Home className="h-5 w-5" />
                    </button>
                    {menuItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleLinkClick(item.href)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${textStyle()}`}
                      >
                        {item.name}
                      </button>
                    ))}
                    <button
                      onClick={handlePortalClick}
                      className={`p-2 rounded-lg transition-all duration-300 ${textStyle()}`}
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
        className={`fixed inset-y-0 right-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <img
              src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/logo-black.png"
              alt="Lolkema Logo"
              className="h-8 w-auto"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 px-2 pt-2 pb-3 space-y-1 overflow-y-auto">
            <button
              onClick={handleHomeClick}
              className="flex items-center w-full px-4 py-3 text-base font-medium text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-200"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </button>
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleLinkClick(item.href)}
                className="block w-full text-left px-4 py-3 text-base font-medium text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={handlePortalClick}
              className="flex items-center w-full px-4 py-3 text-base font-medium text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-200"
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