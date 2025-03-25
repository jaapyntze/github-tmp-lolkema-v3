import React, { useEffect, useState, useRef } from 'react';
import { supabase, type Invoice } from '../../lib/supabase';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Download, FileText, Loader2 } from 'lucide-react';

interface InvoiceListProps {
  clientId?: string;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ clientId }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScroll, setCanScroll] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!clientId) return;

      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('client_id', clientId)
          .order('issued_date', { ascending: false });

        if (error) throw error;
        setInvoices(data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [clientId]);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScroll(scrollWidth > clientWidth);
      }
    };

    // Check initially
    checkScroll();

    // Check on window resize
    window.addEventListener('resize', checkScroll);

    return () => {
      window.removeEventListener('resize', checkScroll);
    };
  }, [invoices]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Geen facturen</h3>
        <p className="mt-1 text-sm text-gray-500">Er zijn nog geen facturen beschikbaar.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Facturen</h2>

      <div className="relative">
        {/* Shadow overlay */}
        {canScroll && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 pointer-events-none md:hidden" />
        )}
        
        {/* Scroll container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Factuurnummer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Vervaldatum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Bedrag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.issued_date), 'd MMMM yyyy', { locale: nl })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.due_date), 'd MMMM yyyy', { locale: nl })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    € {invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice.status === 'paid'
                        ? 'Betaald'
                        : invoice.status === 'pending'
                        ? 'In behandeling'
                        : 'Openstaand'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {invoice.pdf_url && (
                      <a
                        href={invoice.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-900 inline-flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;