"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/utils/config';
import axios from 'axios';
import { FaStar, FaMapMarkerAlt, FaStore } from 'react-icons/fa';
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
 
const ShopsSection = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  if (loading) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement des boutiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
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
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-0 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-gradient-to-r from-blue-600 to-blue-800  shadow-lg p-2 mb-2 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Nos Boutiques Partenaires
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Découvrez notre sélection de boutiques de confiance et trouvez les meilleurs produits
          </p>
        </motion.div>

        {shops.length === 0 ? (
          <div className="text-center py-8">
            <FaStore className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500">Aucune boutique disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop, index) => (
              <motion.div 
                key={shop._id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/shop/${shop._id}`)}
              >
                <div className="grid grid-cols-12 gap-4 p-4">
                  {/* Logo à gauche */}
                  <div className="col-span-3 flex items-center justify-center">
                    <img
                      src={shop.logo || DEFAULT_IMAGE}
                      alt={shop.name}
                      className="w-16 h-16 rounded-full border-2 border-white"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>

                  {/* Produits au milieu */}
                  <div className="col-span-6">
                    <h3 className="font-medium text-sm truncate">{shop.name}</h3>
                    <p className="text-gray-600 text-xs mb-1 line-clamp-1">{shop.description}</p>
                    <div className="flex items-center space-x-1 text-yellow-500 text-xs">
                      <FaStar />
                      <span>{shop.rating.toFixed(1)}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1">
                      {/* Afficher quelques produits aléatoires */}
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-full h-16 bg-gray-100 rounded"></div>
                      ))}
                    </div>
                  </div>

                  {/* Image de couverture à droite */}
                  <div className="col-span-3">
                    <img
                      src={shop.coverImage || DEFAULT_IMAGE}
                      alt={shop.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default ShopsSection; 