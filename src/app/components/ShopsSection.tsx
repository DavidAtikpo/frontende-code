"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/utils/config';
import axios from 'axios';
import { FaStar, FaMapMarkerAlt, FaStore, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const { BASE_URL } = API_CONFIG;

interface Shop {
  _id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  status: string;
  location?: string;
  productsCount?: number;
}

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return DEFAULT_IMAGE;
  
  if (Array.isArray(imagePath)) {
    imagePath = imagePath[0];
    if (!imagePath) return DEFAULT_IMAGE;
  }
  
  if (typeof imagePath === 'string') {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('uploads')) {
      return `${BASE_URL}/${imagePath}`;
    }
  }
  
  return DEFAULT_IMAGE;
};

const ShopsSection = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/shops/get-all`);

        if (response.data?.success) {
          setShops(response.data.data || []);
        } else {
          setError("Erreur lors du chargement des boutiques");
          setShops([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des boutiques:', error);
        setError("Impossible de charger les boutiques pour le moment.");
        setShops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement des boutiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Boutiques Partenaires
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Découvrez notre sélection de boutiques de confiance et trouvez les meilleurs produits
          </p>
          
          {/* Barre de recherche */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Rechercher une boutique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {filteredShops.length === 0 ? (
          <div className="text-center py-12">
            <FaStore className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500">Aucune boutique ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredShops.map((shop, index) => (
              <motion.div 
                key={shop._id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-24 sm:h-28 w-full">
                  <img
                    src={getImageUrl(shop.logo)}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-xs truncate">{shop.name}</h3>
                  <p className="text-gray-600 text-xs mb-1 line-clamp-1">{shop.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-xs">{shop.rating.toFixed(1)}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      shop.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {shop.status === 'verified' ? 'Ouvert' : 'Fermé'}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{shop.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopsSection; 