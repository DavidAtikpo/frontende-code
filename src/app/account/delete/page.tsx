"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaExclamationTriangle } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

const DeleteAccountPage = () => {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${BASE_URL}/api/users/delete-request`,
        {
          reason,
          password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Votre demande de suppression a été envoyée');
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!isConfirming) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3" />
            <p className="text-red-700">
              Attention : La suppression de votre compte est irréversible
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Suppression du compte</h1>
          
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold">Conséquences de la suppression :</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Toutes vos données personnelles seront supprimées</li>
              <li>Vos restaurants et leurs données seront supprimés</li>
              <li>Vos événements et leurs données seront supprimés</li>
              <li>Votre historique de commandes sera anonymisé</li>
              <li>Cette action est irréversible</li>
            </ul>
          </div>

          <button
            onClick={() => setIsConfirming(true)}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Je comprends, continuer la suppression
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Confirmation de suppression</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">
              Raison de la suppression <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              rows={4}
              required
              placeholder="Veuillez nous indiquer la raison de votre départ..."
            />
          </div>

          <div>
            <label className="block mb-2">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              required
              placeholder="Confirmez votre mot de passe"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Traitement...' : 'Supprimer mon compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountPage; 