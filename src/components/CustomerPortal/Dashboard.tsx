import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, type Client } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import CompanyDetails from './CompanyDetails';
import InvoiceList from './InvoiceList';
import OperationsList from './OperationsList';
import { Loader2, Building2, LogOut, Menu } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('company');
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [currentContent, setCurrentContent] = useState<'company' | 'invoices' | 'operations'>('company');
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set mounted after initial render to ensure proper animation
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchClientData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (!data || data.length === 0) {
          setClient(null);
        } else {
          setClient(data[0]);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        setError('Er is een fout opgetreden bij het ophalen van de gegevens.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [user]);

  const handleTabChange = (tab: 'company' | 'invoices' | 'operations') => {
    if (tab === activeTab) return;
    
    setIsTabChanging(true);
    setMobileMenuOpen(false);
    setTimeout(() => {
      setActiveTab(tab);
      setCurrentContent(tab);
      setIsTabChanging(false);
    }, 300);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 pt-20 sm:pt-32 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className={`min-h-[calc(100vh-80px)] bg-gray-50 pt-20 sm:pt-32 pb-12 ${mounted ? 'fade-enter' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">Geen bedrijfsgegevens gevonden</h2>
            <p className="mt-2 text-sm text-gray-500">
              Er zijn nog geen bedrijfsgegevens voor uw account geregistreerd.
              Neem contact op met onze klantenservice voor assistentie.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-[calc(100vh-80px)] bg-gray-50 pt-20 sm:pt-32 pb-12 ${mounted ? 'fade-enter' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-80px)] bg-gray-50 pt-20 sm:pt-32 pb-12 ${mounted ? 'fade-enter' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Mobile Menu Button */}
          <div className="sm:hidden border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src="/images/logo-black.png" alt="Lolkema Logo" className="h-8 w-auto mr-3" />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                >
                  <Menu className="h-6 w-6" />
                  <span className="ml-2">{
                    activeTab === 'company' ? 'Bedrijfsgegevens' :
                    activeTab === 'invoices' ? 'Facturen' :
                    'Werkzaamheden'
                  }</span>
                </button>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Uitloggen
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`sm:hidden border-b border-gray-200 transition-all duration-300 ${mobileMenuOpen ? 'max-h-48' : 'max-h-0'} overflow-hidden`}>
            <div className="py-2">
              {['company', 'invoices', 'operations'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab as 'company' | 'invoices' | 'operations')}
                  className={`w-full px-4 py-2 text-left text-sm font-medium ${
                    activeTab === tab
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab === 'company' ? 'Bedrijfsgegevens' :
                   tab === 'invoices' ? 'Facturen' :
                   'Werkzaamheden'}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:block border-b border-gray-200">
            <div className="flex justify-between items-center px-6">
              <div className="flex items-center">
                <img src="/images/logo-black.png" alt="Lolkema Logo" className="h-10 w-auto mr-6" />
                <nav className="-mb-px flex">
                  <button
                    onClick={() => handleTabChange('company')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-300 ${
                      activeTab === 'company'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Bedrijfsgegevens
                  </button>
                  <button
                    onClick={() => handleTabChange('invoices')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-300 ${
                      activeTab === 'invoices'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Facturen
                  </button>
                  <button
                    onClick={() => handleTabChange('operations')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-300 ${
                      activeTab === 'operations'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Werkzaamheden
                  </button>
                </nav>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Uitloggen
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className={`transition-opacity duration-300 ${isTabChanging ? 'opacity-0' : 'opacity-100'}`}>
              {currentContent === 'company' && <CompanyDetails client={client} setClient={setClient} />}
              {currentContent === 'invoices' && <InvoiceList clientId={client?.id} />}
              {currentContent === 'operations' && <OperationsList clientId={client?.id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;