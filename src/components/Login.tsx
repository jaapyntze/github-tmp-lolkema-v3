import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Mail, CheckCircle, ArrowLeft } from 'lucide-react';

interface LoginProps {
  redirectPath?: string;
}

const Login: React.FC<LoginProps> = ({ redirectPath = '/blog/editor' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [view, setView] = useState<'sign_in' | 'forgotten_password'>('sign_in');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        navigate(redirectPath);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [user, navigate, redirectPath]);

  // Update Supabase session configuration when rememberMe changes
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (!rememberMe) {
          // Set session expiry to 1 day if "Remember me" is not checked
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 1);
          supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: Math.floor(expiryDate.getTime() / 1000)
          });
        }
      }
    });
  }, [rememberMe]);

  return (
    <>
      <div className={`min-h-screen flex ${mounted ? 'fade-enter' : 'opacity-0'}`}>
        {/* Left side - Background image and benefits */}
        <div className="hidden lg:flex lg:w-[60%] relative">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
              alt="Agricultural landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
          </div>
          <div className="relative w-full flex items-center justify-center p-12">
            <div className="max-w-lg">
              <img src="/images/logo.png" alt="Lolkema Logo" className="h-12 w-auto mb-8" />
              <h2 className="text-3xl font-bold text-white mb-8">
                Voordelen van een klantportaal account
              </h2>
              <div className="space-y-6">
                {[
                  'Direct inzicht in uw facturen en betalingen',
                  'Overzicht van geplande en uitgevoerde werkzaamheden',
                  'Beheer uw bedrijfsgegevens op één plek',
                  '24/7 toegang tot uw documenten en historie',
                  'Eenvoudig communiceren met ons team',
                  'Realtime updates over uw opdrachten'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-white text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="lg:hidden flex justify-center mb-6">
              <img src="/images/logo-blackblue.png" alt="Lolkema Logo" className="h-12 w-auto" />
            </div>
            {view === 'forgotten_password' && (
              <button
                onClick={() => setView('sign_in')}
                className="flex items-center text-sm text-gray-600 hover:text-green-600 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Terug naar inloggen
              </button>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center">
              {view === 'sign_in' ? 'Welkom bij het Klantportaal' : 'Wachtwoord herstellen'}
            </h2>
            <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
              {view === 'sign_in' 
                ? 'Log in om toegang te krijgen tot uw persoonlijke omgeving'
                : 'Vul uw e-mailadres in om een herstel-link te ontvangen'
              }
            </p>
          </div>

          <div className="mt-8 sm:mx-auto w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 sm:px-10 shadow-lg sm:rounded-lg border border-gray-100">
              <Auth
                supabaseClient={supabase}
                view={view}
                appearance={{
                  theme: ThemeSupa,
                  style: {
                    button: {
                      background: '#16a34a',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'white',
                      '&:hover': {
                        background: '#15803d',
                      },
                    },
                    input: {
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      borderColor: '#e5e7eb',
                      '&:focus': {
                        borderColor: '#16a34a',
                        boxShadow: '0 0 0 1px #16a34a',
                      },
                    },
                    label: {
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '0.5rem',
                    },
                    anchor: {
                      color: '#16a34a',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: '#15803d',
                      },
                    },
                    message: {
                      display: 'none',
                    },
                  },
                  className: {
                    container: 'space-y-4',
                    label: 'font-medium',
                    button: 'w-full flex justify-center',
                    input: 'w-full',
                  },
                }}
                providers={[]}
                magicLink={false}
                showLinks={false}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'E-mailadres',
                      password_label: 'Wachtwoord',
                      button_label: 'Inloggen',
                      email_input_placeholder: 'Uw e-mailadres',
                      password_input_placeholder: 'Uw wachtwoord',
                      loading_button_label: 'Bezig met inloggen...',
                    },
                    forgotten_password: {
                      email_label: 'E-mailadres',
                      button_label: 'Stuur herstel-link',
                      loading_button_label: 'Link wordt verstuurd...',
                      confirmation_text: 'Controleer uw e-mail voor de herstel-link',
                    },
                  },
                }}
              />

              {view === 'sign_in' && (
                <>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Onthoud mij
                      </label>
                    </div>
                    <button
                      onClick={() => setView('forgotten_password')}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      Wachtwoord vergeten?
                    </button>
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                    >
                      Nog geen account? Vraag er hier een aan
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account aanvragen
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Neem contact op met onze klantenservice om een account aan te vragen voor het klantportaal. 
              Wij zorgen ervoor dat u zo snel mogelijk toegang krijgt.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <a 
                href="mailto:info@loonbedrijflolkema.nl"
                className="text-sm text-green-600 hover:text-green-700"
              >
                info@loonbedrijflolkema.nl
              </a>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;