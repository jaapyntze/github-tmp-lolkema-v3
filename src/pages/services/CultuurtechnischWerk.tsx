import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sprout, CheckCircle, ChevronDown } from 'lucide-react';
import DescriptionRenderer from '../../components/DescriptionRenderer';

const WaterNatuur = () => {
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
      title: 'Slootgraven',
      subtitle: 'Voor optimaal waterbeheer en afwatering',
      description: 'Een goed aangelegd en onderhouden slootsysteem is cruciaal voor een effectieve waterafvoer en het voorkomen van wateroverlast. Of het nu gaat om het graven van nieuwe sloten, het verbreden of verdiepen van bestaande watergangen, nauwkeurig werk zorgt voor een duurzaam resultaat.\n\nMet moderne graafmachines en deskundige uitvoering worden sloten geoptimaliseerd voor een efficiënte doorstroming en een goed beheerde omgeving.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/WaterNatuur/slootgraven.jpg',
      features: [
        'Graven van nieuwe sloten',
        'Verbreden en verdiepen van bestaande watergangen',
        'Efficiënte en nauwkeurige uitvoering'
      ]
    },
    {
      title: 'Baggerwerkzaamheden',
      subtitle: 'Voor schone en goed doorstromende waterwegen',
      description: 'Goed onderhouden waterwegen zijn essentieel voor een optimale waterafvoer en het voorkomen van overstromingen. Bij Loonbedrijf Lolkema hebben we de expertise en de juiste machines om baggerwerkzaamheden vakkundig en efficiënt uit te voeren.\n\nOnze ervaren specialisten verwijderen slib, plantenresten en andere afzettingen uit sloten, kanalen en watergangen. Dit bevordert een soepele waterstroming en draagt bij aan een gezond waterbeheer. Met onze professionele en doelgerichte aanpak zorgen we ervoor dat uw waterwegen optimaal blijven functioneren.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/WaterNatuur/baggerwerkzaamheden.jpg',
      features: [
        'Baggeren van sloten en kanalen',
        'Onderhoud van watergangen',
        'Verwijderen van slib en obstakels'
      ]
    },
    {
      title: 'Graven van waterpartijen / poelen',
      subtitle: 'Creëer uw ideale wateromgeving',
      description: 'Of u nu een sierlijke vijver in uw tuin wilt aanleggen of een ecologische poel voor natuurbeheer, het graven van waterpartijen vereist vakmanschap en precisie. Wij zorgen voor het juiste grondverzet, afvoerbeheer en de ideale wateromstandigheden om uw project tot een succes te maken.\n\nMet onze ervaring en expertise realiseren we uw visie, van het graven van de waterpartij tot het creëren van een stabiele en duurzame wateromgeving die past bij uw wensen.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/WaterNatuur/graven-van-waterpartijen.jpg',
      features: [
        'Graven van vijvers en poelen',
        'Ecologisch verantwoorde waterpartijen',
        'Duurzaam en professioneel ontwerp'
      ]
    },
    {
      title: 'Beschoeiing',
      subtitle: 'Duurzame bescherming van oevers en waterkanten',
      description: 'Een stevige en goed geplaatste beschoeiing voorkomt erosie en zorgt voor een stabiele oever. Of het nu gaat om kunststof of hardhouten beschoeiingen, een vakkundige plaatsing verlengt de levensduur en biedt een nette afwerking van waterkanten.\n\nMet jarenlange ervaring en gespecialiseerde technieken wordt beschoeiing geplaatst vanaf de waterkant of direct vanaf het water. Dit garandeert een efficiënte en duurzame oplossing voor elke locatie.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/WaterNatuur/beschoeiing-plaatsen.jpg',
      features: [
        'Plaatsen van kunststof en hardhouten beschoeiingen',
        'Bescherming tegen oevererosie',
        'Duurzame en onderhoudsarme oplossingen'
      ]
    },
    {
      title: 'Sloot- en bermonderhoud',
      subtitle: 'Optimale waterafvoer en een verzorgd landschap',
      description: 'Goed onderhouden sloten en bermen zijn essentieel voor een efficiënte waterafvoer en een net terrein. Regelmatig onderhoud voorkomt verstoppingen, overstromingen en ongewenste wildgroei, waardoor het landschap zowel functioneel als esthetisch in topconditie blijft.\n\nMet professionele machines en een deskundig team worden sloten en bermen grondig gereinigd en onderhouden. Dit draagt bij aan een duurzaam en goed beheerd buitengebied.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/WaterNatuur/sloot-en-bermonderhoud.jpg',
      features: [
        'Maaien en schonen van sloten',
        'Verwijderen van begroeiing en obstakels',
        'Regelmatig onderhoud voor een blijvend nette omgeving',
      ]
    },
    {
      title: 'Tuinaanleg',
      subtitle: 'Van ontwerp tot perfecte afwerking',
      description: 'Een goed aangelegde tuin begint met een doordacht plan en vakkundige uitvoering. Of het nu gaat om een compleet nieuwe tuin of een renovatie, een doordachte aanpak zorgt voor een duurzaam en esthetisch resultaat.\n\nMet oog voor detail en kennis van grondverrijking, drainage en bestrating wordt elke tuin aangelegd volgens de wensen van de klant. Van het eerste ontwerp tot de laatste afwerking, alles wordt vakkundig en efficiënt gerealiseerd.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/WaterNatuur/tuinaanleg.jpg',
      features: [
        'Ontwerp en grondvoorbereiding',
        'Afwatering en grondverbetering',
        'Aanleg van bestrating en verhardingen'
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
              src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/WaterNatuur/water-natuur-hero.jpg"
              srcSet="
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/WaterNatuur/water-natuur-hero-480w.jpg 480w,
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/WaterNatuur/water-natuur-hero-768w.jpg 768w,
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/WaterNatuur/water-natuur-hero-1024w.jpg 1024w"
              sizes="(max-width: 600px) 480px,
                     (max-width: 1024px) 768px,
                     1024px"
              alt="Water & Natuur Hero"
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
                    <Sprout className="h-8 sm:h-12 w-8 sm:w-12 text-primary-600" />
                  </div>
                  <h1 className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-700 delay-500 transform ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    Water & Natuur
                  </h1>
                  <p className={`text-white/90 text-base sm:text-lg max-w-xl transition-all duration-700 delay-700 transform ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    Wij verzorgen compleet waterbeheer en tuinaanleg, van grond- en graafwerk tot onderhoud. Of het nu gaat om waterdoorstroming of een prachtige tuin, wij leveren vakmanschap van begin tot eind.
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
              Duurzaam Waterbeheer en Natuurbouw op Maat
            </h2>
            <p className="text-secondary-600 mb-8 max-w-2xl mx-auto">
              Neem contact met ons op voor een vrijblijvende offerte en ontdek hoe wij uw project kunnen verduurzamen met professionele oplossingen voor waterbeheer en natuurinrichting!
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

export default WaterNatuur;