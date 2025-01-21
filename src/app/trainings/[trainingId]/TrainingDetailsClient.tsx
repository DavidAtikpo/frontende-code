"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { FaCalendar, FaUsers, FaMapMarkerAlt, FaClock, FaGraduationCap } from 'react-icons/fa';

const DEFAULT_IMAGE = '/default-training.jpg';

// Fonction pour gérer les URLs des images
const getImageUrl = (path: string) => {
  if (!path) return DEFAULT_IMAGE;
  return path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
};

interface TrainingDetails {
  _id: string;
  id?: string;  // Pour la compatibilité avec l'API
  title: string;
  description: string;
  startDate: string;
  duration: string;
  location: string;
  maxParticipants: number;
  enrolledCount: number;
  price: number;
  image: string;
  category: string;
  level: string;
  instructor?: string;
}

interface TrainingDetailsClientProps {
  trainingId: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

const TrainingDetailsClient = ({ trainingId, searchParams }: TrainingDetailsClientProps) => {
  const router = useRouter();
  const [training, setTraining] = useState<TrainingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        console.log('Fetching training with ID:', trainingId);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/training/${trainingId}`);
        console.log('Training response:', response.data);
        if (response.data.success) {
          const trainingData = response.data.data;
          // S'assurer que nous avons un _id
          setTraining({
            ...trainingData,
            _id: trainingData._id || trainingData.id
          });
        } else {
          toast.error('Formation non trouvée');
          router.push('/trainings');
        }
      } catch (error) {
        console.error('Error fetching training:', error);
        toast.error('Erreur lors du chargement de la formation');
        router.push('/trainings');
      } finally {
        setLoading(false);
      }
    };

    if (trainingId) {
      fetchTraining();
    } else {
      toast.error('ID de formation invalide');
      router.push('/trainings');
    }
  }, [trainingId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!training) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <span className="mr-2">←</span> Retour aux formations
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 md:h-96">
          <Image
            src={getImageUrl(training.image) || '/default-training.jpg'}
            alt={training.title}
            width={1200}
            height={800}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{training.title}</h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  training.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  training.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {training.level}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {training.category}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {training.price.toLocaleString()} CFA
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <FaCalendar className="w-5 h-5 mr-3" />
                <span>Début: {new Date(training.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaClock className="w-5 h-5 mr-3" />
                <span>Durée: {training.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="w-5 h-5 mr-3" />
                <span>{training.location}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <FaUsers className="w-5 h-5 mr-3" />
                <span>Places: {training.enrolledCount}/{training.maxParticipants}</span>
              </div>
              {training.instructor && (
                <div className="flex items-center text-gray-600">
                  <FaGraduationCap className="w-5 h-5 mr-3" />
                  <span>Formateur: {training.instructor}</span>
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{training.description}</p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                router.push(`/trainings/register?trainingId=${training._id}&title=${encodeURIComponent(training.title)}`);
              }}
              disabled={enrolling || training.enrolledCount >= training.maxParticipants}
              className={`px-8 py-3 rounded-lg text-white font-medium ${
                enrolling || training.enrolledCount >= training.maxParticipants
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {enrolling ? 'Inscription en cours...' :
               training.enrolledCount >= training.maxParticipants ? 'Complet' :
               "S'inscrire à la formation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetailsClient; 