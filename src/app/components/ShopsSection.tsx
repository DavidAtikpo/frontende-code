"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/utils/config';
import { getCookie } from 'cookies-next';
import axios from 'axios';

const { BASE_URL } = API_CONFIG;

interface Shop {
  _id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  status: string;
}

const ShopsSection = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const token = getCookie('token');
        const response = await axios.get(`${BASE_URL}/api/shops/get-all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setShops(response.data.data || []);
        } else {
          setError('Erreur lors du chargement des boutiques');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des boutiques:', error);
        setError('Impossible de charger les boutiques');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Les boutiques ne sont pas disponibles pour le moment.</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Nos Boutiques Partenaires</h2>
          <p className="mt-4 text-lg text-gray-600">
            Découvrez notre sélection de boutiques de confiance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shops.map((shop) => (
            <div
              key={shop._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={shop.coverImage ? `${BASE_URL}${shop.coverImage}` : '/shop-default.jpg'}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="h-16 w-16 rounded-full bg-white p-2">
                    <img
                      src={shop.logo ? `${BASE_URL}${shop.logo}` : '/logo-default.png'}
                      alt={`${shop.name} logo`}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                <p className="text-gray-600 mb-4">{shop.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-600">{shop.rating.toFixed(1)}</span>
                  </div>
                  <button
                    onClick={() => router.push(`/shops/${shop._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Visiter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopsSection; 