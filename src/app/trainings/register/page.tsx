"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
}

export default function TrainingRegisterPage() {
  const router = useRouter();
  const [trainingId, setTrainingId] = useState<string | null>(null);
  const [trainingTitle, setTrainingTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<{
    status: string;
    paymentStatus: string;
  } | null>(null);

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTrainingId(params.get('trainingId'));
    setTrainingTitle(params.get('title'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Veuillez vous connecter pour vous inscrire à une formation');
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/training/${trainingId}/register`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Inscription réussie !');
        router.push('/trainings');
      }
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      if (error.response?.data?.data?.status) {
        setRegistrationStatus({
          status: error.response.data.data.status,
          paymentStatus: error.response.data.data.paymentStatus
        });
        toast.error(`Vous êtes déjà inscrit à cette formation. Statut: ${error.response.data.data.status}, Paiement: ${error.response.data.data.paymentStatus}`);
        setTimeout(() => {
          router.push('/trainings');
        }, 3000);
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  if (registrationStatus) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Statut de votre inscription
              </h1>
              <div className="space-y-4">
                <p className="text-lg">
                  Vous êtes déjà inscrit à cette formation.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Statut de l'inscription :</strong> {registrationStatus.status}</p>
                  <p><strong>Statut du paiement :</strong> {registrationStatus.paymentStatus}</p>
                </div>
                <button
                  onClick={() => router.push('/trainings')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retour aux formations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Inscription à la formation
            </h1>
            {trainingTitle && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                  {decodeURIComponent(trainingTitle)}
                </h2>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Nom complet
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 