"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaEye, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/CartContext";
import ProductImage from "@/components/ui/ProductImage";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import { API_CONFIG } from '@/utils/config';
import Image from "next/image";

const { BASE_URL } = API_CONFIG;
// const BASE_URL = "http://localhost:5000";
interface Product {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  images: string | string[];
  category: string;
  rating: number;
  stock: number;
  seller: {
    storeName: string;
    status: string;
  };
  featured: boolean;
  isDigital: boolean;
  lowStockThreshold: number;
  discount: number | null;
}

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string | string[]) => {
  if (!imagePath) {
    return "/no-image.png";
  }

  const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
  if (!path) {
    return "/no-image.png";
  }
  
  try {
    // Si c'est déjà une URL complète
    if (path.startsWith('http')) {
      return path;
    }
    
    // Si le chemin commence par /uploads
    if (path.includes('/uploads')) {
      return `${BASE_URL}${path}`;
    }
    
    // Pour les autres chemins relatifs
    return `${BASE_URL}/uploads/products/${path.replace(/^\/+/, '')}`;
  } catch (error) {
    console.error('Error processing image URL:', error);
    return "/no-image.png";
  }
};

const HomeProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { state, dispatch } = useCartContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/get-all`);
        const data = await response.json();
        
        if (data.success) {
          const productsWithFixedImages = data.data.slice(0, 8).map((product: Product) => {
            const images = Array.isArray(product.images) 
              ? product.images.map(img => getImageUrl(img))
              : getImageUrl(product.images);

            return {
              ...product,
              images
            };
          });
          
          setProducts(productsWithFixedImages);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const finalPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    dispatch({
      type: "ADD_TO_CART",
      payload: { 
        ...product, 
        quantity: 1, 
        finalPrice 
      },
    });
  };

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = state.wishlist.find((item) => item._id === product._id);
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product._id });
    } else {
      dispatch({
        type: "ADD_TO_WISHLIST",
        payload: {
          _id: product._id,
          title: product.title,
          images: product.images,
          finalPrice: product.price,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Produits Populaires
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection des produits les plus appréciés
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group relative border-2 border-blue-500 
                  snap-start flex-shrink-0 w-[160px] sm:w-[200px] h-[260px] sm:h-[280px]"
              >
                <div className="relative h-[140px] sm:h-[160px]">
                  <img
                    src={Array.isArray(product.images) ? getImageUrl(product.images[0]) : getImageUrl(product.images)}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.jpg";
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {product.stock <= product.lowStockThreshold && (
                      <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs">
                        {product.stock === 0 ? 'Rupture de stock' : `${product.stock} en stock`}
                      </span>
                    )}
                    {product.discount && product.discount > 0 && (
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                        -{product.discount}%
                      </span>
                    )}
                    {product.featured && (
                      <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                        Populaire
                      </span>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-colors"
                      title="Ajouter au panier"
                    >
                      <FaShoppingCart size={16} />
                    </button>
                    <button 
                      onClick={() => handleToggleWishlist(product)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                      title="Ajouter aux favoris"
                    >
                      <FaHeart size={16} />
                    </button>
                    <button 
                      onClick={() => router.push(`/product/${product._id}`)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-colors"
                      title="Voir le produit"
                    >
                      <FaEye size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-1 sm:p-2">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-0.5 truncate">
                    {product.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 truncate">
                    {product.shortDescription || product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base font-bold text-blue-600">
                        {product.price.toLocaleString()} CFA
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                          {product.compareAtPrice.toLocaleString()} CFA
                        </span>
                      )}
                    </div>
                    {product.rating > 0 && (
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-0.5" size={10} />
                        <span className="text-[10px] sm:text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bouton Acheter avec effet diagonal */}
                <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden">
                  <div 
                    className="absolute bottom-0 right-0 w-28 h-28 bg-blue-600 transform rotate-45 translate-x-14 translate-y-6 hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <div className="absolute bottom-6 right-14 transform -rotate-45 flex flex-col items-center top-12">
                      <button
                        onClick={() => {
                          if (product.stock > 0) {
                            router.push(`/product/${product._id}/`);
                          }
                        }}
                        disabled={product.stock === 0}
                        className={`text-white text-sm font-medium ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {product.stock === 0 ? 'Indisponible' : 'Acheter'}
                      </button>
                      <img 
                        src="/Logo blanc.png" 
                        alt="Logo" 
                        className="w-4 h-4 mt-1"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => router.push('/products')}
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl 
              hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <span className="font-medium">Voir tous les produits</span>
            <FaShoppingCart className="ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeProducts;
