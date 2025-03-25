import React from 'react';
import { Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isBlogPost = location.pathname.startsWith('/blog/') && location.pathname !== '/blog/editor';

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={`bg-green-900 text-white ${isBlogPost ? 'fade-enter' : ''}`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <span className="text-xl font-bold">Loonbedrijf Lolkema</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Zorgt voor uw volledige ruwvoerwinning, maisteelt en staat garant voor betrouwbare uitvoer van de verschillende werkzaamheden. Ook in de grond, weg en waterbouw zijn wij graag uw partner om voor u het gewenste eindproduct te realiseren.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Diensten</h3>
            <ul className="mt-4 space-y-2">
              {['Agrarisch Loonwerk', 'Grondverzet & Infra', 'Cultuurtechnisch werk', 'Civiele techniek', 'Transport', 'Verhuur'].map((item, index) => (
                <li key={index}>
                  <a href="#services" className="text-sm text-gray-300 hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Certificeringen</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-300">
                ISO 9001
              </li>
              <li className="text-sm text-gray-300">
                VCA*
              </li>
              <li className="text-sm text-gray-300">
                BRL 9335
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-300">
                Farskewei 3, 8406 AE Tijnje
              </li>
              <li className="text-sm text-gray-300">
                0513 571 207
              </li>
              <li className="text-sm text-gray-300">
                info@loonbedrijflolkema.nl
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-green-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Loonbedrijf Lolkema Tijnje. Alle rechten voorbehouden.
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center text-sm text-gray-300 hover:text-white"
          >
            Terug naar boven
            <ArrowUp className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;