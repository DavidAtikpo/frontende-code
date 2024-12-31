"use client";

import React, { useState, useEffect } from "react";
import { 
  FaHome, 
  FaChevronRight, 
  FaStar, 
  FaUtensils, 
  FaMapMarkerAlt, 
  FaClock, 
  FaHeart, 
  FaShoppingCart, 
  FaBars,
  FaSearch,
  FaFilter,
  FaTools
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const BASE_URL = "https://dubon-server.onrender.com";

interface Dish {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable?: boolean;
  preparationTime?: string;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
}

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  onSale: boolean;
  image: string;
  isDubonResto?: boolean;
  cuisine?: string[];
  address?: string;
  openingHours?: string;
  dishes: Dish[];
  phoneNumber?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const RestaurantPage = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    restaurantType: '',
    dishCategory: '',
    priceRange: '',
    rating: '',
    onSale: false
  });
  const [dubonResto, setDubonResto] = useState<Restaurant | null>(null);
  const [_selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [_cartItems, setCartItems] = useState<Dish[]>([]);
  const [_wishlist, setWishlist] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restaurantsRes, categoriesRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/restaurants`),
          axios.get(`${BASE_URL}/api/restaurants/categories`)
        ]);

        if (Array.isArray(restaurantsRes.data)) {
          const dubonRestoData = restaurantsRes.data.find((r: Restaurant) => r.isDubonResto);
          const otherRestaurants = restaurantsRes.data.filter((r: Restaurant) => !r.isDubonResto);
          
          setDubonResto(dubonRestoData || null);
          setRestaurants(otherRestaurants);
          setSelectedRestaurant(dubonRestoData || null);
        }

        if (Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !filters.restaurantType || restaurant.category === filters.restaurantType;
    
    const matchesPrice = !filters.priceRange || (() => {
      const [min, max] = filters.priceRange.split('-').map(Number);
      return restaurant.price >= min && (!max || restaurant.price <= max);
    })();

    const matchesRating = !filters.rating || restaurant.rating >= Number(filters.rating);

    const matchesSale = !filters.onSale || restaurant.onSale;

    return matchesSearch && matchesType && matchesPrice && matchesRating && matchesSale;
  });

  const _handleAddToCart = (dish: Dish) => {
    setCartItems(prev => [...prev, dish]);
    toast.success('Plat ajouté au panier');
  };

  const _handleAddToWishlist = (dish: Dish) => {
    setWishlist(prev => [...prev, dish]);
    toast.success('Plat ajouté aux favoris');
  };

  const _handleBuyNow = (dish: Dish) => {
    router.push(`/checkout?dishId=${dish._id}`);
  };

  const ComingSoonCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-8 rounded-xl shadow-lg text-center"
    >
      <div className="text-6xl text-blue-600 mb-4 mx-auto">
        <FaTools className="mx-auto" />
      </div>
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">Bientôt disponible</h3>
      <p className="text-gray-600">Notre restaurant sera bientôt disponible</p>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-white px-4 py-3 rounded-lg shadow-sm mx-4 sm:mx-6 lg:mx-8 mt-4"
      >
        <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
          <FaHome className="mr-1" />
          Accueil
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">Restaurant</span>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête et recherche */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-800 mb-4 md:mb-0"
          >
            Nos Restaurants
          </motion.h1>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Rechercher un restaurant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaFilter className="mr-2" />
              Filtres
            </button>
          </div>
        </div>

        {/* Filtres */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de restaurant
                    </label>
                    <select
                      value={filters.restaurantType}
                      onChange={(e) => setFilters(prev => ({ ...prev, restaurantType: e.target.value }))}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Tous les types</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fourchette de prix
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Tous les prix</option>
                      <option value="0-5000">0 - 5,000 CFA</option>
                      <option value="5000-10000">5,000 - 10,000 CFA</option>
                      <option value="10000-20000">10,000 - 20,000 CFA</option>
                      <option value="20000">20,000+ CFA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note minimale
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Toutes les notes</option>
                      <option value="4">4+ étoiles</option>
                      <option value="3">3+ étoiles</option>
                      <option value="2">2+ étoiles</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dubon Restaurant */}
        {dubonResto ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Notre Restaurant</h2>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-xl">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 relative h-64 md:h-auto">
                    <Image
                      src={dubonResto.image || '/default-restaurant.jpg'}
                      alt={dubonResto.name}
                      width={500}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-blue-600">{dubonResto.name}</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Restaurant Officiel
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6">{dubonResto.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {dubonResto.cuisine && (
                        <div className="flex items-center text-gray-600">
                          <FaUtensils className="mr-2" />
                          <span>{dubonResto.cuisine.join(', ')}</span>
                        </div>
                      )}
                      {dubonResto.address && (
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{dubonResto.address}</span>
                        </div>
                      )}
                      {dubonResto.openingHours && (
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-2" />
                          <span>{dubonResto.openingHours}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < Math.round(dubonResto.rating) ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600">({dubonResto.rating})</span>
                      </div>
                    </div>
                    <Link 
                      href={`/restaurant/${dubonResto._id}`}
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Voir le menu
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Liste des restaurants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <motion.div
                key={restaurant._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={restaurant.image || '/default-restaurant.jpg'}
                    alt={restaurant.name}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                  {restaurant.onSale && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Promotion
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < Math.round(restaurant.rating) ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {restaurant.cuisine?.join(', ')}
                    </span>
                  </div>
                  <Link
                    href={`/restaurant/${restaurant._id}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Voir le menu
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <ComingSoonCard />
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
