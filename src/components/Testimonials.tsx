import React from 'react';
import { Star } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const testimonials = [
  {
    name: "Jan de Boer",
    role: "Melkveehouder",
    content: "Al jaren een betrouwbare partner voor ons agrarisch bedrijf. Ze schakelen snel, denken mee en leveren altijd kwaliteit. Het team van Lolkema is professioneel en werkt met moderne machines, waardoor het werk efficiënt en netjes wordt uitgevoerd",
    rating: 5
  },
  {
    name: "Klaas Jansen",
    role: "Akkerbouwer",
    content: "Wij hebben Loonbedrijf Lolkema ingeschakeld voor grondwerkzaamheden en zijn zeer tevreden. Ze kwamen op tijd, werkten netjes en het contact verliep soepel. Echt een aanrader voor iedereen die op zoek is naar een betrouwbaar loonbedrijf.",
    rating: 5
  },
  {
    name: "Petra Visser",
    role: "Melkveehouder",
    content: "Een fijn loonbedrijf met ervaren mensen. Ze hebben ons perfect geholpen bij het maaien en transport van gras. Goede communicatie en altijd bereid om mee te denken. Wij blijven zeker klant!",
    rating: 4
  }
];

const Testimonials = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl">
            Wat Onze Klanten Zeggen
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-secondary-500">
            De tevredenheid van onze klanten staat centraal in alles wat we doen.
          </p>
        </div>

        <div 
          ref={ref as React.RefObject<HTMLDivElement>}
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-secondary-50 rounded-lg shadow-md p-8 hover:shadow-lg transition-all duration-700 transform ${
                isInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-secondary-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-secondary-600 italic mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-800 font-bold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-900">{testimonial.name}</p>
                  <p className="text-sm text-secondary-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;