"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaChevronRight, 
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUtensils
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '@/utils/config';

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

const DubonRestoPage = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDubonResto = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${BASE_URL}/api/restaurants`);
        
        if (response.data.success) {
          const dubonResto = response.data.data.find((resto: Restaurant) => 
            resto.name.toLowerCase() === 'dubon resto'
          );
          
          if (dubonResto) {
            setRestaurant(dubonResto);
          } else {
            setError('Restaurant Dubon Resto non trouvé');
          }
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Erreur lors du chargement du restaurant');
      } finally {
        setLoading(false);
      }
    };

    fetchDubonResto();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <FaUtensils className="text-6xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Restaurant non disponible</h2>
          <p className="text-gray-600 mb-4">{error || 'Le restaurant est temporairement indisponible'}</p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-white px-4 py-3 rounded-lg shadow-sm mx-4 sm:mx-6 lg:mx-8 mt-4"
      >
        <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
          <FaHome className="mr-1" />
          Accueil
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">Dubon Resto</span>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image de couverture */}
          <div className="relative h-[400px]">
            <Image
              src={restaurant.coverImage || '/images/default-restaurant.jpg'}
              alt={restaurant.name}
              width={1920}
              height={1080}
              className="object-cover w-full h-full"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
              <div className="flex items-center">
                {restaurant.logo && (
                  <Image
                    src={restaurant.logo}
                    alt={`${restaurant.name} logo`}
                    width={80}
                    height={80}
                    className="rounded-full mr-6 border-2 border-white"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{restaurant.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < Math.round(restaurant.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-white">({restaurant.rating || 0})</span>
                    </div>
                    <span className="text-white/60">|</span>
                    <span className="text-white">{restaurant.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <p className="text-gray-700 text-lg mb-8">{restaurant.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Informations</h2>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="w-5 h-5 mr-3" />
                  <span>{restaurant.address}</span>
                </div>
                {restaurant.phoneNumber && (
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="w-5 h-5 mr-3" />
                    <span>{restaurant.phoneNumber}</span>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="w-5 h-5 mr-3" />
                    <span>{restaurant.email}</span>
                  </div>
                )}
              </div>

              {restaurant.location && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Localisation</h2>
                  <a 
                    href={restaurant.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    Voir sur Google Maps
                  </a>
                </div>
              )}
            </div>

            <div className="mt-8">
              <Link 
                href={`/restaurant/${restaurant.id}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir le menu complet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DubonRestoPage;
