"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  onSale: boolean;
  image: string;
}

const mockData: Restaurant[] = [
  {
    id: 1,
    name: "Grandioso Restaurant",
    description: "Livraison de plats au restaurant avec paiement en ligne",
    category: "Italien",
    price: 2000,
    rating: 4.8,
    onSale: true,
    image: "/images/restaurant1.jpg",
  },
  {
    id: 2,
    name: "Basilique Restaurant",
    description: "Réservation de restaurant en ligne - Livraison de repas",
    category: "Français",
    price: 1500,
    rating: 4.5,
    onSale: false,
    image: "/images/restaurant2.jpg",
  },
  {
    id: 3,
    name: "Fidalgo Restaurant",
    description: "Modèles élégants de bistrot, bar et café",
    category: "Fusion",
    price: 1500,
    rating: 4.0,
    onSale: false,
    image: "/images/restaurant3.jpg",
  },
];

const ERestaurantPage = () => {
  const [restaurants] = useState<Restaurant[]>(mockData);
  const [filters, setFilters] = useState({
    category: "Toutes les catégories",
    priceRange: [0, 100000],
    rating: 0,
    onSale: false,
  });

  const filteredRestaurants = restaurants.filter((restaurant) => {
    return (
      restaurant.price >= filters.priceRange[0] &&
      restaurant.price <= filters.priceRange[1] &&
      (filters.rating === 0 || restaurant.rating >= filters.rating) &&
      (!filters.onSale || restaurant.onSale)
    );
  });

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-10 gap-6">
      {/* Barre latérale */}
      <aside className="w-full lg:w-1/4 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-6">Filtrer et affiner</h3>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Catégorie</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="Toutes les catégories">Toutes les catégories</option>
            <option value="Italien">African</option>
            <option value="Français">Français</option>
            <option value="Fusion">Italien</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Prix (Max)</label>
          <input
            type="range"
            min="500"
            max="10000"
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: [0, Number(e.target.value)],
              }))
            }
            className="w-full"
          />
          <p className="text-sm text-gray-600">Max : {filters.priceRange[1]} CFA</p>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Notation</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filters.rating}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, rating: Number(e.target.value) }))
            }
          >
            <option value={0}>Toutes les notes</option>
            <option value={1}>1 étoile et plus</option>
            <option value={2}>2 étoiles et plus</option>
            <option value={3}>3 étoiles et plus</option>
            <option value={4}>4 étoiles et plus</option>
          </select>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, onSale: e.target.checked }))
              }
              className="mr-2"
            />
            En vente
          </label>
        </div>
      </aside>

      {/* Liste des restaurants */}
      <main className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {restaurant.description}
                </p>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 flex">
                    {Array.from(
                      { length: Math.round(restaurant.rating) },
                      (_, i) => (
                        <FaStar key={i} />
                      )
                    )}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({restaurant.rating})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold">{restaurant.price} CFA</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                    Voir plus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ERestaurantPage;
