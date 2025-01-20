"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ParticipantsClientProps {
  params: {
    id: string;
  };
}

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Training {
  id: string;
  title: string;
  maxParticipants: number;
  participantsCount: number;
}

const ParticipantsClient = ({ params }: ParticipantsClientProps) => {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipants();
    fetchTrainingDetails();
  }, [params.id]);

  const fetchTrainingDetails = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/training/${params.id}`);
      setTraining(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la formation:', error);
      toast.error('Erreur lors de la récupération des détails de la formation');
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/training/${params.id}/participants`);
      setParticipants(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des participants:', error);
      toast.error('Erreur lors de la récupération des participants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (participantId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/training/${params.id}/participants/${participantId}`, {
        status: newStatus
      });
      
      toast.success(`Inscription ${newStatus === 'approved' ? 'approuvée' : 'refusée'} avec succès`);
      fetchParticipants(); // Refresh the list
      fetchTrainingDetails(); // Update training details (participant count)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Refusé';
      default:
        return 'En attente';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Retour
          </button>
          <h1 className="text-2xl font-bold">
            Participants - {training?.title}
          </h1>
        </div>
        <div className="text-sm text-gray-600">
          {training?.participantsCount}/{training?.maxParticipants} participants
        </div>
      </div>

      {participants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
          Aucun participant inscrit pour le moment
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom complet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((participant) => (
                <tr key={participant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {participant.fullName}
                    </div>
                    <div className="text-sm text-gray-500">{participant.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{participant.email}</div>
                    <div className="text-sm text-gray-500">{participant.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(participant.createdAt), 'PPP', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(participant.status)}`}>
                      {getStatusText(participant.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {participant.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(participant.id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                          title="Approuver"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleStatusChange(participant.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          title="Refuser"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}
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