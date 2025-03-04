"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaStar, FaUser, FaTools, FaTruck, FaBox } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

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

  // Fonction pour gérer les URLs des images
  const getImageUrl = (imagePath: string | string[]) => {
    if (!imagePath) return DEFAULT_IMAGE;
    
    try {
      // Si c'est un tableau, prendre la première image
      const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
      if (!path) return DEFAULT_IMAGE;
    
      // Retourner l'URL Cloudinary directement
      return path;
    } catch (error) {
      console.error('Erreur dans getImageUrl:', error);
      return DEFAULT_IMAGE;
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/services/public`, {
          headers: {
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
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
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement des services...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4"
        >
          <FaTools className="text-blue-500 text-3xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Bientôt disponible</h3>
        <p className="text-gray-600">Nos services seront bientôt disponibles !</p>
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
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{ 
                rotate: [0, 20, -20, 0],
                scale: [1, 1.2, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
              className="text-white"
            >
              <FaTools size={40} />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Nos Services
            </h2>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Découvrez notre gamme de services professionnels
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-3 md:space-x-4">
              {services.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
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
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 w-[calc(50%-8px)] md:w-[calc(16.666%-12px)] flex-shrink-0"
                >
                  <div className="relative h-32">
                    {service.images && service.images.length > 0 ? (
                      <>
                        <Image
                          src={getImageUrl(service.images)}
                          alt={service.title}
                          width={300}
                          height={200}
                          className="object-cover w-full h-full"
                          priority={index < 4}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </>
                    ) : (
                      <div className="h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <div className="text-3xl text-white">
                          {getIcon(service.icon)}
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-sm font-bold text-white truncate">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2 h-8">{service.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <FaUser className="text-blue-500 text-xs" />
                        <span className="text-[10px] truncate">{service.provider?.name || 'Dubon Service'}</span>
                      </div>
                      <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {service.category}
                      </span>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link 
                        href={`/service/request`}
                        className="block text-center bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-xs"
                      >
                        Demander ce Service
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </motion.section>
  );
} 