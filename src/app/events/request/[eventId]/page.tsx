'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

interface Props {
  params: {
    eventId: string;
  };
}

export default function EventRequestPage({ params }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guestCount: '',
    budget: '',
    specialRequests: '',
    preferences: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/events/request/${params.eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        router.push('/events/request-success');
      } else {
        setError('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi de la demande');
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Demande d'Organisation de Mariage</h1>
          
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée du mariage</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'invités estimé</label>
              <input
                type="number"
                required
                value={formData.guestCount}
                onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget approximatif (CFA)</label>
              <input
                type="number"
                required
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Préférences de style</label>
              <textarea
                value={formData.preferences}
                onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Décrivez le style de mariage que vous souhaitez (traditionnel, moderne, mixte...)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Demandes spéciales</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Avez-vous des demandes ou besoins particuliers ?"
              />
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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