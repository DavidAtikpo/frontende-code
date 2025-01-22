"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

interface Participant {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  paymentStatus: string;
  paymentDate: string | null;
  createdAt: string;
}

interface Training {
  id: string;
  title: string;
  participantsCount: number;
  maxParticipants: number;
}

interface ParticipantsProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const ParticipantsClient = ({ params, searchParams }: ParticipantsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState<Training | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    console.log('Participants client params:', params);
    if (!params?.id) {
      console.error('No training ID provided');
      toast.error('ID de formation manquant');
      router.push('/seller/training');
      return;
    }
    fetchData();
  }, [params?.id]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchData = async () => {
    if (!params?.id) return;
    
    const config = getAuthHeaders();
    if (!config) return;
    
    try {
      console.log('Fetching training and participants data for ID:', params.id);
      
      // Récupérer les détails de la formation
      const trainingResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/training/details/${params.id}`,
        config
      );
      
      if (!trainingResponse.data.success) {
        toast.error('Formation non trouvée');
        router.push('/seller/training');
        return;
      }
      
      setTraining(trainingResponse.data.data);

      // Récupérer la liste des participants
      const participantsResponse = await axios.get(
        `${BASE_URL}/api/training/${params.id}/participants`,
        config
      );
      
      if (participantsResponse.data.success) {
        setParticipants(participantsResponse.data.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      toast.error('Erreur lors de la récupération des données');
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateParticipantStatus = async (participantId: string, newStatus: string) => {
    const config = getAuthHeaders();
    if (!config) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/api/training/participant/${participantId}/status`,
        { status: newStatus },
        config
      );
      
      if (response.data.success) {
        toast.success('Statut mis à jour avec succès');
        fetchData(); // Rafraîchir les données
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const updatePaymentStatus = async (participantId: string, newStatus: string) => {
    const config = getAuthHeaders();
    if (!config) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/api/training/participant/${participantId}/payment`,
        { paymentStatus: newStatus },
        config
      );
      
      if (response.data.success) {
        toast.success('Statut de paiement mis à jour avec succès');
        fetchData(); // Rafraîchir les données
      } else {
        toast.error('Erreur lors de la mise à jour du statut de paiement');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de paiement:', error);
      toast.error('Erreur lors de la mise à jour du statut de paiement');
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Formation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Retour
          </button>
          <h1 className="text-2xl font-bold">Participants - {training.title}</h1>
        </div>
        <div className="text-sm text-gray-600">
          {participants.length} / {training.maxParticipants} participants
        </div>
      </div>

      {participants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          Aucun participant inscrit pour le moment
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom complet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {participants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {participant.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{participant.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{participant.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(participant.createdAt), 'dd MMMM yyyy', { locale: fr })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(participant.status)}`}>
                      {participant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(participant.paymentStatus)}`}>
                      {participant.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateParticipantStatus(participant.id, 'confirmed')}
                        className="text-green-600 hover:text-green-900"
                        title="Confirmer"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => updateParticipantStatus(participant.id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                        title="Annuler"
                      >
                        <FaTimes />
                      </button>
                      <button
                        onClick={() => updatePaymentStatus(participant.id, 'paid')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Marquer comme payé"
                      >
                        <FaSpinner />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ParticipantsClient; 