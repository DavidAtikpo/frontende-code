"use client";

import { useState, useEffect } from "react";
import { UserStats } from "@/components/dashboard/user/UserStats";
import { RecentOrders } from "@/components/dashboard/user/RecentOrders";
import { RecentActivity } from "@/components/dashboard/user/RecentActivity";
import { FavoriteProducts } from "@/components/dashboard/user/FavoriteProducts";
import { API_CONFIG } from "@/utils/config";

const { BASE_URL } = API_CONFIG;

interface DashboardData {
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: Array<{
      name: string;
      quantity: number;
    }>;
  }>;
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
  stats: {
    totalOrders: number;
    favoriteCount: number;
    addressCount: number;
    reviewCount: number;
  };
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      setDashboardData(result.dashboard);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId })
      });
      
      if (response.ok) {
        // Mettre à jour les données du dashboard après la suppression
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error);
    }
  };

  if (isLoading || !dashboardData) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <UserStats stats={dashboardData.stats} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentOrders orders={dashboardData.recentOrders} />
        <RecentActivity activities={dashboardData.recentActivities} />
      </div>
      
      <FavoriteProducts 
        products={dashboardData.favoriteProducts}
        onRemove={handleRemoveFavorite}
      />
    </div>
  );
} 