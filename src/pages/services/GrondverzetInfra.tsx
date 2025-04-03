import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tractor, CheckCircle, ChevronDown } from 'lucide-react';
import DescriptionRenderer from '../../components/DescriptionRenderer';

const GrondverzetInfra = () => {
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
      title: 'Ontgraven van bouwputten',
      subtitle: 'Een solide basis voor elk bouwproject',
      description: 'Een goed voorbereide bouwput is de eerste stap naar een stabiele en duurzame constructie. Of het nu gaat om funderingen voor woningen, schuren of grote bedrijfshallen, een nauwkeurige en efficiënte ontgraving is essentieel.\n\nMet moderne machines en ervaren machinisten worden bouwputten vakkundig uitgegraven volgens de specifieke eisen van het project. Dit zorgt voor een stabiele ondergrond en een soepele voortgang van de bouwwerkzaamheden.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/GrondverzetInfra/ontgraven-van-bouwputten.jpg',
      features: [
        'Graven van funderingen',
        'Ontgraven van bouwputten voor woningen en bedrijfsgebouwen',
        'Precisiewerk met moderne graaftechnieken'
      ]
    },
    {
      title: 'Afzetten van grond',
      subtitle: 'Efficiënt beheer en transport van grondstromen',
      description: 'Bij grondverzet is een vlotte en deskundige afvoer van grond essentieel om projecten zonder vertraging te laten verlopen. Of het nu gaat om het verplaatsen, afvoeren of deponeren van grond, een efficiënte aanpak bespaart tijd en kosten.\n\nDoor snelle coördinatie en nauwkeurige planning wordt overtollige grond op de juiste wijze afgevoerd, volgens de geldende richtlijnen. Dit zorgt voor een soepel bouwproces en een goed beheerde werklocatie.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/GrondverzetInfra/afzetten-van-grond.jpg',
      features: [
        'Transport en afvoer van grond',
        'Depotbeheer en verwerking volgens regelgeving',
        'Advies over hergebruik en afzetmogelijkheden',
        'Snelle en efficiënte afhandeling'
      ]
    },
    {
      title: 'Verkavelingswerkzaamheden',
      subtitle: 'Efficiënt verdelen van grond voor diverse doeleinden',
      description: 'Verkaveling is essentieel voor het optimaal benutten van grond voor bouw, agrarische toepassingen of andere doeleinden. Met onze expertise in grondverzet en terreinindeling zorgen we voor een efficiënte en nauwkeurige uitvoering van uw verkavelingsproject.\n\nWij bieden een complete aanpak, van het verdelen van percelen tot het uitvoeren van gerelateerde werkzaamheden, zodat u het gewenste resultaat snel en effectief kunt bereiken.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/GrondverzetInfra/verkavelingswerkzaamheden.jpg',
      features: [
        'Verdelen van grond in bouw- en landbouwpercelen',
        'Efficiënte en nauwkeurige uitvoering',
        'Advies en planning voor terreinindeling'
      ]
    },
    {
      title: 'Leveren en leggen van stalen rijplaten',
      subtitle: 'Voor tijdelijke toegangswegen en bescherming van ondergronden',
      description: 'Stalen rijplaten bieden een solide oplossing voor tijdelijke toegangswegen op bouwplaatsen of het beschermen van ondergronden tegen zware belastingen, vooral in industriële toepassingen. Wij zorgen voor de levering en professionele installatie van rijplaten, afgestemd op de specifieke behoeften van uw project.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/GrondverzetInfra/leveren-en-aanleggen-van-rijplaaten.jpg',
      features: [
        'Levering van hoogwaardige stalen rijplaten',
        'Bescherming van ondergronden tegen zware belasting',
        'Duurzame en efficiënte oplossingen voor industriële toepassingen'
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
              src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/GrondverzetInfra/grondverzetinfra-hero.jpg"
              srcSet="
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/GrondverzetInfra/grondverzetinfra-hero-480w.jpg 480w,
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/GrondverzetInfra//grondverzetinfra-hero-768w.jpg 768w,
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/GrondverzetInfra/grondverzetinfra-hero-1024w.jpg 1024w"
              sizes="(max-width: 600px) 480px,
                     (max-width: 1024px) 768px,
                     1024px"
              alt="Agrarisch Loonwerk"
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
                    <Tractor className="h-8 sm:h-12 w-8 sm:w-12 text-primary-600" />
                  </div>
                  <h1 className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-700 delay-500 transform ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    Grondverzet & Infra
                  </h1>
                  <p className={`text-white/90 text-base sm:text-lg max-w-xl transition-all duration-700 delay-700 transform ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    Wij verzorgen alles van het ontgraven van bouwputten tot het leveren van rijplaten. Met focus op efficiëntie en betrouwbaarheid zorgen wij ervoor dat uw grondwerken en infra van start tot finish vlekkeloos verlopen. Van afzetten van grond tot verkaveling, wij regelen het voor u.
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
              Laat uw Grondverzet & Infra-project vlot van start gaan
            </h2>
            <p className="text-secondary-600 mb-8 max-w-2xl mx-auto">
              Neem contact met ons op voor een vrijblijvende offerte en ontdek hoe wij uw project efficiënt en succesvol kunnen uitvoeren!
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

export default GrondverzetInfra;