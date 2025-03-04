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
import { getCookie } from 'cookies-next';



const { BASE_URL } = API_CONFIG;
// const BASE_URL = "http://localhost:5000";
interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string | null;
  images: string[];
  category: {
    id: string;
    title: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  quantity: number;
  seller: {
    shopName: string;
    status: string;
    id: string;
  };
  featured: boolean;
  lowStockThreshold: number;
  discount: number | null;
}

// 1. D'abord, créons une constante pour l'image par défaut avec une meilleure qualité
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

// 2. Améliorons la fonction getImageUrl
const getImageUrl = (product: Product) => {
  if (!product?.images?.length) return DEFAULT_IMAGE;
  
  try {
    // Si c'est un tableau, prendre la première image
    const path = Array.isArray(product.images) ? product.images[0] : product.images;
    if (!path) return DEFAULT_IMAGE;

    // Si c'est déjà une URL complète (http ou https)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Nettoyer le chemin de l'image
    const cleanPath = path.replace(/^\/+/, '').replace(/\\/g, '/');

    // Si nous sommes en développement (localhost)
    if (BASE_URL.includes('localhost')) {
      return `http://localhost:5000/${cleanPath}`;
    }

    // En production, s'assurer que le chemin commence par 'uploads'
    if (!cleanPath.startsWith('uploads/')) {
      return `${BASE_URL}/uploads/${cleanPath}`;
    }

    // Si le chemin commence déjà par 'uploads'
    return `${BASE_URL}/${cleanPath}`;

  } catch (error) {
    console.error('Erreur dans getImageUrl:', error, 'Path:', product.images);
    return DEFAULT_IMAGE;
  }
};

const HomeProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useCartContext();

  // Montage du composant
  useEffect(() => {
    setMounted(true);
  }, []);

  // Chargement des produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/get-all`);
        const data = await response.json();
        
        if (data.success) {
          // Pas besoin de transformer les URLs ici car getImageUrl le fera au moment du rendu
          setProducts(data.products.slice(0, 8));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    if (mounted) {
      fetchProducts();
    }
  }, [mounted]);

  const handleAddToCart = (product: Product) => {
    console.log('handleAddToCart - Product:', product);
    
    const finalPrice = product.discount
      ? parseFloat(product.price) * (1 - product.discount / 100)
      : parseFloat(product.price);

    console.log('handleAddToCart - Final Price:', finalPrice);
    console.log('handleAddToCart - Current Cart State:', state.cart);

    // Mapper le produit pour correspondre à la structure attendue
    const cartItem = {
      _id: product.id,
      title: product.name,
      images: product.images,
      quantity: 1,
      finalPrice,
      sellerId: product.seller.id
    };

    console.log('handleAddToCart - Mapped Cart Item:', cartItem);

    dispatch({
      type: "ADD_TO_CART",
      payload: cartItem
    });

    console.log('handleAddToCart - Cart State After Dispatch:', state.cart);
  };

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = state.wishlist.find((item) => item._id === product.id);
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product.id });
    } else {
      dispatch({
        type: "ADD_TO_WISHLIST",
        payload: {
          _id: product.id,
          title: product.name,
          images: product.images,
          finalPrice: parseFloat(product.price),
          sellerId: product.seller.id
        },
      });
    }
  };

  const handleBuyNow = async (product: Product) => {
    try {
      console.log('1. handleBuyNow - Starting with product:', product);
      const token = getCookie('token');
      console.log('2. handleBuyNow - Token:', token);
      
      if (!token) {
        console.log('3A. handleBuyNow - No token, redirecting to login');
        localStorage.setItem('pendingPurchase', JSON.stringify({
          productId: product.id,
          redirect: '/checkout/shipping-address'
        }));
        console.log('3B. handleBuyNow - Saved to localStorage:', localStorage.getItem('pendingPurchase'));
        
        router.push('/login');
        return;
      }

      console.log('4. handleBuyNow - Token exists, calculating price');
      const finalPrice = product.discount
        ? parseFloat(product.price) * (1 - product.discount / 100)
        : parseFloat(product.price);

      console.log('5. handleBuyNow - Final price calculated:', finalPrice);

      const cartItem = {
        _id: product.id,
        title: product.name,
        images: product.images,
        quantity: 1,
        finalPrice,
        sellerId: product.seller.id
      };

      console.log('6. handleBuyNow - Cart item prepared:', cartItem);

      dispatch({
        type: "ADD_TO_CART",
        payload: cartItem
      });

      console.log('7. handleBuyNow - Added to cart, attempting redirect to shipping-address');
      
      try {
        await router.push('/checkout/shipping-address');
        console.log('8. handleBuyNow - Redirect successful');
      } catch (redirectError) {
        console.error('8X. handleBuyNow - Redirect error:', redirectError);
        // Tentative de redirection alternative
        console.log('9. handleBuyNow - Trying alternative redirect');
        window.location.href = '/checkout/shipping-address';
      }
    } catch (error) {
      console.error('XX. handleBuyNow - Main error:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
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
              className="flex gap-1"
            >
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-2xl md:text-3xl" />
              ))}
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Produits Populaires
            </h2>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Découvrez notre sélection des produits les plus appréciés
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex overflow-x-auto gap-1 pb-4 snap-x snap-mandatory hide-scrollbar">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
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
                className="bg-white rounded-xl shadow-lg overflow-hidden group relative border-2 border-blue-500 
                  snap-start flex-shrink-0 w-[160px] sm:w-[200px] h-[260px] sm:h-[280px] transform transition-all duration-300"
              >
                <div className="relative h-[140px] sm:h-[160px]">
                  <div className="w-full h-full">
                    <Image
                      src={getImageUrl(product)}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover object-center rounded-t-lg"
                      loading="lazy"
                      onError={(e) => {
                        console.log('Erreur de chargement d\'image pour:', product.name);
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                        target.onerror = null;
                      }}
                      sizes="(max-width: 640px) 160px, 200px"
                    />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {product.quantity <= product.lowStockThreshold && (
                      <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs">
                        {product.quantity === 0 ? 'Rupture de stock' : `${product.quantity} en stock`}
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
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-colors"
                      title="Voir le produit"
                    >
                      <FaEye size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-1 sm:p-2">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-0.5 truncate">
                    {product.name}
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
                    {product.ratings.average > 0 && (
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-0.5" size={10} />
                        <span className="text-[10px] sm:text-xs text-gray-600">{product.ratings.average.toFixed(1)}</span>
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
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (product.quantity > 0) {
                            try {
                              const button = e.currentTarget;
                              button.disabled = true;
                              button.classList.add('opacity-50');
                              await handleBuyNow(product);
                            } catch (error) {
                              console.error('Erreur lors du clic sur Acheter:', error);
                            }
                          }
                        }}
                        disabled={product.quantity === 0}
                        className={`text-white text-sm font-medium transition-opacity duration-200 ${
                          product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                        }`}
                      >
                        {product.quantity === 0 ? 'Indisponible' : 'Acheter'}
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
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/products')}
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl 
              hover:bg-blue-700 transition-all duration-300"
          >
            <span className="font-medium">Voir tous les produits</span>
            <FaShoppingCart className="ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HomeProducts;
