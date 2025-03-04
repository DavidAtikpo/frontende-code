"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { API_CONFIG } from '@/utils/config';
import Link from 'next/link';
import { FaShoppingCart, FaHeart, FaShoppingBag, FaSeedling } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCartContext } from "../context/CartContext";
import { motion } from "framer-motion";

const { BASE_URL } = API_CONFIG;
const DEFAULT_IMAGE = '/default-image.jpg';

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  seller?: {
    id: string;
    shopName: string;
  };
}

const ProductVivriere = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { dispatch } = useCartContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/products/produits-vivriere`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.message || "Erreur lors de la récupération des produits.");
        }
      } catch (error) {
        console.error("Erreur de chargement des produits:", error);
        setError("Impossible de récupérer les produits.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getImageUrl = (product: Product) => product.images?.[0] || DEFAULT_IMAGE;

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    dispatch({ 
      type: "ADD_TO_CART", 
      payload: {
        _id: product.id,
        title: product.name,
        finalPrice: product.price,
        sellerId: product.seller?.id || 'undefined',
        images: product.images,
        quantity: 1
      }
    });
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    handleAddToCart(e, product);
    router.push('/checkout/payment-method');
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement des produits vivriers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4"
        >
          <FaSeedling className="text-blue-500 text-3xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Bientôt disponible</h3>
        <p className="text-gray-600">Nos produits vivriers seront bientôt disponibles !</p>
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
          className="relative bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg p-2 mb-2 text-center"
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
              <FaSeedling size={40} />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Produits Vivriers
            </h2>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Découvrez notre sélection de produits vivriers de qualité
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-3 md:space-x-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
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
                    <Image
                      src={getImageUrl(product)}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      priority={index < 4}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-sm font-bold text-white truncate">{product.name}</h3>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-blue-600">{product.price.toLocaleString()} CFA</span>
                      {product.seller && (
                        <span className="text-[10px] text-gray-600 truncate">
                          {product.seller.shopName}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex-1 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-xs flex items-center justify-center gap-1"
                      >
                        <FaShoppingCart size={10} />
                        <span>Ajouter</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => handleBuyNow(e, product)}
                        className="flex-1 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors text-xs flex items-center justify-center gap-1"
                      >
                        <FaShoppingBag size={10} />
                        <span>Acheter</span>
                      </motion.button>
                    </div>
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
};

export default ProductVivriere;
