import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Handshake, CheckCircle, ChevronDown } from 'lucide-react';
import DescriptionRenderer from '../../components/DescriptionRenderer';

const MachineVerhuur = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const contactSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top immediately when component mounts
    window.scrollTo(0, 0);
    
    // Set mounted state after a very short delay to ensure animations trigger
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + (window.innerHeight * 0.76);
      const newActiveSections: string[] = [];
      const untriggerOffset = window.innerHeight * 0.6;

      Object.entries(sectionRefs.current).forEach(([title, ref]) => {
        if (ref) {
          const sectionTop = ref.offsetTop;
          const sectionBottom = ref.offsetTop + ref.offsetHeight;

          if (sectionTop <= scrollPosition && sectionBottom > scrollPosition - untriggerOffset) {
            newActiveSections.push(title);

            const currentIndex = services.findIndex(s => s.title === title);
            if (currentIndex < services.length - 1) {
              const nextSection = services[currentIndex + 1].title;
              const nextRef = sectionRefs.current[nextSection];
              if (nextRef && scrollPosition + 100 >= nextRef.offsetTop) {
                newActiveSections.push(nextSection);
              }
            }
          }
        }
      });

      if (contactSectionRef.current) {
        const contactTop = contactSectionRef.current.offsetTop;
        if (scrollPosition >= contactTop) {
          newActiveSections.push('contact');
        }
      }

      setActiveSections(newActiveSections);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/', { state: { scrollTo: 'services' } });
    }, 300);
  };

  const scrollToSection = (title: string) => {
    const ref = sectionRefs.current[title];
    if (ref) {
      const offset = 100;
      const top = ref.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const services = [
    {
      title: 'Vrachtauto',
      subtitle: 'Betrouwbaar vervoer voor al uw transportbehoeften',
      description: "Wij bieden diverse vrachtauto's in ons verhuuraanbod, geschikt voor het vervoeren van goederen, materialen en ladingen naar verschillende locaties. Of het nu gaat om een klein transport of een grotere lading, onze goed onderhouden vrachtauto's bieden de juiste oplossing voor uw transportbehoeften.\n\nOnze ervaren chauffeurs zorgen voor efficiënt en veilig transport, zodat uw goederen op tijd en in goede staat op de bestemming aankomen. Bij Loonbedrijf Lolkema kunt u rekenen op betrouwbare voertuigen en professionele ondersteuning om uw transporttaken succesvol uit te voeren.",
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/MachineVerhuur/vrachtauto.jpg',
      features: [
        "Verhuur van vrachtauto's voor diverse transportbehoeften",
        'Geschikt voor het vervoeren van goederen, materialen en ladingen',
        'Goed onderhouden voertuigen voor betrouwbaar transport'
      ]
    },
    {
      title: 'Trekkers en dumpers',
      subtitle: 'Essentiële machines voor bouw en landbouw',
      description: 'Binnen ons verhuuraanbod bieden wij trekkers en dumpers, twee krachtige machines die onmisbaar zijn voor diverse toepassingen. Trekkers worden gebruikt voor het trekken van zware ladingen, terwijl dumpers speciaal zijn ontworpen voor het efficiënt transporteren en lossen van materialen zoals grond, stenen en bouwafval.\n\nOnze goed onderhouden trekkers en dumpers zijn klaar voor gebruik en bieden betrouwbare prestaties voor uw bouw- en landbouwprojecten.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/MachineVerhuur/trekkers-en-dumpers.jpg',
      features: [
        'Verhuur van trekkers voor zware ladingen',
        'Dumpers voor transport en lossen van materialen',
        'Geschikt voor bouw- en landbouwprojecten'
      ]
    },
    {
      title: 'Minigravers',
      subtitle: 'Compacte krachtpatsers voor graaf- en grondverzetwerkzaamheden',
      description: 'Onze minigravers zijn de ideale oplossing voor graaf- en grondverzetwerkzaamheden op locaties met beperkte toegang of ruimte. Deze compacte en wendbare machines bieden uitstekende prestaties en zijn ontworpen om efficiënt te werken in krappe omgevingen.\n\nOf het nu gaat om grondbewerking, sleufgraven of het uitgraven van funderingen, onze goed onderhouden minigravers worden geleverd met ervaren bedieners die zorgen voor een vlotte uitvoering van uw project.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/MachineVerhuur/minigravers.jpg',
      features: [
        'Verhuur van compacte minigravers voor kleine ruimtes',
        'Geschikt voor graafwerk, sleufgraven en fundering uitgraven',
        'Goed onderhouden machines voor optimale prestaties'
      ]
    },
    {
      title: 'Shovels',
      subtitle: 'Krachtige machines voor efficiënt laden en verplaatsen',
      description: 'Onze verhuurservice biedt shovels, robuuste machines die ideaal zijn voor het laden, verplaatsen en manipuleren van diverse materialen zoals grond, zand, grind en bouwafval. Deze veelzijdige machines worden vaak ingezet in de bouw, landbouw en andere industrieën voor verschillende taken.\n\nMet hun ontwerp gericht op efficiëntie en snelheid, zorgen shovels ervoor dat grote hoeveelheden materiaal snel en effectief worden verwerkt.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/MachineVerhuur/shovels.jpg',
      features: [
        'Verhuur van krachtige shovels voor verschillende materialen',
        'Ideaal voor het laden, verplaatsen en manipuleren van grond, zand, grind en bouwafval',
        'Veelzijdig inzetbaar in bouw, landbouw en andere sectoren'
      ]
    },
    {
      title: 'Mobiele Hydraulische Kranen',
      subtitle: 'Voor flexibele en efficiënte hijs- en hefwerkzaamheden',
      description: 'Onze mobiele hydraulische kranen bieden uitstekende prestaties voor uiteenlopende hijs- en hefprojecten. Ontworpen voor mobiliteit en flexibiliteit, kunnen deze kranen snel en efficiënt worden ingezet op verschillende locaties.\n\nMet krachtige hydraulische systemen en geavanceerde hijsapparatuur zijn mobiele hydraulische kranen de perfecte keuze voor projecten waar precisie en betrouwbaarheid essentieel zijn.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/MachineVerhuur/mobiele-hydraulische-kranen.jpg',
      features: [
        'Verhuur van mobiele hydraulische kranen voor diverse hijs- en hefwerkzaamheden',
        'Snel en flexibel inzetbaar op verschillende locaties',
        'Krachtige hydraulische systemen voor zware lasten',
      ]
    },
    {
      title: 'Hydraulische Rupskranen',
      subtitle: 'Voor krachtig en nauwkeurig werk op elk terrein',
      description: 'Onze verhuurservice biedt hydraulische rupskranen, robuuste machines die ideaal zijn voor diverse bouw- en grondverzetprojecten. Dankzij de rupsbanden zijn deze kranen perfect geschikt voor werken op ruw en oneffen terrein, waardoor ze optimaal presteren in uitdagende omstandigheden.\n\nMet een focus op precisie en stabiliteit bij het tillen en verplaatsen van zware ladingen, zijn onze hydraulische rupskranen essentieel voor graaf-, hijs- en constructiewerkzaamheden.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/MachineVerhuur/hydraulische-rupskranen.jpg',
      features: [
        'Geschikt voor ruw en oneffen terrein',
        'Precisie en stabiliteit bij het tillen en verplaatsen van zware ladingen',
        'Ideaal voor graaf-, hijs- en constructiewerkzaamheden'
      ]
    }
  ];

  return (
    <div className={`min-h-screen bg-secondary-50 pt-20 sm:pt-32 pb-12 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={handleBack}
          className={`flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-all duration-300 transform hover:scale-105 ${
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Terug naar overzicht
        </button>

        <div className="relative rounded-xl overflow-hidden mb-12">
          <div className="relative h-[60vh] sm:h-[50vh]">
            <img
              src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/MachineVerhuur/machine-verhuur-hero.jpg"
              srcSet="
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/MachineVerhuur/machine-verhuur-hero-480w.jpg 480w,
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/MachineVerhuur/machine-verhuur-hero-768w.jpg 768w,
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/MachineVerhuur/machine-verhuur-hero-1024w.jpg 1024w"
              sizes="(max-width: 600px) 480px,
                     (max-width: 1024px) 768px,
                     1024px"
              alt="Machine Verhuur Hero"
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ${
                mounted ? 'scale-100' : 'scale-110'
              }`}
            />
            <div className={`absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 sm:from-black/70 to-black/20 sm:to-transparent transition-opacity duration-1000 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="absolute bottom-12 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 left-0 w-full sm:w-auto px-6 sm:px-8 sm:py-6">
                <div className="max-w-xl mx-auto sm:mx-0">
                  <div className={`inline-block p-3 bg-white/10 backdrop-blur-sm rounded-lg mb-4 transition-all duration-700 delay-300 transform ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <Handshake className="h-8 sm:h-12 w-8 sm:w-12 text-primary-600" />
                  </div>
                  <h1 className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-700 delay-500 transform ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    Machine Verhuur
                  </h1>
                  <p className={`text-white/90 text-base sm:text-lg max-w-xl transition-all duration-700 delay-700 transform ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    Onze uitgebreide vloot van machines biedt de perfecte oplossing voor al uw bouw- en grondwerkzaamheden. Van minigravers voor de fijne details tot hydraulische rupskranen voor zware hijstaken, wij leveren de juiste apparatuur voor iedere klus. Met shovels, trekkers, dumpers en mobiele kranen zorgen wij ervoor dat uw project efficiënt en veilig verloopt, van begin tot eind.
                  </p>
                </div>
              </div>
            </div>
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-700 delay-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <ChevronDown className="h-8 w-8 text-white animate-bounce" />
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-700 delay-[1200ms] transform ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-xl font-bold text-secondary-900 mb-2 text-center">Onze Diensten</h2>
          <p className="text-secondary-500 text-center text-sm mb-6">Klik op een dienst om meer te lezen of scroll verder.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(service.title)}
                className={`group relative p-4 rounded-lg bg-white transition-all duration-300 ease-out transform-gpu ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } hover:shadow-lg`}
                style={{ transitionDelay: `${1400 + index * 100}ms` }}
              >
                <div className="relative z-10 transition-transform duration-300 ease-out transform-gpu group-hover:-translate-y-1">
                  <h3 className="font-medium text-sm sm:text-base mb-2 text-secondary-900">
                    {service.title}
                  </h3>
                  <p className="text-xs text-secondary-500">
                    {service.subtitle}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-secondary-50" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-16 sm:px-8 lg:px-12">
            <div className="space-y-24">
              {services.map((service, index) => (
                <div
                  key={index}
                  ref={el => sectionRefs.current[service.title] = el}
                  className={`grid lg:grid-cols-2 gap-12 scroll-mt-32 ${
                    index % 2 === 0 ? '' : 'lg:grid-flow-col-dense'
                  }`}
                >
                  <div className={`${index % 2 === 0 ? '' : 'lg:col-start-2'} flex flex-col reveal${
                    index % 2 === 0 ? '-left' : '-right'
                  } ${activeSections.includes(service.title) ? 'active' : ''}`}>
                    <div className="flex-none">
                      <h3 className="text-2xl font-bold text-secondary-900 mb-2">{service.title}</h3>
                      <p className="text-lg text-primary-600 mb-4">{service.subtitle}</p>
                    </div>
                    <div className="flex-grow">
                      <DescriptionRenderer 
                        text={service.description}
                        className="text-secondary-600 mb-6"
                      />
                      <ul className="space-y-3">
                        {service.features.map((feature, featureIndex) => (
                          <li 
                            key={featureIndex} 
                            className={`flex items-start transition-all duration-500 transform`}
                            style={{ transitionDelay: `${featureIndex * 100}ms` }}
                          >
                            <CheckCircle className="h-5 w-5 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-secondary-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className={`${index % 2 === 0 ? '' : 'lg:col-start-1'} reveal${
                    index % 2 === 0 ? '-right' : '-left'
                  } ${activeSections.includes(service.title) ? 'active' : ''}`}>
                    <div className="overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={service.image}
                        srcSet={`
                          ${service.image.replace('.jpg', '-480w.jpg')} 480w,
                          ${service.image.replace('.jpg', '-768w.jpg')} 768w,
                          ${service.image.replace('.jpg', '-1024w.jpg')} 1024w,
                          ${service.image} 1200w
                        `}
                        sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                        alt={service.title}
                        className="w-full h-[300px] sm:h-[400px] object-cover transition-transform duration-700 ease-out transform hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div 
            ref={contactSectionRef}
            className={`bg-secondary-50 px-6 py-16 sm:px-8 lg:px-12 text-center reveal ${
              activeSections.includes('contact') || activeSections.includes(services[services.length - 1].title) ? 'active' : ''
            }`}
          >
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Flexibele machineverhuur voor elk project
            </h2>
            <p className="text-secondary-600 mb-8 max-w-2xl mx-auto">
              Neem vandaag nog contact met ons op voor een vrijblijvende offerte en huur de juiste machines voor uw klus met volledige ondersteuning!
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                setIsExiting(true);
                setTimeout(() => {
                  navigate('/', { state: { scrollTo: 'contact' } });
                }, 300);
              }}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 transform hover:scale-105"
            >
              Neem contact op
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineVerhuur;