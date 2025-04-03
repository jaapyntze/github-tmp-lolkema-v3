import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, User, Building2, Phone, Mail, Plus, Search, X, Filter, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

interface CustomerFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
}

interface Customer {
  id: string;
  user_id: string;
  company_name: string;
  contact_person: string;
  phone: string | null;
  created_at: string;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('company_name', { ascending: true });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Er is een fout opgetreden bij het ophalen van de klanten');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedCustomer) {
        // Update existing customer
        const { error: updateError } = await supabase
          .from('clients')
          .update({
            company_name: formData.company,
            contact_person: formData.name,
            phone: formData.phone || null,
          })
          .eq('id', selectedCustomer.id);

        if (updateError) throw updateError;
        toast.success('Klantgegevens bijgewerkt');
      } else {
        // Create new customer
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          email_confirm: true,
          password: Math.random().toString(36).slice(-8), // Generate random password
        });

        if (authError) throw authError;

        const { error: clientError } = await supabase
          .from('clients')
          .insert([
            {
              user_id: authData.user.id,
              company_name: formData.company,
              contact_person: formData.name,
              phone: formData.phone || null,
            }
          ]);

        if (clientError) throw clientError;
        toast.success('Klant succesvol toegevoegd');
      }

      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
      });
      setSelectedCustomer(null);
      setShowForm(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error managing customer:', error);
      toast.error(selectedCustomer 
        ? 'Er is een fout opgetreden bij het bijwerken van de klant'
        : 'Er is een fout opgetreden bij het toevoegen van de klant'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.contact_person,
      email: '', // We don't show/edit email for existing customers
      company: customer.company_name,
      phone: customer.phone || '',
    });
    setShowForm(true);
  };

  const filteredCustomers = customers.filter(customer => {
    const searchString = searchTerm.toLowerCase();
    return (
      customer.company_name.toLowerCase().includes(searchString) ||
      customer.contact_person.toLowerCase().includes(searchString) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchString))
    );
  });

  if (loading && customers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Klanten</h2>
            <p className="mt-1 text-sm text-secondary-500">
              Beheer klanten in het portaal
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCustomer(null);
              setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
              });
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nieuwe Klant
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-secondary-900">
                {selectedCustomer ? 'Klant Bewerken' : 'Nieuwe Klant Toevoegen'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedCustomer(null);
                }}
                className="text-secondary-500 hover:text-secondary-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
                  Naam contactpersoon *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {!selectedCustomer && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                    E-mailadres *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-secondary-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required={!selectedCustomer}
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-secondary-700">
                  Bedrijfsnaam *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Bedrijf BV"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700">
                  Telefoonnummer
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="+31 6 12345678"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedCustomer(null);
                  }}
                  className="px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      {selectedCustomer ? 'Bijwerken...' : 'Toevoegen...'}
                    </>
                  ) : (
                    selectedCustomer ? 'Klant Bijwerken' : 'Klant Toevoegen'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Zoek klanten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Customers List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Bedrijf
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Contactpersoon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Telefoonnummer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Toegevoegd op
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Acties
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      className="hover:bg-secondary-50 cursor-pointer"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {customer.company_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-500">
                          {customer.contact_person}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-500">
                          {customer.phone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        {new Date(customer.created_at).toLocaleDateString('nl-NL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCustomer(customer);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-secondary-500">
                  {searchTerm
                    ? 'Geen klanten gevonden die aan uw zoekcriteria voldoen.'
                    : 'Er zijn nog geen klanten toegevoegd.'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerManagement;