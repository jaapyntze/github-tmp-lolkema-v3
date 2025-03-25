import React, { useEffect, useState } from 'react';
import { supabase, type PrecisionOperation } from '../../lib/supabase';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { MapPin, Calendar, PenTool, Ruler, ClipboardList, Loader2, Tractor } from 'lucide-react';

interface OperationsListProps {
  clientId?: string;
}

const OperationsList: React.FC<OperationsListProps> = ({ clientId }) => {
  const [operations, setOperations] = useState<PrecisionOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOperation, setSelectedOperation] = useState<PrecisionOperation | null>(null);

  useEffect(() => {
    const fetchOperations = async () => {
      if (!clientId) return;

      try {
        const { data, error } = await supabase
          .from('precision_operations')
          .select('*')
          .eq('client_id', clientId)
          .order('start_date', { ascending: false });

        if (error) throw error;
        setOperations(data || []);
      } catch (error) {
        console.error('Error fetching operations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperations();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (operations.length === 0) {
    return (
      <div className="text-center py-12">
        <PenTool className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Geen werkzaamheden</h3>
        <p className="mt-1 text-sm text-gray-500">
          Er zijn nog geen werkzaamheden geregistreerd.
        </p>
      </div>
    );
  }

  const now = new Date();
  const plannedOperations = operations.filter(op => new Date(op.start_date) > now);
  const completedOperations = operations.filter(op => new Date(op.start_date) <= now);

  const OperationCard = ({ operation }: { operation: PrecisionOperation }) => (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedOperation(operation)}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{operation.operation_type}</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <span className="text-gray-600">{operation.location}</span>
          </div>
          
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div className="text-gray-600">
              {format(new Date(operation.start_date), 'd MMMM yyyy', { locale: nl })}
            </div>
          </div>

          <div className="flex items-start">
            <Tractor className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div className="text-gray-600">
              <span className="text-gray-600">Gebruikte machines:</span>
              <ul className="mt-1 list-disc list-inside text-sm">
                {operation.equipment_used.map((equipment, index) => (
                  <li key={index}>{equipment}</li>
                ))}
              </ul>
            </div>
          </div>

          {operation.area_covered && (
            <div className="flex items-start">
              <Ruler className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <span className="text-gray-600">
                Oppervlakte: {operation.area_covered} ha
              </span>
            </div>
          )}

          {operation.notes && (
            <div className="flex items-start">
              <PenTool className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <span className="text-gray-600">{operation.notes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Werkzaamheden</h2>

      {/* Planned Operations */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Geplande werkzaamheden</h3>
        {plannedOperations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plannedOperations.map((operation) => (
              <OperationCard key={operation.id} operation={operation} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Geen geplande werkzaamheden</p>
        )}
      </div>

      {/* Completed Operations */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Uitgevoerde werkzaamheden</h3>
        {completedOperations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedOperations.map((operation) => (
              <OperationCard key={operation.id} operation={operation} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Geen uitgevoerde werkzaamheden</p>
        )}
      </div>

      {/* Operation Details Modal */}
      {selectedOperation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedOperation.operation_type}
              </h3>

              <div className="space-y-6">
                {/* Operation details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900">Locatie</h4>
                    <p className="text-gray-600">{selectedOperation.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Datum</h4>
                    <p className="text-gray-600">
                      {format(new Date(selectedOperation.start_date), 'd MMMM yyyy', { locale: nl })}
                    </p>
                  </div>
                </div>

                {/* Equipment used */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Gebruikte machines</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedOperation.equipment_used.map((equipment, index) => (
                      <li key={index}>{equipment}</li>
                    ))}
                  </ul>
                </div>

                {/* Area covered */}
                {selectedOperation.area_covered && (
                  <div>
                    <h4 className="font-medium text-gray-900">Oppervlakte</h4>
                    <p className="text-gray-600">{selectedOperation.area_covered} ha</p>
                  </div>
                )}

                {/* Notes */}
                {selectedOperation.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900">Notities</h4>
                    <p className="text-gray-600">{selectedOperation.notes}</p>
                  </div>
                )}

                {/* Metrics */}
                {selectedOperation.metrics && Object.keys(selectedOperation.metrics).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Meetgegevens</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <dl className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedOperation.metrics).map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-sm font-medium text-gray-500">{key}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedOperation(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Sluiten
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationsList;