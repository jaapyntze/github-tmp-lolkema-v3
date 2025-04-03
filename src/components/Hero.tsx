import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause video when tab is hidden
        video.pause();
      } else {
        // Resume video when tab becomes visible
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play was prevented, handle if needed
          });
        }
      }
    };

    // Handle focus/blur events
    const handleFocus = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented, handle if needed
        });
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Start playing when component mounts
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Auto-play was prevented, handle if needed
      });
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden flex items-center">
      {/* Background Video with Gradient Overlay */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hero-poster.jpg"
          className="w-full h-full object-cover origin-top"
          preload="metadata"
        >
          <source src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hero.webm" type="video/webm" />
          <source src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hero.mp4" type="video/mp4" />
          <img 
            src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hero-poster.jpg"
            srcSet="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hero-poster-480w.jpg 480w,
                    https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hero-poster-768w.jpg 768w,
                    https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hero-poster-1024w.jpg 1024w,
                    https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hero-poster.jpg 1920w"
            sizes="100vw"
            alt="Loonbedrijf Lolkema in actie"
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
        </video>
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
        
        {/* Red glow effect in bottom right corner */}
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-primary-500/20 blur-[100px] rounded-full mix-blend-soft-light transform translate-x-1/4 translate-y-1/4 opacity-30" />
        <div className="absolute bottom-0 right-0 w-[30vw] h-[30vh] bg-primary-500/30 blur-[80px] rounded-full mix-blend-soft-light transform translate-x-1/3 translate-y-1/3 opacity-10" />
      </div>

      {/* Logo */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <img
          src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/logo-120w.png"
          srcSet="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/logo-120w.png 120w,
                  https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/logo-480w.png 480w"
          sizes="(max-width: 768px) 120px, 480px"
          alt="Loonbedrijf Lolkema Logo"
          className="h-8 md:h-12 w-auto"
          loading="eager"
          fetchpriority="high"
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
              className="inline-block bg-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-md text-sm sm:text-base font-medium text-primary-800 hover:bg-secondary-100 transition duration-300 transform hover:scale-105"
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