import React from 'react';
import { Tractor, Shovel, Sprout, Ruler, Truck, Wheat } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const services = [
  {
    title: 'Agrarisch Loonwerk',
    description: 'Wij bieden ondersteuning bij agrarisch loonwerk, gericht op het behalen van optimaal rendement uit uw middelen. Dit doen we met een geavanceerd machinepark en gespecialiseerde, gediplomeerde medewerkers.',
    icon: <Tractor className="h-10 w-10 text-green-600" />
  },
  {
    title: 'Grondverzet & Infra',
    description: 'Betrouwbare partner voor baggerwerk, bouwputontgraving, grondafzet en tuinaanleg. Wij zetten onze expertise in voor succesvolle projecten.',
    icon: <Shovel className="h-10 w-10 text-green-600" />
  },
  {
    title: 'Cultuurtechnisch werk',
    description: 'Allround aannemer in Grond-, Weg- en Waterbouw sinds 1964, gespecialiseerd in aanleg, onderhoud en herstel van infrastructuur.',
    icon: <Sprout className="h-10 w-10 text-green-600" />
  },
  {
    title: 'Civiele techniek',
    description: 'Kwaliteit gegarandeerd in civiele techniek en natuurbouw, met NEN-EN-ISO 9001:2000- en VCA**-certificering. Ervaren en gediplomeerde medewerkers zorgen voor vakmanschap in elke opdracht.',
    icon: <Wheat className="h-10 w-10 text-green-600" />
  },
  {
    title: 'Transport',
    description: 'Betrouwbaar transport met diepladers, kieptrailers en andere opties voor zware ladingen en bulkmaterialen.',
    icon: <Truck className="h-10 w-10 text-green-600" />
  },
  {
    title: 'Verhuur',
    description: 'Uitgebreide verhuurservice voor diverse machines en voertuigen om aan uw specifieke behoeften te voldoen.',
    icon: <Ruler className="h-10 w-10 text-green-600" />
  }
];

const Services = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Onze Diensten
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Wij bieden een compleet pakket aan agrarische diensten met moderne machines en ervaren personeel.
          </p>
        </div>

        <div 
          ref={ref as React.RefObject<HTMLDivElement>}
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-700 transform ${
                isInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;