'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string | null;
  location: string | null;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/restaurants/seller/restaurants`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setRestaurants(response.data.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des restaurants:', err);
        setError('Erreur lors du chargement des restaurants');
        toast.error('Impossible de charger les restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleViewDishes = (restaurantId: string) => {
    router.push(`/seller/restaurant/${restaurantId}/dishes`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Link 
          href="/seller/dashboard"
          className="text-blue-500 hover:text-blue-700"
        >
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Restaurants</h1>
        <Link
          href="/seller/restaurant/add"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <FaPlus /> Ajouter un restaurant
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Vous n'avez pas encore de restaurant</p>
          <Link
            href="/seller/restaurant/add"
            className="text-blue-500 hover:text-blue-700"
          >
            Ajouter votre premier restaurant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={restaurant.coverImage || '/images/default-restaurant.jpg'}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-xl font-semibold text-white">{restaurant.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">{restaurant.description}</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📍 {restaurant.address}, {restaurant.city}</p>
                  <p>📞 {restaurant.phoneNumber}</p>
                  {restaurant.email && <p>✉️ {restaurant.email}</p>}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleViewDishes(restaurant.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Voir les plats
                  </button>
                  <div className="flex gap-2">
                    <Link
                      href={`/seller/restaurant/${restaurant.id}/edit`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Modifier
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 