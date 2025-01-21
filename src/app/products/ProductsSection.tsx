"use client";

import React, { useEffect, useState } from "react";
import { FaStar, FaHeart, FaShoppingCart, FaEye, FaFilter, FaSearch, FaHome, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/CartContext";
import Image from "next/image";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import Link from "next/link";
import { getCookie } from 'cookies-next';
import { useToast } from "@/components/ui/use-toast";
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

// Interface pour les produits
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
  quantity: number;
  seller: {
    storeName: string;
    status: string;
    id: string;
  };
  featured: boolean;
  isDigital: boolean;
  lowStockThreshold: number;
  discount: number | null;
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
  
    // Retourner l'URL Cloudinary directement
    return path;
  } catch (error) {
    console.error('Erreur dans getImageUrl:', error);
    return DEFAULT_IMAGE;
  }
};

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const { state, dispatch } = useCartContext();
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/get-all`);
        const data = await response.json();
        
        if (data.success) {
          // Log détaillé du premier produit pour voir sa structure
          console.log('Structure du premier produit:', data.products[0]);
          
          // Transformation des données pour s'assurer que _id est présent
          const formattedProducts = data.products.map((product: any) => ({
            ...product,
            _id: product._id || product.id // Utilise _id ou id si _id n'existe pas
          }));
          
          setProducts(formattedProducts);
          setFilteredProducts(formattedProducts);
        } else {
          setError('Erreur lors du chargement des produits');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Erreur lors du chargement des produits');
      } finally {
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
      payload: { ...product, quantity: 1, finalPrice, sellerId: product.seller.id },
    });
  };

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = state.wishlist.find((item) => item._id === product._id);
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product._id });
    } else {
      const wishlistItem = {
        _id: product._id,
        title: product.title,
        images: product.images,
        finalPrice: product.price,
        sellerId: product.seller.id
      };

      dispatch({
        type: "ADD_TO_WISHLIST",
        payload: wishlistItem,
      });
    }
  };

  const handleViewProduct = (productId: string) => {
    console.log('Product complet:', products.find(p => p._id === productId));
    console.log('Product ID reçu:', productId);
    if (!productId) {
      console.error('ID du produit non défini');
      return;
    }
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    let filtered = [...products];

    // Filtre par catégorie
    if (filterCategory) {
      filtered = filtered.filter((product) => product.category === filterCategory);
    }

    // Filtre par note
    if (filterRating) {
      filtered = filtered.filter((product) => product.rating >= filterRating);
    }

    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    switch (sortBy) {
      case "low-price":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high-price":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default: // "popular" ou autres
        filtered.sort((a, b) => b.rating * b.quantity - a.rating * a.quantity);
        break;
    }

    setFilteredProducts(filtered);
  }, [filterCategory, filterRating, search, sortBy, products]);

  const handleBuyNow = async (product: Product) => {
    try {
      const token = getCookie('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const finalPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

      const cartResponse = await fetch(`${BASE_URL}/api/user/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });

      if (cartResponse.ok) {
        const userResponse = await fetch(`${BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await userResponse.json();

        if (userData.shippingAddress) {
          router.push('/checkout/payment');
        } else {
          router.push('/checkout/shipping-address');
        }
      } else {
        throw new Error('Erreur lors de l\'ajout au panier.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat immédiat :', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Breadcrumb */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-white px-4 py-3 rounded-lg shadow-sm"
      >
        <Link 
          href="/" 
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          <FaHome className="mr-1" />
          Accueil
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">Boutique</span>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
      >
        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaFilter className="text-blue-600" />
                Filtres
              </h3>
              
              {/* Barre de recherche */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Catégories */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">Catégories</h4>
                {["Produits frais", "Produits Congeles", "Épicerie", "Agro-Alimentaires"].map(
                  (category) => (
                    <motion.label
                      key={category}
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        onChange={() => setFilterCategory(category)}
                        checked={filterCategory === category}
                        className="form-radio text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-600 hover:text-blue-600 transition-colors">
                        {category}
                      </span>
                    </motion.label>
                  )
                )}
              </div>

              {/* Prix */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-700 mb-4">Prix</h4>
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                  className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Plus populaire</option>
                  <option value="low-price">Prix croissant</option>
                  <option value="high-price">Prix décroissant</option>
                </select>
              </div>

              {/* Évaluations */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-700 mb-4">Évaluations</h4>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <motion.label
                    key={rating}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 cursor-pointer mb-2"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      onChange={() => setFilterRating(rating)}
                      checked={filterRating === rating}
                      className="form-radio text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                      {[...Array(rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                      ))}
                      {[...Array(5 - rating)].map((_, i) => (
                        <FaStar key={i + rating} className="text-gray-300 w-4 h-4" />
                      ))}
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Produits */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group relative border-2 border-blue-500"
              >
                <div className="relative h-[200px]">
                  <img
                    src={getImageUrl(product.images)}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-t-lg"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_IMAGE;
                    }}
                  />
                  
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

                  {/* Actions Overlay */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-colors"
                      title="Ajouter au panier"
                    >
                      <FaShoppingCart size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleWishlist(product)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                      title="Ajouter aux favoris"
                    >
                      <FaHeart className={state.wishlist.find((item) => item._id === product._id) ? "text-red-500" : ""} size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewProduct(product._id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-colors"
                      title="Voir le produit"
                    >
                      <FaEye size={16} />
                    </motion.button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 truncate">
                    {product.shortDescription || product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-blue-600">
                        {product.price.toLocaleString()} CFA
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-xs text-gray-500 line-through">
                          {product.compareAtPrice.toLocaleString()} CFA
                        </span>
                      )}
                    </div>
                    {product.rating > 0 && (
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" size={14} />
                        <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Bouton Acheter avec effet diagonal et logo */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden">
                    <div 
                      className="absolute bottom-0 right-0 w-28 h-28 bg-blue-600 transform rotate-45 translate-x-14 translate-y-6 hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <div className="absolute bottom-6 right-14 transform -rotate-45 flex flex-col items-center top-12">
                        <button
                          onClick={() => {
                            if (product.quantity > 0) {
                              handleBuyNow(product);
                            }
                          }}    
                          disabled={product.quantity === 0}
                          className={`text-white text-sm font-medium ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShopPage;
