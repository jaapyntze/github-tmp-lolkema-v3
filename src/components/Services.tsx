import React from 'react';
import { Tractor, Shovel, Sprout, Handshake, Truck, LandPlot, ArrowRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    id: 'transport-logistiek',
    title: 'Transport & Logistiek',
    description: 'Betrouwbaar transport van mest, zware ladingen en bulkmaterialen met diepladers, kieptrailers en andere gespecialiseerde vervoersmiddelen.',
    icon: <Truck className="h-6 w-6" />,
    image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/vrachtwagen2.jpg'
  },
  {
    id: 'civiele-techniek',
    title: 'Civiele techniek',
    description: 'Vakmanschap in civiele techniek en natuurbouw, gegarandeerd met NEN-EN-ISO 9001 en VCA-certificering. Onze ervaren en gecertificeerde medewerkers leveren kwaliteit in elk project.',
    icon: <LandPlot className="h-6 w-6" />,
    image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/actie.jpg'
  },
  {
    id: 'agrarisch-loonwerk',
    title: 'Agrarisch Loonwerk',
    description: 'Maximaal rendement uit uw agrarische middelen met professioneel loonwerk. Met geavanceerde machines en vakbekwame medewerkers zorgen wij voor efficiënte en betrouwbare ondersteuning.',
    icon: <Tractor className="h-6 w-6" />,
    image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/hakselen.jpg'
  },
  {
    id: 'grondverzet-infra',
    title: 'Grondverzet & Infra',
    description: 'Betrouwbare partner voor baggerwerk, bouwputontgraving, grondafzet en tuinaanleg. Wij zetten onze expertise in voor succesvolle projecten.',
    icon: <Shovel className="h-6 w-6" />,
    image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/project.jpg'
  },
  {
    id: 'water-natuur',
    title: 'Water & Natuur',
    description: 'Duurzame en doeltreffende oplossingen voor waterbeheer en natuurinrichting, van slootonderhoud en baggerwerk tot de aanleg van waterpartijen en beschoeiing.',
    icon: <Sprout className="h-6 w-6" />,
    image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/kraan.jpg'
  },
  {
    id: 'machine-verhuur',
    title: 'Machine Verhuur',
    description: 'Uitgebreide verhuurservice voor diverse machines en voertuigen, inclusief bediening en onderhoud, voor maximale efficiëntie en flexibiliteit op elke locatie.',
    icon: <Handshake className="h-6 w-6" />,
    image: 'https://xjwlrohfjskzalfgvbug.supabase.co/storage/v1/object/public/public/Home/persen.jpg'
  }
];

const Services = () => {
  const [titleRef, isTitleInView] = useInView({ threshold: 0.1 });
  const navigate = useNavigate();

  const getCardOffset = (index: number) => {
    // Create a wave-like pattern with vertical offsets
    switch (index) {
      case 0: return 'translate-y-32'; // First card, moved down
      case 1: return 'translate-y-16'; // Second card, slight offset
      case 2: return 'translate-y-0';  // Third card, no offset
      case 3: return 'translate-y-24'; // Fourth card, moved down
      case 4: return 'translate-y-8';  // Fifth card, slight offset
      case 5: return 'translate-y-20'; // Sixth card, moved down
      default: return 'translate-y-0';
    }
  };

  const ServiceCard = ({ service, index }: { service: typeof services[0], index: number }) => {
    const [ref, isInView] = useInView({ threshold: 0.1 });
    const offset = getCardOffset(index);

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        onClick={() => navigate(`/diensten/${service.id}`)}
        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 transform w-[16%] h-[500px] ${offset} ${
          isInView
            ? 'opacity-100'
            : 'opacity-0 translate-y-[60px]'
        } hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-2`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Base gradient overlay - always visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 opacity-60 transition-opacity duration-300" />
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
        </div>

        {/* Service Icon */}
        <div className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300 group-hover:bg-primary-600 group-hover:scale-110 text-white">
          {service.icon}
        </div>

        {/* Content Container */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
          {/* Title */}
          <h3 className="text-2xl font-bold text-white transition-all duration-300 transform translate-y-0 group-hover:translate-y-[-16px]">
            {service.title}
          </h3>
          
          {/* Description - Hidden by default, shown on hover */}
          <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 delay-100">
            <p className="text-sm text-white/90 mb-6 line-clamp-3">
              {service.description}
            </p>
          </div>

          {/* Lees meer button - Hidden by default, shown on hover */}
          <div className="flex items-center text-sm font-medium text-white/0 group-hover:text-primary-500 transition-all duration-300 transform translate-y-0 group-hover:translate-y-[-16px]">
            <span>Lees meer</span>
            <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="services" className="py-32 bg-secondary-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center transition-all duration-700 transform ${
            isTitleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl">
            Onze Diensten
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-secondary-500">
            Wij bieden een compleet pakket aan agrarische diensten met moderne machines en ervaren personeel.
          </p>
        </div>

        {/* Services Row */}
        <div className="mt-16 mb-32 flex justify-between items-start gap-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;