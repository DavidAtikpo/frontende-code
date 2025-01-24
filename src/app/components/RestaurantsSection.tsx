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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function RestaurantsSection() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0); // Pour forcer le rechargement

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching restaurants...');
      const response = await axios.get(`${BASE_URL}/api/restaurants`);
      
      if (response.data.success) {
        console.log('Restaurants loaded:', response.data.data);
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
    console.log('Component mounted, fetching restaurants...');
    fetchRestaurants();
  }, [fetchRestaurants, key]);

  const handleRefresh = () => {
    console.log('Refreshing restaurants...');
    setKey(prev => prev + 1); // Force le rechargement
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center h-64"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" />
        <p className="text-gray-600">Chargement des restaurants...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <h3 className="text-xl font-bold text-red-600 mb-2">Erreur</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaSync className="mr-2" />
          Réessayer
        </button>
      </motion.div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Bientôt disponible</h3>
        <p className="text-gray-600 mb-4">
          Nos restaurants partenaires seront bientôt disponibles !
        </p>
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaSync className="mr-2" />
          Rafraîchir
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaSync className="mr-2" />
          Rafraîchir
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={key}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {restaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              variants={item}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
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
              <div className="p-6">
                <div className="flex items-center mb-4">
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
                    <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < Math.round(restaurant.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">({restaurant.rating || 0})</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                    <span className="text-sm">{restaurant.address}</span>
                  </div>
                  {restaurant.phoneNumber && (
                    <div className="flex items-center text-gray-600">
                      <FaPhone className="w-4 h-4 mr-2" />
                      <span className="text-sm">{restaurant.phoneNumber}</span>
                    </div>
                  )}
                  {restaurant.email && (
                    <div className="flex items-center text-gray-600">
                      <FaEnvelope className="w-4 h-4 mr-2" />
                      <span className="text-sm">{restaurant.email}</span>
                    </div>
                  )}
                </div>

                <Link 
                  href={`/restaurant/${restaurant.id}`}
                  className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir le menu
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}