"use client";

import { useState, useEffect } from "react";
import { UserStats } from "@/components/dashboard/user/UserStats";
import RecentOrders from "@/components/dashboard/user/RecentOrders";
import { RecentActivity } from "@/components/dashboard/user/RecentActivity";
import { FavoriteProducts } from "@/components/dashboard/user/FavoriteProducts";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Order, OrderItem } from "@/types/order";

// const { BASE_URL } = API_CONFIG;

const BASE_URL = 'http://localhost:5000';

interface DashboardData {
  deliveredOrders: Order[];
  paidOrders: Order[];
  pendingOrders: Order[];
  recentReviews: Array<{
    id: string;
    productName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
  favoriteProducts: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  }>;
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
  }>;
  stats: {
    totalOrders: number;
    favoriteCount: number;
    addressCount: number;
    reviewCount: number;
    unreadNotifications: number;
  };
}

const defaultDashboardData: DashboardData = {
  deliveredOrders: [],
  paidOrders: [],
  pendingOrders: [],
  recentReviews: [],
  recentActivities: [],
  favoriteProducts: [],
  notifications: [],
  stats: {
    totalOrders: 0,
    favoriteCount: 0,
    addressCount: 0,
    reviewCount: 0,
    unreadNotifications: 0
  }
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(defaultDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = getCookie('token');
      console.log('Token:', token);

      const response = await axios.get(`${BASE_URL}/api/user/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Dashboard response:', response.data);

      if (response.data.success) {
        const { dashboard } = response.data;
        setDashboardData({
          deliveredOrders: dashboard.deliveredOrders || [],
          paidOrders: dashboard.paidOrders || [],
          pendingOrders: dashboard.pendingOrders || [],
          recentReviews: dashboard.recentReviews || [],
          recentActivities: dashboard.recentActivities || [],
          favoriteProducts: dashboard.favoriteProducts || [],
          notifications: dashboard.notifications || [],
          stats: {
            totalOrders: dashboard.stats.totalOrders || 0,
            favoriteCount: dashboard.stats.favoriteCount || 0,
            addressCount: dashboard.stats.addressCount || 0,
            reviewCount: dashboard.stats.reviewCount || 0,
            unreadNotifications: dashboard.stats.unreadNotifications || 0
          }
        });
      } else {
        setError("Erreur lors de la récupération des données");
        toast.error("Erreur lors de la récupération des données");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setError("Erreur lors du chargement des données");
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/favorites/toggle`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success("Favori mis à jour avec succès");
        fetchDashboardData(); // Rafraîchir les données
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du favori:", error);
      toast.error("Erreur lors de la mise à jour du favori");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      {dashboardData.notifications.length > 0 && (
        <div className="mb-4">
          {dashboardData.notifications.map(notif => (
            <div key={notif.id} className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-2">
              <h3 className="font-bold">{notif.title}</h3>
              <p>{notif.message}</p>
            </div>
          ))}
        </div>
      )}
      
      <UserStats stats={dashboardData.stats} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentOrders 
          deliveredOrders={dashboardData.deliveredOrders}
          paidOrders={dashboardData.paidOrders}
          pendingOrders={dashboardData.pendingOrders}
        />
        <RecentActivity activities={dashboardData.recentActivities} />
      </div>
      
      {dashboardData.favoriteProducts.length > 0 && (
        <FavoriteProducts 
          products={dashboardData.favoriteProducts}
          onRemove={handleRemoveFavorite}
        />
      )}
    </div>
  );
} 