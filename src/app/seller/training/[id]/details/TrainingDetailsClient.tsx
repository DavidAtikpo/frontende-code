"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Params {
  id: string;
}

interface TrainingDetailsProps {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
}

interface Training {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  startDate: string;
  maxParticipants: number;
  participantsCount: number;
  location: string;
  category: string;
  level: string;
  prerequisites: string;
  objectives: string;
  image: string;
  syllabus: string;
  instructor: string;
}

const TrainingDetailsClient = ({ params, searchParams }: TrainingDetailsProps) => {
  const router = useRouter();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) {
      console.error('No ID provided');
      toast.error('ID de formation manquant');
      router.push('/seller/training');
      return;
    }
    fetchTrainingDetails();
  }, [params?.id]);

  const fetchTrainingDetails = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/training/${params.id}`);
      setTraining(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      toast.error('Erreur lors de la récupération des détails de la formation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/training/${params.id}`);
      toast.success('Formation supprimée avec succès');
      router.push('/seller/training');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la formation');
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{training.title}</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push(`/seller/training/${params.id}/edit`)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaEdit className="mr-2" />
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <FaTrash className="mr-2" />
            Supprimer
          </button>
          <button
            onClick={() => router.push(`/seller/training/${params.id}/participants`)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaUsers className="mr-2" />
            Participants
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <img
              src={training.image || '/default-training.jpg'}
              alt={training.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Informations générales</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Prix</p>
                  <p className="font-medium">{training.price} CFA</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="font-medium">{training.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de début</p>
                  <p className="font-medium">
                    {format(new Date(training.startDate), 'PPP', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Participants</p>
                  <p className="font-medium">
                    {training.participantsCount}/{training.maxParticipants}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Catégorie</p>
                  <p className="font-medium">{training.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Niveau</p>
                  <p className="font-medium">{training.level}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{training.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Prérequis</h3>
            <p className="text-gray-600 whitespace-pre-line">{training.prerequisites}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Objectifs</h3>
            <p className="text-gray-600 whitespace-pre-line">{training.objectives}</p>
          </div>

          {training.syllabus && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Programme détaillé</h3>
              <a
                href={training.syllabus}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Télécharger le PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDetailsClient; 