"use client";

import React, { useEffect, useState } from "react";
import { FaStar, FaHeart, FaShoppingCart, FaEye, FaFilter, FaSearch, FaHome, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/CartContext";
import Image from "next/image";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import Link from "next/link";

// const BASE_URL = "https://dubon-server.vercel.app";
const BASE_URL = "http://localhost:5000";
// Interface pour les produits
interface Product {
  _id: string;
  title: string;
  images: string[];
  category: string;
  price: number;
  rating: number;
  discount?: number;
  badge?: string;
}

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/product/get-all`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
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
      payload: { ...product, quantity: 1, finalPrice },
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
      };

      dispatch({
        type: "ADD_TO_WISHLIST",
        payload: wishlistItem,
      });
    }
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    let filtered = [...products];

    if (filterCategory) {
      filtered = filtered.filter((product) => product.category === filterCategory);
    }

    if (filterRating) {
      filtered = filtered.filter((product) => product.rating >= filterRating);
    }

    if (search) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "low-price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-price") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [filterCategory, filterRating, search, sortBy, products]);

  const handleCheckout = () => {
    const isAuthenticated = !!localStorage.getItem("token");
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      const hasShippingAddress =
        localStorage.getItem("hasShippingAddress") === "true";
      router.push(hasShippingAddress ? "/checkout" : "/checkout/shipping-address");
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {product.badge}
                    </span>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleWishlist(product)}
                      className="bg-white p-3 rounded-full hover:bg-gray-100"
                    >
                      <FaHeart className={`${
                        state.wishlist.find((item) => item._id === product._id)
                          ? "text-red-500"
                          : "text-gray-600"
                      }`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(product)}
                      className="bg-white p-3 rounded-full hover:bg-gray-100"
                    >
                      <FaShoppingCart className="text-blue-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewProduct(product._id)}
                      className="bg-white p-3 rounded-full hover:bg-gray-100"
                    >
                      <FaEye className="text-blue-600" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < product.rating ? "text-yellow-400" : "text-gray-300"
                        } w-4 h-4`}
                      />
                    ))}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      {product.price} CFA
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCheckout}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Acheter
                    </motion.button>
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
