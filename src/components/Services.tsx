import React, { useEffect, useState } from 'react';
import { Tractor, Shovel, Sprout, Handshake, Truck, LandPlot, ArrowRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    id: 'agrarisch-loonwerk',
    title: 'Agrarisch Loonwerk',
    description: 'Maximaal rendement uit uw agrarische middelen met professioneel loonwerk. Met geavanceerde machines en vakbekwame medewerkers zorgen wij voor efficiënte en betrouwbare ondersteuning.',
    icon: <Tractor className="h-10 w-10 text-primary-600" />
  },
  {
    id: 'grondverzet-infra',
    title: 'Grondverzet & Infra',
    description: 'Betrouwbare partner voor baggerwerk, bouwputontgraving, grondafzet en tuinaanleg. Wij zetten onze expertise in voor succesvolle projecten.',
    icon: <Shovel className="h-10 w-10 text-primary-600" />
  },
  {
    id: 'water-natuur',
    title: 'Water & Natuur',
    description: 'Duurzame en doeltreffende oplossingen voor waterbeheer en natuurinrichting, van slootonderhoud en baggerwerk tot de aanleg van waterpartijen en beschoeiing.',
    icon: <Sprout className="h-10 w-10 text-primary-600" />
  },
  {
    id: 'civiele-techniek',
    title: 'Civiele techniek',
    description: 'Vakmanschap in civiele techniek en natuurbouw, gegarandeerd met NEN-EN-ISO 9001 en VCA-certificering. Onze ervaren en gecertificeerde medewerkers leveren kwaliteit in elk project.',
    icon: <LandPlot className="h-10 w-10 text-primary-600" />
  },
  {
    id: 'transport-logistiek',
    title: 'Transport & Logistiek',
    description: 'Betrouwbaar transport van mest, zware ladingen en bulkmaterialen met diepladers, kieptrailers en andere gespecialiseerde vervoersmiddelen.',
    icon: <Truck className="h-10 w-10 text-primary-600" />
  },
  {
    id: 'machine-verhuur',
    title: 'Machine Verhuur',
    description: 'Uitgebreide verhuurservice voor diverse machines en voertuigen, inclusief bediening en onderhoud, voor maximale efficiëntie en flexibiliteit op elke locatie.',
    icon: <Handshake className="h-10 w-10 text-primary-600" />
  }
];

const Services = () => {
  const [titleRef, isTitleInView] = useInView({ threshold: 0.1 });
  const navigate = useNavigate();

  const ServiceCard = ({ service, index }: { service: typeof services[0], index: number }) => {
    const [ref, isInView] = useInView({ threshold: 0.1 });

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-500 transform ${
          isInView
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-[100px]'
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className="mb-4">{service.icon}</div>
        <h3 className="text-xl font-bold text-secondary-900 mb-2">{service.title}</h3>
        <p className="text-secondary-600 mb-4">{service.description}</p>
        <button
          onClick={() => navigate(`/diensten/${service.id}`)}
          className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Lees meer
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <section id="services" className="py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;