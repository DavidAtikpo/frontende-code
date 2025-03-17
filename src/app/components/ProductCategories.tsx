"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { API_CONFIG } from '@/utils/config';
import Link from 'next/link';
import { FaShoppingCart, FaHeart, FaShoppingBag, FaChevronLeft, FaChevronRight, FaLeaf } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCartContext } from "../context/CartContext";
import { motion } from "framer-motion";
import { getCookie } from 'cookies-next';

const { BASE_URL } = API_CONFIG;

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  mainImage: string;
  seller?: {
    id: string;
    shopName: string;
  };
}

const PRODUCTS_PER_PAGE = 20;

const ProductCategories = () => {
  const [produitsFrais, setProduitsFrais] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { state, dispatch } = useCartContext();

  const totalPages = Math.ceil(produitsFrais.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = produitsFrais.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchProduitsFrais = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/products/produits-frais`);
        const data = await response.json();
        
        if (data.success) {
          setProduitsFrais(data.data);
        } else {
          setError(data.message || "Erreur lors de la récupération des produits frais");
        }
      } catch (error) {
        console.error("Erreur:", error);
        setError("Erreur lors de la récupération des produits frais");
      } finally {
        setLoading(false);
      }
    };

    fetchProduitsFrais();
  }, []);

  const getImageUrl = (product: Product) => {
    try {
      if (!product.mainImage && (!product.images || product.images.length === 0)) {
        console.log('Aucune image trouvée pour le produit:', product.id);
        return '/placeholder.jpg';
      }

      const imagePath = product.mainImage || product.images[0];
      console.log('Chemin d\'image original:', imagePath);

      if (imagePath.startsWith('http')) {
        return imagePath;
      }

      // Utiliser l'URL de base de la configuration
      const fullUrl = `${API_CONFIG.BASE_URL}/${imagePath.replace(/^\/+/, '')}`;
      console.log('URL complète construite:', fullUrl);
      return fullUrl;

    } catch (error) {
      console.error('Erreur dans getImageUrl pour le produit', product.id, ':', error);
      return '/placeholder.jpg';
    }
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product): void => {
    e.preventDefault(); // Empêcher la navigation
    dispatch({ 
      type: "ADD_TO_CART", 
      payload: {
        _id: product.id,
        title: product.name,
        finalPrice: product.price,
        sellerId: product.seller?.id || 'unknown',
        images: product.images,
        quantity: 1
      }
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Empêcher la navigation
    dispatch({
      type: "ADD_TO_WISHLIST",
      payload: {
        _id: product.id,
        title: product.name,
        finalPrice: product.price,
        sellerId: product.seller?.id || 'unknown',
        images: product.images
      }
    });
  };

  const handleBuyNow = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Empêcher la navigation
    try {
      const token = getCookie('token');
      
      if (!token) {
        localStorage.setItem('pendingPurchase', JSON.stringify({
          productId: product.id,
          redirect: '/checkout/shipping-address'
        }));
        router.push('/login');
        return;
      }

      const cartItem = {
        _id: product.id,
        title: product.name,
        finalPrice: product.price,
        sellerId: product.seller?.id || 'unknown',
        images: product.images,
        quantity: 1
      };

      dispatch({ 
        type: "ADD_TO_CART", 
        payload: cartItem
      });

      router.push('/checkout/shipping-address');
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement des produits frais...</p>
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

  if (produitsFrais.length === 0) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <FaShoppingCart className="text-gray-400 text-5xl mb-4" />
        <p className="text-gray-600">Aucun produit frais disponible pour le moment.</p>
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
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FaLeaf className="text-white text-3xl md:text-4xl" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Nos Produits Frais
            </h2>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Découvrez notre sélection de produits frais de qualité
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-3 md:space-x-4">
              {currentProducts.map((product, index) => (
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
                  className="bg-white rounded-xl shadow-lg overflow-hidden group relative border border-blue-500 hover:shadow-xl transition-all duration-300 w-[calc(50%-8px)] md:w-[calc(16.666%-12px)] flex-shrink-0"
                >
                  <div className="relative aspect-square">
                    <Link href={`/product/${product.id}`}>
                      <Image 
                        src={getImageUrl(product)} 
                        alt={product.name} 
                        width={150}
                        height={150}
                        className="object-cover w-full h-full"
                        priority={index < 4}
                      />
                    </Link>
                    <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleAddToWishlist(e, product)}
                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                        title="Ajouter à la liste de souhaits"
                      >
                        <FaHeart className="text-red-500" size={12} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleAddToCart(e, product)}
                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors"
                        title="Ajouter au panier"
                      >
                        <FaShoppingCart className="text-blue-500" size={12} />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs font-semibold truncate">{product.name}</h4>
                    <p className="text-blue-800 font-bold mt-0.5 text-xs">{product.price.toLocaleString()} CFA</p>
                    {product.seller && (
                      <Link 
                        href={`/store/${product.seller.id}`}
                        className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline mt-0.5 block truncate"
                      >
                        {product.seller.shopName}
                      </Link>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleBuyNow(e, product)}
                      className="w-full mt-1 bg-blue-600 text-white py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-xs"
                    >
                      <FaShoppingBag size={10} />
                      <span>Acheter</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Suppression de la pagination car nous affichons tout sur une ligne */}
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

export default ProductCategories;
