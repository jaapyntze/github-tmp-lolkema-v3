import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const About = () => {
  const [textRef, isTextInView] = useInView({ threshold: 0.1 });
  const [imageRef, isImageInView] = useInView({ threshold: 0.1 });

  return (
    <section id="about" className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div
            ref={textRef as React.RefObject<HTMLDivElement>}
            className="space-y-4 sm:space-y-6"
          >
            <h2 
              className={`text-2xl sm:text-3xl md:text-4xl font-extrabold text-secondary-900 transition-all duration-1000 transform ${
                isTextInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Over Loonbedrijf Lolkema
            </h2>
            <p 
              className={`mt-3 sm:mt-4 text-base sm:text-lg text-secondary-600 leading-relaxed transition-all duration-1000 delay-200 transform ${
                isTextInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              In meer dan 40 jaar tijd is Loonbedrijf Lolkema uitgegroeid van een eenmanszaak tot een onderneming met gecertificeerde medewerkers. Met een actueel machinepark wordt een grote verscheidenheid aan werkzaamheden uitgevoerd in de agrarische sector en de grond, weg en waterbouw. Door een flexibele inzet van een gemotiveerd team wordt elke dag gestreefd naar een hoge klanttevredenheid.
            </p>
            <p 
              className={`mt-3 sm:mt-4 text-base sm:text-lg text-secondary-600 leading-relaxed transition-all duration-1000 delay-300 transform ${
                isTextInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              We denken met onze klanten mee en schakelen snel om elke klus efficiënt en vakkundig uit te voeren. Door onze brede inzetbaarheid en focus op innovatie helpen we agrariërs en aannemers bij een duurzame en rendabele bedrijfsvoering.
            </p>
            
            <div 
              className={`mt-6 sm:mt-8 transition-all duration-1000 delay-400 transform ${
                isTextInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h3 className="text-lg sm:text-xl font-bold text-secondary-900">Waarom kiezen voor ons?</h3>
              <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                {[
                  'Modern machinepark met GPS-precisie',
                  'Ervaren en vakkundig personeel',
                  'Flexibele planning en snelle service',
                  'Focus op kwaliteit en duurzaamheid',
                  'Persoonlijke benadering en maatwerk'
                ].map((item, index) => (
                  <li 
                    key={index} 
                    className={`flex items-start transition-all duration-500 transform ${
                      isTextInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-secondary-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div 
            ref={imageRef as React.RefObject<HTMLDivElement>}
            className={`mt-8 lg:mt-0 transition-all duration-1000 transform ${
              isImageInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-2">
                <img
                  src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/actie.jpg"
                  srcSet="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/actie-480w.jpg 480w,
                          https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/actie-768w.jpg 768w,
                          https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/actie-1024w.jpg 1024w"
                  sizes="(max-width: 640px) 480px,
                         (max-width: 1024px) 768px,
                         1024px"
                  alt="Voorbereiding landbouwgrond"
                  className="rounded-lg shadow-md h-48 sm:h-64 w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <img
                  src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/sleepslangen.jpg"
                  srcSet="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/sleepslangen-480w.jpg 480w,
                          https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/sleepslangen-768w.jpg 768w,
                          https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/sleepslangen-1024w.jpg 1024w"
                  sizes="(max-width: 640px) 480px,
                         (max-width: 1024px) 768px,
                         1024px"
                  alt="Trekker op land met slangenhaspel voor het sleepslangen"
                  className="rounded-lg shadow-md h-32 sm:h-48 w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <img
                  src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/kraan.jpg"
                  srcSet="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/kraan-480w.jpg 480w,
                          https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/kraan-768w.jpg 768w,
                          https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/kraan-1024w.jpg 1024w"
                  sizes="(max-width: 640px) 480px,
                         (max-width: 1024px) 768px,
                         1024px"
                  alt="Kraan op bouwgrond"
                  className="rounded-lg shadow-md h-32 sm:h-48 w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;