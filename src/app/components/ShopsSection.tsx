"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaStore, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Shop {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  location: string;
  category: string;
  productsCount: number;
  isOpen: boolean;
}

export default function ShopsSection() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/shops/featured`);
        setShops(response.data.data);
      } catch (error) {
        console.error('Erreur lors du chargement des boutiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
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

  if (shops.length === 0) {
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
          className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FaStore className="text-orange-500 text-3xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h3>
        <p className="text-gray-600">
          Nos boutiques partenaires seront bientôt disponibles !
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop, index) => (
        <motion.div
          key={shop.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative h-48">
            <Image
              src={shop.image}
              alt={shop.name}
              width={400}
              height={300}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              {shop.category}
            </div>
            {!shop.isOpen && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                Fermé
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{shop.name}</h3>
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{shop.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{shop.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-sm">{shop.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaShoppingBag className="text-gray-400" />
                <span className="text-sm">{shop.productsCount} produits disponibles</span>
              </div>
            </div>
            <Link 
              href={`/shops/${shop.id}`}
              className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visiter la boutique
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 