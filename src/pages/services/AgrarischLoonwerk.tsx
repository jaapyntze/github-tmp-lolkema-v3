import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tractor, CheckCircle, ChevronDown } from 'lucide-react';
import DescriptionRenderer from '../../components/DescriptionRenderer';

const AgrarischLoonwerk = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const contactSectionRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  // Scroll to top immediately when component mounts
  window.scrollTo(0, 0);

  // Use requestAnimationFrame to set mounted to true right before the next repaint
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
      const offset = 40;
      const top = ref.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const services = [
    {
      title: 'Landverbetering',
      subtitle: 'De basis voor een succesvolle oogst',
      description: 'Bij Loonbedrijf Lolkema staan we voor een gezonde, vruchtbare bodem die de basis vormt voor een succesvolle gewasteelt. Het creëren van een optimaal zaaibed is cruciaal voor het behalen van de beste opbrengsten. Daarom richten we ons op minimale, maar effectieve grondbewerkingen die verslemping en verdichting voorkomen.\n\nOnze aanpak verbetert de bodemstructuur, wat resulteert in een hogere opbrengst en gezondere gewassen. Met onze diepgaande expertise en het gebruik van moderne technieken zorgen wij voor een sterke start van uw gewassen, zodat u kunt rekenen op een succesvolle oogst.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/grashakselen.jpg',
      features: [
        'Egalisatie en drainage',
        'Bodemstructuurverbetering',
        'Duurzaam bodembeheer'
      ]
    },
    {
      title: 'Bemesting',
      subtitle: 'Gericht voeden voor maximale opbrengst',
      description: 'Een gezonde bodem is de basis voor sterke gewasgroei en hoge opbrengsten. Daarom biedt Loonbedrijf Lolkema diverse bemestingsmethoden die volledig zijn afgestemd op de specifieke behoeften van uw land.\n\nMet behulp van precisietechnieken zorgen we voor een ideale balans van voedingsstoffen in de bodem. Dit resulteert niet alleen in een verbeterde bodemstructuur, maar ook in hogere opbrengsten en gezonde gewassen.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/sleepslangen.jpg',
      features: [
        'Sleepslangbemesten – Efficiënt met minimale bodemverdichting',
        'Bemesten met tank – Flexibele verspreiding van meststoffen',
        'Vloeibare kunstmest spuiten – Precieze dosering voor snelle opname',
        'Kunstmest strooien – Gelijkmatige verspreiding voor balans'
      ]
    },
    {
      title: 'Maaien',
      subtitle: 'Efficiënt en kwaliteitsgericht',
      description: 'Voor het maaien van gras maken we gebruik van twee 9-meter maaicombinaties, uitgerust met kneuzers en afvoerbanden. Dankzij de afvoerbanden wordt het gemaaide gras efficiënt naar binnen gebracht, waardoor verlies in de sloot tot een minimum wordt beperkt.\n\nDaarnaast bieden we de mogelijkheid om direct in zwad te maaien, wat harken overbodig maakt en de voederwaarde van het gras optimaal behoudt. Dit is met name ideaal voor gewassen zoals luzerne of een droge zomersnede, die een minimale droogtijd vereisen.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/grasmaaien.jpg',
      features: [
        '9-meter maaicombinaties',
        'Afvoerbanden voor minimalisering grasverlies',
        'Direct in zwad maaien'
      ]
    },
    {
      title: 'Grashakselen',
      subtitle: 'Precisie en efficiëntie voor hoogwaardige voederwinning',
      description: 'Voor het grashakselen wordt de Claas Jaguar 840 ingezet, uitgerust met een graspickup voor snelle en efficiënte verwerking. De instelbare haksellengte maakt het voer perfect geschikt voor voermengwagens.\n\nOm de kwaliteit en houdbaarheid te verbeteren, kunnen toevoegingsmiddelen zoals melasse en bacteriën worden toegevoegd voor betere conservering. Het gehakselde gras wordt afgevoerd met Kaweco Radium silagewagens, voorzien van lagedrukbanden en gestuurde assen om bodemverdichting te minimaliseren.\n\nModerne machines en vakmanschap zorgen voor een efficiënte oogst en hoogwaardig ruwvoer voor vee.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/grashakselen.jpg',
      features: [
        'Scherpe snijkwaliteit',
        'Optimale haksellengte',
        'Efficiënt transport'
      ]
    },
    {
      title: 'Grootpakpersen',
      subtitle: 'Efficiënt balen persen en wikkelen',
      description: 'Bij Loonbedrijf Lolkema persen en wikkelen we gras, hooi en stro met precisie en efficiëntie. We bieden grootpakpersen in twee formaten: 90x120x160 cm en 70x120x160 cm, zodat we altijd aan uw specifieke wensen kunnen voldoen.\n\nOnze persen zijn uitgerust met 30 messen, waardoor het gewas kort kan worden gesneden voor een betere verdichting en voeropname. Indien gewenst, kunnen we ook persen met minder of zonder messen.\n\nDoor onze professionele aanpak zorgen we voor optimaal bewaarbare balen van hoge kwaliteit.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/vierkante-balen-persen-en-wikkelen.jpg',
      features: [
        'Hoge kwaliteit balen',
        '2 formaten grootpakpersen',
        'Persen met minder of zonder messen',
      ]
    },
    {
      title: 'Rondebalenpersen',
      subtitle: 'Stevige en duurzame balen in één werkgang',
      description: 'Bij Loonbedrijf Lolkema persen we gras, hooi en stro efficiënt in ronde balen met onze McHale Fusion 3. Dankzij de vier banden op één rij wordt uw gewas in één werkgang verwerkt, met minimale insporing en maximale baalkwaliteit.\n\nOnze folie-bindingstechniek zorgt voor een stevig geperste baal van 125 cm, met slechts één restproduct. Dit maakt de verwerking eenvoudiger en draagt bij aan een betere conservering en voerkwaliteit.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/rondebalen-persen.jpg',
      features: [
        'Hoogwaardige rondebalen',
        'Stevige rondebalen',
        'Verbeterde conservering'
      ]
    },
    {
      title: 'Opraapwagens',
      subtitle: 'Efficiënt inkuilen met minimale bodemdruk',
      description: 'We bieden hoogwaardige opraapwagens voor efficiënt inkuilen. Deze wagens zijn uitgerust met flexibele messenhouders, zodat de gewaslengte nauwkeurig kan worden aangepast.\n\nToevoegingsmiddelen zoals conserveermiddelen kunnen eenvoudig worden toegevoegd voor een betere bewaartijd. Dankzij gestuurde tandems en lagedrukbanden wordt de bodemdruk geminimaliseerd en blijft het land beschermd.\n\nSinds 2011 wordt de Krone ZX 450 GL ingezet, met een geïntegreerd weegsysteem voor nauwkeurige opbrengstbepaling en efficiënte verwerking. Onze opraapwagens garanderen een professionele en efficiënte inkuiling.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/opraapwagens.jpg',
      features: [
        'Toevoeging van conserveermiddelen',
        'Gestuurde tandems en lagedrukbanden voor minimale bodemdruk',
        'Flexibele messenhouders',
        'Weegsysteem voor nauwkeurige opbrengstbepaling'
      ]
    },
    {
      title: 'Maisoogst',
      subtitle: 'Efficiënt en tijdig voor een maximale oogst',
      description: 'De maisoogst is een cruciaal moment in het agrarische seizoen en vereist de juiste ondersteuning voor een optimaal resultaat. Met ervaren medewerkers en moderne apparatuur bieden we diensten voor het zaaien, oogsten en verwerken van mais aan.\n\nEen vlotte en tijdige oogst is essentieel voor het behoud van kwaliteit en opbrengst. Met efficiënte uitvoering wordt de mais op het juiste moment geoogst, wat resulteert in de beste opbrengst en hoogwaardige gewassen.',
      image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/maishakselen.jpg',
      features: [
        'Moderne hakselaars',
        'Ervaren medewerkers',
        'Tijdige oogst'
      ]
    }
  ];

  return (
    <div
  className={`min-h-screen bg-secondary-50 pt-20 sm:pt-32 pb-12 transition-opacity duration-500 ease-in-out`}
  style={{ opacity: mounted ? 1 : 0 }}>
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
              src="https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/vrachtauto-en-mesttank.jpg"
              srcSet="
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/vrachtauto-en-mesttank-480w.jpg 480w,
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/vrachtauto-en-mesttank-768w.jpg 768w,
                https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/AgrarischLoonwerk/vrachtauto-en-mesttank-1024w.jpg 1024w"
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
                    Agrarisch Loonwerk
                  </h1>
                  <p className={`text-white/90 text-base sm:text-lg max-w-xl transition-all duration-700 delay-700 transform ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    Wij zijn uw betrouwbare partner voor alle agrarische loonwerkzaamheden. Met ons moderne machinepark en ervaren personeel staan we garant voor kwaliteit en efficiëntie.
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
              Interesse in onze agrarische diensten?
            </h2>
            <p className="text-secondary-600 mb-8 max-w-2xl mx-auto">
              Wij denken graag met u mee over de beste aanpak voor uw specifieke situatie. 
              Neem contact met ons op voor een vrijblijvende offerte of meer informatie.
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

export default AgrarischLoonwerk;