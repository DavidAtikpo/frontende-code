"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '@/utils/config';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import { motion } from 'framer-motion';


const { BASE_URL } = API_CONFIG;

import { 
  FaStore, 
  FaEdit, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaStar,
  FaBox
} from 'react-icons/fa';



interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  totalProducts: number;
  totalOrders: number;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  mainImage: string;
  description: string;
  stock: number;
  status: 'active' | 'inactive';
}

// Constante pour l'image par défaut
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string | string[]) => {
  if (!imagePath) return DEFAULT_IMAGE;
  
  try {
    // Si c'est un tableau, prendre la première image
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!path) return DEFAULT_IMAGE;
  
    // Si c'est déjà une URL complète
    if (path.startsWith('http')) {
      return path;
    }
  
    // Si le chemin commence par 'uploads'
    if (path.startsWith('uploads')) {
      return `${BASE_URL}/${path}`;
    }

    // Pour tout autre cas
    return `${BASE_URL}/uploads/products/${path.replace(/^\/+/, '')}`;
  } catch (error) {
    console.error('Erreur dans getImageUrl:', error);
    return DEFAULT_IMAGE;
  }
};

const ShopPage = () => {
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const token = getCookie('token');
        const response = await axios.get(`${BASE_URL}/api/shops/seller/shop`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data?.success) {
          setShop(response.data.data);
        } else {
          toast.error(response.data?.message || 'Erreur lors du chargement de la boutique');
        }
      } catch (error: any) {
        console.error('Erreur chargement boutique:', error);
        toast.error(error.response?.data?.message || 'Erreur lors du chargement de la boutique');
        if (error.response?.status === 404) {
          // Rediriger vers la page de configuration si la boutique n'existe pas
          router.push('/seller/settings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Aucune boutique trouvée</h2>
        <p className="text-gray-600 mb-6">Vous n'avez pas encore configuré votre boutique.</p>
        <button
          onClick={() => router.push('/seller/settings')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Configurer ma boutique
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* En-tête de la boutique */}
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="relative bg-white rounded-lg shadow-lg overflow-hidden mb-8"
      >
        {/* Image de couverture */}
        <div className="relative h-32 sm:h-48 md:h-64 w-full">
          <img
            src={getImageUrl(shop.coverImage)}
            alt={shop.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Informations de la boutique */}
        <div className="relative px-4 md:px-6 py-4 -mt-16 md:-mt-20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-5">
            {/* Logo */}
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-lg overflow-hidden border-4 border-white bg-white mx-auto md:mx-0">
              <img
                src={getImageUrl(shop.logo)}
                alt={`${shop.name} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_IMAGE;
                }}
              />
            </div>

            {/* Détails */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{shop.name}</h1>
                  <div className="flex items-center justify-center md:justify-start mt-2 text-white">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{shop.rating.toFixed(1)}</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/seller/dashboard/shop/edit')}
                  className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de contact */}
        <div className="px-4 md:px-6 py-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
              <span className="truncate">{shop.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaPhone className="mr-2 flex-shrink-0" />
              <span className="truncate">{shop.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaEnvelope className="mr-2 flex-shrink-0" />
              <span className="truncate">{shop.email}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h2 className="text-xl font-bold mb-4">À propos de la boutique</h2>
        <p className="text-gray-600">{shop.description}</p>
      </motion.div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Produits</p>
              <p className="text-2xl font-bold">{shop.totalProducts}</p>
            </div>
            <FaBox className="text-blue-600 h-8 w-8" />
          </div>
        </motion.div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Commandes</p>
              <p className="text-2xl font-bold">{shop.totalOrders}</p>
            </div>
            <FaStore className="text-blue-600 h-8 w-8" />
          </div>
        </motion.div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Note moyenne</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold mr-2">{shop.rating.toFixed(1)}</p>
                <FaStar className="text-yellow-400 h-6 w-6" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Liste des produits */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-lg p-4 md:p-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h2 className="text-xl font-bold mb-4 md:mb-0">Produits</h2>
          <button
            onClick={() => router.push('/seller/products/add')}
            className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ajouter un produit
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {shop.products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-32 sm:h-36 w-full">
                <img
                  src={getImageUrl(product.mainImage)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_IMAGE;
                  }}
                />
              </div>
              <div className="p-2 sm:p-3">
                <h3 className="font-bold text-xs sm:text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-blue-600 text-xs sm:text-sm">{product.price.toLocaleString()} FCFA</p>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShopPage; 