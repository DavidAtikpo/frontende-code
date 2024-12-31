"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaUtensils, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string[];
  rating: number;
  address: string;
  openingHours: string;
  priceRange: string;
  isVerified: boolean;
  status: string;
}

export default function RestaurantsSection() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/featured`);
        setRestaurants(response.data.data);
      } catch (error) {
        console.error('Erreur lors du chargement des restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </motion.div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FaUtensils className="text-red-500 text-3xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h3>
        <p className="text-gray-600">
          Nos restaurants partenaires seront bientôt disponibles !
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant, index) => (
        <motion.div
          key={restaurant.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative h-48">
            <Image
              src={restaurant.image}
              alt={restaurant.name}
              width={400}
              height={300}
              className="object-cover w-full h-full"
            />
            {restaurant.isVerified && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                Vérifié
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <FaUtensils className="text-gray-400" />
                <span className="text-sm">{restaurant.cuisine.join(', ')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-sm">{restaurant.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="text-gray-400" />
                <span className="text-sm">{restaurant.openingHours}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Prix: {restaurant.priceRange}</span>
            </div>
            <Link 
              href={`/restaurants/${restaurant.id}`}
              className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir le menu
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 