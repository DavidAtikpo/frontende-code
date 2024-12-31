"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {

  FaClipboardList,
  FaCalendarAlt,
  FaStar,
  FaCog,
  FaMoneyBillWave
} from 'react-icons/fa';
import Link from 'next/link';
import { getCookie } from 'cookies-next';

interface DashboardStats {
  todayOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  todayReservations: number;
  pendingReservations: number;
  averageRating: number;
  popularDishes: Array<{
    name: string;
    orders: number;
  }>;
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    userName: string;
    date: string;
  }>;
}

const RestaurantDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const restaurantId = getCookie('restaurantId');

  useEffect(() => {
    if (!restaurantId) {
      router.push('/seller/restaurant/setup');
      return;
    }
    fetchDashboardStats();
  }, [restaurantId, router]);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/dashboard`
      );
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div>Chargement...</div>;
  }

  const DashboardCard = ({ title, value, icon: Icon, color, link }: any) => (
    <Link 
      href={link}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <Icon className={`text-3xl ${color}`} />
      </div>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tableau de Bord Restaurant</h1>
        <Link
          href="/seller/restaurant/settings"
          className="flex items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          <FaCog className="mr-2" />
          Paramètres
        </Link>
      </div>

      {/* Cartes statistiques */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Commandes du jour"
          value={stats.todayOrders}
          icon={FaClipboardList}
          color="text-blue-500"
          link="/seller/restaurant/orders"
        />
        <DashboardCard
          title="Chiffre d'affaires"
          value={`${stats.todayRevenue.toLocaleString()} CFA`}
          icon={FaMoneyBillWave}
          color="text-green-500"
          link="/seller/restaurant/stats"
        />
        <DashboardCard
          title="Réservations"
          value={stats.todayReservations}
          icon={FaCalendarAlt}
          color="text-purple-500"
          link="/seller/restaurant/reservations"
        />
        <DashboardCard
          title="Note moyenne"
          value={`${stats.averageRating.toFixed(1)}/5`}
          icon={FaStar}
          color="text-yellow-500"
          link="/seller/restaurant/reviews"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Commandes en attente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Commandes en attente</h2>
          <div className="space-y-4">
            {stats.pendingOrders === 0 ? (
              <p className="text-gray-500">Aucune commande en attente</p>
            ) : (
              <Link
                href="/seller/restaurant/orders"
                className="flex items-center justify-between p-4 bg-yellow-50 rounded hover:bg-yellow-100"
              >
                <span className="font-medium">{stats.pendingOrders} commandes à traiter</span>
                <FaClipboardList className="text-yellow-500" />
              </Link>
            )}
          </div>
        </div>

        {/* Réservations en attente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Réservations en attente</h2>
          <div className="space-y-4">
            {stats.pendingReservations === 0 ? (
              <p className="text-gray-500">Aucune réservation en attente</p>
            ) : (
              <Link
                href="/seller/restaurant/reservations"
                className="flex items-center justify-between p-4 bg-purple-50 rounded hover:bg-purple-100"
              >
                <span className="font-medium">{stats.pendingReservations} réservations à confirmer</span>
                <FaCalendarAlt className="text-purple-500" />
              </Link>
            )}
          </div>
        </div>

        {/* Plats populaires */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Plats populaires</h2>
          <div className="space-y-4">
            {stats.popularDishes.map((dish, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span>{dish.name}</span>
                </div>
                <span className="text-gray-500">{dish.orders} commandes</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avis récents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Derniers avis</h2>
          <div className="space-y-4">
            {stats.recentReviews.map(review => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.userName}</span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{review.rating}/5</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
            <Link
              href="/seller/restaurant/reviews"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Voir tous les avis →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard; 