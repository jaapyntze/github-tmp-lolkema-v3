import React from 'react';
import { Facebook, Mail, ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

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
    <footer className={`bg-gradient-to-b from-primary-500 to-primary-900 text-white ${isBlogPost ? 'fade-enter' : ''}`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <span className="text-xl font-bold">Loonbedrijf Lolkema</span>
            </div>
            <p className="mt-4 text-sm text-white/80">
              Zorgt voor uw volledige ruwvoerwinning, maisteelt en staat garant voor betrouwbare uitvoer van de verschillende werkzaamheden. Ook in de grond, weg en waterbouw zijn wij graag uw partner om voor u het gewenste eindproduct te realiseren.
            </p>
            <div className="mt-6 flex items-center space-x-4">
              <a 
                href="https://www.facebook.com/LoonbedrijfLolkema" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/80 hover:text-white transition-colors flex items-center justify-center w-5 h-5"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://api.whatsapp.com/send?phone=%2B31655868746&app=website" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/80 hover:text-white transition-colors flex items-center justify-center w-5 h-5"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5" />
              </a>
              <a 
                href="mailto:info@loonbedrijflolkema.nl" 
                className="text-white/80 hover:text-white transition-colors flex items-center justify-center w-5 h-5"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/90 tracking-wider uppercase">Diensten</h3>
            <ul className="mt-4 space-y-2">
              {['Agrarisch Loonwerk', 'Grondverzet & Infra', 'Cultuurtechnisch werk', 'Civiele techniek', 'Transport', 'Verhuur'].map((item, index) => (
                <li key={index}>
                  <a href="#services" className="text-sm text-white/80 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/90 tracking-wider uppercase">Certificeringen</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-white/80">
                ISO 9001
              </li>
              <li className="text-sm text-white/80">
                VCA*
              </li>
              <li className="text-sm text-white/80">
                BRL 9335
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/90 tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-white/80">
                <a 
                  href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2860.0901209506915!2d5.965565349945904!3d53.033140556477946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c85984491acf55%3A0x4e66c55d206eb0f0!2sLoonbedrijf%20Lolkema%20Tijnje!5e1!3m2!1snl!2snl!4v1740831245833!5m2!1snl!2snl" 
                  className="hover:text-white transition-colors"
                >
                  Farskewei 3, 8406 AE Tijnje
                </a>
              </li>
              <li className="text-sm text-white/80">
                <a 
                  href="tel:0513571207" 
                  className="hover:text-white transition-colors"
                >
                  0513 571 207
                </a>
              </li>
              <li className="text-sm text-white/80">
                <a 
                  href="mailto:info@loonbedrijflolkema.nl"
                  className="hover:text-white transition-colors"
                >
                  info@loonbedrijflolkema.nl
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/80">
            &copy; {new Date().getFullYear()} Loonbedrijf Lolkema Tijnje. Alle rechten voorbehouden.
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center text-sm text-white/80 hover:text-white transition-colors"
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