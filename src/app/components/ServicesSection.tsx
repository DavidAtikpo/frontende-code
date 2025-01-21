"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaStar, FaUser, FaTools, FaTruck, FaBox } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  images?: string[];
  icon: string;
  provider?: {
    id: string;
    name: string;
    avatar?: string;
  };
  status?: string;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour obtenir l'icône correspondante
  const getIcon = (iconName: string) => {
    const icons = {
      FaTruck: <FaTruck />,
      FaTools: <FaTools />,
      FaBox: <FaBox />
    };
    return icons[iconName as keyof typeof icons] || <FaTools />;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('Fetching services from:', `${BASE_URL}/api/services/public`);
        
        const response = await fetch(`${BASE_URL}/api/services/public`, {
          headers: {
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        });

        const data = await response.json();
        console.log('Services data:', data);

        if (data.success && Array.isArray(data.data)) {
          // Prendre les 6 premiers services
          setServices(data.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
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

  if (services.length === 0) {
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
          className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FaTools className="text-purple-500 text-3xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Bientôt disponible</h3>
        <p className="text-gray-600">
          Nos services seront bientôt disponibles !
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <motion.div
          key={service._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {service.images && service.images.length > 0 ? (
            <div className="relative h-48">
              <img
                src={`${BASE_URL}/${service.images[0]}`}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 bg-blue-50 flex items-center justify-center">
              <div className="text-4xl text-blue-600">
                {getIcon(service.icon)}
              </div>
            </div>
          )}
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-400" />
                <span className="text-sm">{service.provider?.name || 'Dubon Service'}</span>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {service.category}
              </span>
            </div>
            <Link 
              href={`/service/request`}
              className="mt-4 block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Demander ce Service
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 