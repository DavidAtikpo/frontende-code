"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSync } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { API_CONFIG } from '@/utils/config';
import { toast } from 'react-hot-toast';

const { BASE_URL } = API_CONFIG;

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string | null;
  logo: string | null;
  coverImage: string | null;
  location: string | null;
  status: string;
  rating: number;
  seller: {
    id: string;
    name: string;
    email: string;
  };
}

export default function RestaurantsSection() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/restaurants`);
      
      if (response.data.success) {
        setRestaurants(response.data.data);
      } else {
        setError(response.data.message);
        toast.error('Erreur: ' + response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des restaurants:', error);
      setError('Erreur lors du chargement des restaurants');
      toast.error('Erreur lors du chargement des restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants, key]);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement des restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={handleRefresh}
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
          className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 mb-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Nos Restaurants Partenaires
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Découvrez notre sélection de restaurants et profitez des meilleurs plats
          </p>
        </motion.div>

        {!restaurants || restaurants.length === 0 ? (
          <div className="text-center py-8">
            <FaSync className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500">Aucun restaurant disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
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
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-40">
                  <Image
                    src={restaurant.coverImage || '/images/default-restaurant.jpg'}
                    alt={restaurant.name}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full"
                    priority
                  />
                  {restaurant.status === 'featured' && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      Recommandé
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    {restaurant.logo && (
                      <Image
                        src={restaurant.logo}
                        alt={`${restaurant.name} logo`}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold truncate">{restaurant.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-3 h-3 ${i < Math.round(restaurant.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-600">({restaurant.rating || 0})</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="w-3 h-3 mr-2" />
                      <span className="text-xs truncate">{restaurant.address}</span>
                    </div>
                    {restaurant.phoneNumber && (
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="w-3 h-3 mr-2" />
                        <span className="text-xs">{restaurant.phoneNumber}</span>
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/restaurant/${restaurant.id}`}
                    className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Voir le menu
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}