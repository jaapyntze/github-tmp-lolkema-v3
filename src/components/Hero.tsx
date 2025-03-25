import React from 'react';

const Hero = () => {
  return (
    <div className="relative h-screen bg-gradient-to-b from-green-800 to-green-900 overflow-hidden flex items-center">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 origin-top"
        >
          <source
            src="/images/video_lang-ingekort-cropped.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Logo */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <img
          src="/images/logo.png"
          alt="Loonbedrijf Lolkema Logo"
          className="h-8 md:h-12 w-auto"
        />
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white animate-fade-in">
            Kracht in Vakmanschap,{' '}
            <span className="block mt-1 sm:mt-2">Betrouwbaar in Resultaat</span>
          </h1>
          <p className="mt-4 sm:mt-8 text-base sm:text-lg md:text-xl text-white opacity-90 leading-relaxed">
            Loonbedrijf Lolkema biedt alles van agrarisch loonwerk tot grondverzet en civiele techniek. 
            Met moderne machines, ervaren medewerkers en een no-nonsense aanpak leveren we efficiënt 
            en betrouwbaar werk, elke keer weer.
          </p>
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a
              href="#contact"
              className="inline-block bg-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-md text-sm sm:text-base font-medium text-green-800 hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
              Neem Contact Op
            </a>
            <a
              href="#services"
              className="inline-block bg-transparent py-2.5 sm:py-3 px-6 sm:px-8 border-2 border-white rounded-md text-sm sm:text-base font-medium text-white hover:bg-white/10 transition duration-300 transform hover:scale-105"
            >
              Onze Diensten
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <div className="w-1 h-12 sm:h-16 relative">
          <div className="absolute w-full h-1/2 bg-gradient-to-b from-white to-transparent rounded-t-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;