"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPercent, FaCalendarAlt, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  eventId?: string;
  event?: {
    title: string;
  };
  status: 'active' | 'expired' | 'depleted';
}

const EventPromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    startDate: '',
    endDate: '',
    minPurchase: 0,
    maxUses: undefined as number | undefined,
    eventId: undefined as string | undefined
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/promotions`
      );
      if (response.data.success) {
        setPromotions(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des promotions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/promotions`,
        formData
      );
      if (response.data.success) {
        toast.success('Promotion créée avec succès');
        setShowCreateModal(false);
        fetchPromotions();
      }
    } catch (error) {
      toast.error('Erreur lors de la création de la promotion');
      console.error(error);
    }
  };

  const handleDelete = async (promotionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/promotions/${promotionId}`
        );
        toast.success('Promotion supprimée');
        fetchPromotions();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error(error);
      }
    }
  };

  const getStatusColor = (status: Promotion['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'depleted':
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Nouvelle promotion
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Réduction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisation
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
            {promotions.map(promo => (
              <tr key={promo.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{promo.code}</div>
                  {promo.event && (
                    <div className="text-sm text-gray-500">{promo.event.title}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {promo.type === 'percentage' ? (
                    <span>{promo.value}%</span>
                  ) : (
                    <span>{promo.value.toLocaleString()} CFA</span>
                  )}
                  {promo.minPurchase && (
                    <div className="text-sm text-gray-500">
                      Min: {promo.minPurchase.toLocaleString()} CFA
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>{new Date(promo.startDate).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">
                    au {new Date(promo.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>{promo.usedCount} utilisations</div>
                  {promo.maxUses && (
                    <div className="text-sm text-gray-500">
                      Max: {promo.maxUses}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(promo.status)}`}>
                    {promo.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
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

      {promotions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Aucune promotion créée pour le moment</p>
        </div>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Créer une nouvelle promotion</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Formulaire de création... */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Créer la promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPromotions; 