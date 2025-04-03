import React, { useState } from 'react';
import { supabase, type Client } from '../../lib/supabase';
import { Building2, User, Phone, MapPin, Save, Loader2 } from 'lucide-react';

interface CompanyDetailsProps {
  client: Client | null;
  setClient: (client: Client) => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ client, setClient }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(client || {
    company_name: '',
    contact_person: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('clients')
        .update({
          company_name: formData.company_name,
          contact_person: formData.contact_person,
          phone: formData.phone,
          address: formData.address,
        })
        .eq('id', client?.id)
        .select()
        .single();

      if (error) throw error;
      setClient(data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating client:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Bedrijfsgegevens</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700">Bedrijfsnaam</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              disabled={!editing}
              className={`block w-full pl-10 py-2 sm:text-sm rounded-md ${
                editing
                  ? 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                  : 'bg-secondary-50 border-secondary-200'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700">Contactpersoon</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              disabled={!editing}
              className={`block w-full pl-10 py-2 sm:text-sm rounded-md ${
                editing
                  ? 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                  : 'bg-secondary-50 border-secondary-200'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700">Telefoonnummer</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
              className={`block w-full pl-10 py-2 sm:text-sm rounded-md ${
                editing
                  ? 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                  : 'bg-secondary-50 border-secondary-200'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700">Adres</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!editing}
              className={`block w-full pl-10 py-2 sm:text-sm rounded-md ${
                editing
                  ? 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500'
                  : 'bg-secondary-50 border-secondary-200'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end">
          {editing ? (
            <div className="space-x-3">
              <button
                type="button"
                onClick={() => {
                  setFormData(client || {
                    company_name: '',
                    contact_person: '',
                    phone: '',
                    address: '',
                  });
                  setEditing(false);
                }}
                className="px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Opslaan
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50"
            >
              Bewerken
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompanyDetails;