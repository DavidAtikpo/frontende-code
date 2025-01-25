'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';
import Cookies from 'js-cookie';

const { BASE_URL } = API_CONFIG;

interface EventRequest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  requestedDate: string;
  guestCount: number;
  budget: number;
  preferences: string;
  specialRequests: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  event: {
    title: string;
    description: string;
  };
}

export default function RequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login?redirect=/dashboard/requests');
          return;
        }

        const response = await fetch(`${BASE_URL}/api/events/requests/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des demandes');
        }

        const data = await response.json();
        setRequests(data.data);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Une erreur est survenue lors du chargement de vos demandes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500 text-xl" />;
      case 'approved':
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500 text-xl" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Refusée';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes demandes d'organisation</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">Vous n'avez pas encore fait de demande d'organisation.</p>
            <button
              onClick={() => router.push('/events')}
              className="mt-4 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Voir les événements
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {request.event.title}
                    </h2>
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span className="ml-2 text-sm font-medium text-gray-600">
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <p><span className="font-medium">Date souhaitée:</span> {new Date(request.requestedDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Invités:</span> {request.guestCount} personnes</p>
                    <p><span className="font-medium">Budget:</span> {request.budget.toLocaleString()} FCFA</p>
                    <p><span className="font-medium">Demande faite le:</span> {new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>

                  {request.status === 'approved' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        Un membre de notre équipe vous contactera prochainement pour organiser le rendez-vous.
                      </p>
                    </div>
                  )}

                  {request.status === 'rejected' && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700">
                        Malheureusement, nous ne pouvons pas donner suite à votre demande. N'hésitez pas à nous contacter pour plus d'informations.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
} 