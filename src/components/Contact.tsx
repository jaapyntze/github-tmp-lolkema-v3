import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
    alert('Bedankt voor uw bericht! We nemen zo spoedig mogelijk contact met u op.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl">
            Neem Contact Op
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-secondary-500">
            Heeft u een vraag of wilt u een afspraak maken? Neem contact met ons op.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-6">Stuur ons een bericht</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
                  Naam
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-3 border"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-3 border"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700">
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-3 border"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-secondary-700">
                  Bericht
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-3 border"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Verstuur
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-6">Contactgegevens</h3>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900">Telefoon</p>
                    <p className="text-sm text-secondary-600">0513 571 207</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-primary-600 mr-3 flex-shrink-0">
                    <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">WhatsApp</p>
                    <a 
                      href="https://api.whatsapp.com/send?phone=%2B31655868746&app=website"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-900 transition-colors"
                    >
                      +31 6 5586 8746
                    </a>
                    <p className="text-xs text-secondary-500 mt-1">
                      Reactie binnen enkele uren tijdens kantooruren
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900">E-mail</p>
                    <a 
                      href="mailto:info@loonbedrijflolkema.nl"
                      className="text-sm text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                      info@loonbedrijflolkema.nl
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900">Adres</p>
                    <p className="text-sm text-secondary-600">
                      Farskewei 3<br />
                      8406 AE Tijnje<br />
                      Nederland
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900">Openingstijden</p>
                    <p className="text-sm text-secondary-600">
                      Maandag - Vrijdag: 7:00 - 18:00<br />
                      Zaterdag: 8:00 - 12:00<br />
                      Zondag: Gesloten
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2860.0901209506915!2d5.965565349945904!3d53.033140556477946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c85984491acf55%3A0x4e66c55d206eb0f0!2sLoonbedrijf%20Lolkema%20Tijnje!5e1!3m2!1snl!2snl!4v1740831245833!5m2!1snl!2snl"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Google Maps"
                    className="rounded-md"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;