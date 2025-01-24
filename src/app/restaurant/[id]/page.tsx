"use client";

import React, { useState, useEffect } from "react";
import { 
  FaHome, 
  FaChevronRight, 
  FaStar, 
  FaUtensils, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaUsers,
  FaHeart,
  FaShoppingBag
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { useParams } from "next/navigation";

interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  price: number;
  image: string;
  preparationTime: number;
  isAvailable: boolean;
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
    SellerProfile: {
      storeName: string;
      logo: string;
    };
  };
}

export default function RestaurantDetailsPage() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');

  // Informations statiques
  const stats = {
    clientsSatisfaits: "2000+",
    commandesLivrees: "5000+",
    anneesExperience: "5+",
    noteGoogle: "4.8"
  };

  const specialites = [
    "Cuisine traditionnelle",
    "Plats végétariens",
    "Desserts maison",
    "Cocktails signature"
  ];

  const horaires = {
    "Lundi": "10:00 - 22:00",
    "Mardi": "10:00 - 22:00",
    "Mercredi": "10:00 - 22:00",
    "Jeudi": "10:00 - 22:00",
    "Vendredi": "10:00 - 23:00",
    "Samedi": "11:00 - 23:00",
    "Dimanche": "11:00 - 22:00"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restaurantRes, dishesRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/restaurants/restaurant/${params.id}`),
          axios.get(`${BASE_URL}/api/restaurants/${params.id}/dishes`)
        ]);
        
        if (restaurantRes.data.success) {
          setRestaurant(restaurantRes.data.data);
        }
        if (dishesRes.data.success) {
          setDishes(dishesRes.data.data);
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Restaurant non trouvé</h1>
        <Link 
          href="/restaurant"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Retour à la liste des restaurants
        </Link>
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
        <Link href="/restaurant" className="hover:text-blue-600 transition-colors">
          Restaurants
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">{restaurant.name}</span>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du restaurant */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-[400px] w-full">
            <Image
              src={restaurant.coverImage || '/images/default-restaurant.jpg'}
              alt={restaurant.name}
              width={1920}
              height={1080}
              className="object-cover w-full h-full"
              priority
            />
            {restaurant.status === 'featured' && (
              <div className="absolute top-4 left-4">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Restaurant Recommandé
                </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
              <div className="flex items-center mb-4">
                {restaurant.logo && (
                  <Image
                    src={restaurant.logo}
                    alt={`${restaurant.name} logo`}
                    width={80}
                    height={80}
                    className="rounded-full mr-6 border-2 border-white"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{restaurant.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < Math.round(restaurant.rating) ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-white">({restaurant.rating})</span>
                    </div>
                    <span className="text-white/60">|</span>
                    <span className="text-white">{restaurant.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <p className="text-gray-700 text-lg mb-8">{restaurant.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Informations</h2>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="w-5 h-5 mr-3" />
                  <span>{restaurant.address}</span>
                </div>
                {restaurant.phoneNumber && (
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="w-5 h-5 mr-3" />
                    <span>{restaurant.phoneNumber}</span>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="w-5 h-5 mr-3" />
                    <span>{restaurant.email}</span>
                  </div>
                )}
              </div>

              {restaurant.location && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Localisation</h2>
                  <a 
                    href={restaurant.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    Voir sur Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <FaUsers className="text-3xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.clientsSatisfaits}</div>
            <div className="text-sm text-gray-500">Clients satisfaits</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <FaShoppingBag className="text-3xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.commandesLivrees}</div>
            <div className="text-sm text-gray-500">Commandes livrées</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <FaClock className="text-3xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.anneesExperience}</div>
            <div className="text-sm text-gray-500">Années d'expérience</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <FaStar className="text-3xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.noteGoogle}</div>
            <div className="text-sm text-gray-500">Note Google</div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'menu'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab('infos')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'infos'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Informations
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'menu' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dishes.map((dish) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <div className="relative h-48 mb-4">
                      <Image
                        src={dish.image || '/images/default-dish.jpg'}
                        alt={dish.name}
                        width={500}
                        height={300}
                        className="object-cover rounded-lg w-full h-full"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{dish.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{dish.description}</p>
                    <span className="text-sm text-gray-500">{dish.ingredients} </span>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">{dish.price} FCFA</span>
                      <span className="text-sm text-gray-500">{dish.preparationTime} min</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Spécialités */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Nos spécialités</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {specialites.map((specialite, index) => (
                      <div key={index} className="flex items-center">
                        <FaUtensils className="text-blue-500 mr-2" />
                        <span>{specialite}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Horaires */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Horaires d'ouverture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(horaires).map(([jour, heures]) => (
                      <div key={jour} className="flex justify-between">
                        <span className="font-medium">{jour}</span>
                        <span>{heures}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Localisation */}
                {restaurant?.location && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Localisation</h3>
                    <a
                      href={restaurant.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg"
                    >
                      <FaMapMarkerAlt className="mr-2" />
                      Voir sur Google Maps
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 