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
  FaTools,
  FaUsers,
  FaAward,
  FaCity
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;

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
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string | null;
  logo: string | null;
  coverImage: string | null;
  location: string | null;
  status: string;
  rating: number;
  seller: {
    id: string;
    name: string;
    email: string;
  };
}

interface Category {
  name: string;
  count: number;
  image: string;
}

const RestaurantPage = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    rating: ''
  });
  const [dubonResto, setDubonResto] = useState<Restaurant | null>(null);
  const [_selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [_cartItems, setCartItems] = useState<Dish[]>([]);
  const [_wishlist, setWishlist] = useState<Dish[]>([]);
  const [categories] = useState<Category[]>([
    {
      name: "Restaurants Traditionnels",
      count: 15,
      image: "https://res.cloudinary.com/dubonservice/image/upload/v1737727910/dubon/restaurants/u8cam6yikjddpr5pqpkn.jpg"
    },
    {
      name: "Fast Food",
      count: 12,
      image: "https://res.cloudinary.com/dubonservice/image/upload/v1737727910/dubon/restaurants/mrttdujebggqj2n5h9mx.jpg"
    },
    {
      name: "Cafés & Desserts",
      count: 8,
      image: "https://res.cloudinary.com/dubonservice/image/upload/v1737728156/dubon/restaurants/wcosk4c2isrsobvucidg.jpg"
    }
  ]);

  // Informations statiques
  const stats = {
    restaurantsPartenaires: "50+",
    villesCouvertes: "10+",
    clientsSatisfaits: "5000+",
    noteGlobale: "4.5"
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        console.log('Fetching restaurants...');
        const response = await axios.get(`${BASE_URL}/api/restaurants`);
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          const restaurantsData = response.data.data.map((restaurant: Restaurant) => ({
            ...restaurant,
            rating: restaurant.rating || 0
          }));
          console.log('Processed restaurants:', restaurantsData);
          setRestaurants(restaurantsData);
        } else {
          toast.error('Erreur: ' + response.data.message);
        }
      } catch (error) {
        console.error('Erreur complète:', error);
        toast.error('Erreur lors du chargement des restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = !filters.city || restaurant.city === filters.city;
    const matchesRating = !filters.rating || restaurant.rating >= Number(filters.rating);

    return matchesSearch && matchesCity && matchesRating;
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        <span className="text-blue-600 font-medium">Restaurants</span>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-96">
            <Image
              src="https://res.cloudinary.com/dubonservice/image/upload/v1737727556/dubon/restaurants/btsib5cllpqflqfaauvv.jpg"
              alt="Restaurants"
              width={1920}
              height={1080}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Découvrez les Meilleurs Restaurants
                </h1>
                <p className="text-xl mb-8">
                  Une sélection unique de restaurants pour tous les goûts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow text-center"
          >
            <FaUtensils className="text-3xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.restaurantsPartenaires}</div>
            <div className="text-sm text-gray-500">Restaurants Partenaires</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow text-center"
          >
            <FaCity className="text-3xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.villesCouvertes}</div>
            <div className="text-sm text-gray-500">Villes Couvertes</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow text-center"
          >
            <FaUsers className="text-3xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.clientsSatisfaits}</div>
            <div className="text-sm text-gray-500">Clients Satisfaits</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow text-center"
          >
            <FaStar className="text-3xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.noteGlobale}</div>
            <div className="text-sm text-gray-500">Note Globale</div>
          </motion.div>
        </div>

        {/* Catégories populaires */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Catégories Populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative h-48 rounded-lg overflow-hidden group"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  width={500}
                  height={300}
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm">{category.count} restaurants</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recherche et filtres existants */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-800 mb-4 md:mb-0"
          >
            Restaurants
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <select
                      value={filters.city}
                      onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Toutes les villes</option>
                      <option value="Abidjan">Abidjan</option>
                      <option value="Yamoussoukro">Yamoussoukro</option>
                      <option value="Bouaké">Bouaké</option>
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

        {/* Liste des restaurants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={restaurant.coverImage || '/images/default-restaurant.jpg'}
                    alt={restaurant.name}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                  {restaurant.status === 'featured' && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Recommandé
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    {restaurant.logo && (
                      <Image
                        src={restaurant.logo}
                        alt={`${restaurant.name} logo`}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500">{restaurant.city}</p>
                    </div>
                  </div>
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
                    <div className="flex items-center text-gray-500">
                      <FaMapMarkerAlt className="mr-1" />
                      <span className="text-sm">{restaurant.city}</span>
                    </div>
                  </div>
                  <Link
                    href={`/restaurant/${restaurant.id}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Voir le menu
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Aucun restaurant trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
