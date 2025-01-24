'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  preparationTime: number;
  ingredients: string;
  isSpicy: boolean;
  isVegetarian: boolean;
  isPromoted: boolean;
  promotionalPrice: number | null;
  isAvailable: boolean;
}

export default function RestaurantDishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const restaurantId = params.restaurantId as string;

  useEffect(() => {
    const fetchDishes = async () => {
      if (!restaurantId) {
        setError('ID du restaurant manquant');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${BASE_URL}/api/restaurants/${restaurantId}/dishes`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          setDishes(response.data.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des plats:', err);
        setError('Erreur lors du chargement des plats');
        toast.error('Impossible de charger les plats');
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [restaurantId]);

  const handleDelete = async (dishId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${BASE_URL}/api/restaurants/${restaurantId}/dishes/${dishId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setDishes(dishes.filter(dish => dish.id !== dishId));
      toast.success('Plat supprimé avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression du plat');
    }
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
        <h1 className="text-2xl font-bold">Gestion des Plats</h1>
        <Link
          href={`/seller/restaurant/${restaurantId}/dishes/add`}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <FaPlus /> Ajouter un plat
        </Link>
      </div>

      {dishes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Aucun plat n'a été ajouté</p>
          <Link
            href={`/seller/restaurant/${restaurantId}/dishes/add`}
            className="text-blue-500 hover:text-blue-700"
          >
            Ajouter votre premier plat
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={dish.image || '/images/default-dish.jpg'}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
                {dish.isPromoted && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                    Promotion
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                <p className="text-gray-600 mb-2">{dish.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">
                    {dish.isPromoted && dish.promotionalPrice
                      ? `${dish.promotionalPrice} FCFA`
                      : `${dish.price} FCFA`}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    dish.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {dish.isAvailable ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    {dish.isSpicy && (
                      <span className="text-red-500" title="Épicé">🌶️</span>
                    )}
                    {dish.isVegetarian && (
                      <span className="text-green-500" title="Végétarien">🥬</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/seller/restaurant/${restaurantId}/dishes/${dish.id}/edit`}
                      className="p-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaPencilAlt />
                    </Link>
                    <button
                      onClick={() => handleDelete(dish.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
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