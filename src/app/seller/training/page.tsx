"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaEye, FaUsers } from 'react-icons/fa';
// import { getCookie } from 'cookies-next';

interface Training {
  id: string;
  title: string;
  price: number;
  startDate: string;
  duration: string;
  maxParticipants: number;
  participantsCount: number;
  status: string;
}

const TrainingList = () => {
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainings();
  }, []);

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

  const fetchTrainings = async () => {
    const config = getAuthHeaders();
    if (!config) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/training/seller/my-published`,
        config
      );
      setTrainings(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des formations');
      console.error('Erreur:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const config = getAuthHeaders();
    if (!config) return;

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/training/${id}`,
          config
        );
        toast.success('Formation supprimée avec succès');
        fetchTrainings();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Erreur:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push('/login');
        }
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Formations</h1>
        <button
          onClick={() => router.push('/seller/training/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <FaPlus /> Nouvelle Formation
        </button>
      </div>

      {trainings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          Vous n'avez pas encore créé de formation
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trainings.map((training) => (
                <tr key={training.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{training.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{training.price} CFA</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(training.startDate).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{training.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {training.participantsCount}/{training.maxParticipants}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(training.status)}`}>
                      {training.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => router.push(`/seller/training/${training.id}/details`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir détails"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => router.push(`/seller/training/${training.id}/details`)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => router.push(`/seller/training/${training.id}/participants`)}
                        className="text-green-600 hover:text-green-900"
                        title="Voir participants"
                      >
                        <FaUsers />
                      </button>
                      <button
                        onClick={() => handleDelete(training.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <FaTrash />
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

export default TrainingList; 