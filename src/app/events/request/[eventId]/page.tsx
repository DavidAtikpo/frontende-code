'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';
import Cookies from 'js-cookie';

const {BASE_URL} = API_CONFIG

interface EventRequest {
  name: string;
  email: string;
  phone: string;
  guestCount: number;
  requestedDate: string;
  budget: number;
  preferences: string;
  specialRequests: string;
}

export default function EventRequestPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<EventRequest>({
    name: '',
    email: '',
    phone: '',
    guestCount: 0,
    requestedDate: '',
    budget: 0,
    preferences: '',
    specialRequests: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push(`/login?redirect=/events/request/${params.eventId}`);
        return;
      }

      // Vérifier si le token est valide en décodant son payload
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = Date.now() >= payload.exp * 1000;
        
        if (isExpired) {
          Cookies.remove('token');
          router.push(`/login?redirect=/events/request/${params.eventId}`);
          return;
        }

        // Si l'utilisateur est authentifié, pré-remplir le formulaire avec ses informations
        setFormData(prev => ({
          ...prev,
          name: payload.name || '',
          email: payload.email || ''
        }));
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        router.push(`/login?redirect=/events/request/${params.eventId}`);
      }
    };

    checkAuth();
  }, [params.eventId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Veuillez vous connecter pour envoyer une demande');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/events/request/${params.eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la demande');
      }

      router.push('/events/request-success');
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de l\'envoi de votre demande');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Retour
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Demande d'Organisation</h1>
          
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Informations Importantes</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Notre équipe vous contactera dans les 24-48h après votre demande</li>
              <li>Un premier rendez-vous gratuit sera organisé pour discuter de vos souhaits</li>
              <li>Le budget final sera établi en fonction de vos préférences et besoins spécifiques</li>
              <li>Nous nous occupons de tous les aspects de votre mariage</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">Nombre d'invités</label>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  min="1"
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="requestedDate" className="block text-sm font-medium text-gray-700">Date souhaitée</label>
                <input
                  type="date"
                  id="requestedDate"
                  name="requestedDate"
                  value={formData.requestedDate}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (FCFA)</label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="0"
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">Préférences</label>
              <textarea
                id="preferences"
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez vos préférences pour l'événement (thème, couleurs, style, etc.)"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">Demandes spéciales</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                placeholder="Ajoutez toute demande spéciale ou information supplémentaire"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Envoyer la demande
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
} 