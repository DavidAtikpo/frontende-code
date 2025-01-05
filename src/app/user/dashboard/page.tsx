"use client";

import { useState, useEffect } from "react";
import { UserStats } from "@/components/dashboard/user/UserStats";
import { RecentOrders } from "@/components/dashboard/user/RecentOrders";
import { RecentActivity } from "@/components/dashboard/user/RecentActivity";
import { FavoriteProducts } from "@/components/dashboard/user/FavoriteProducts";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";

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

const defaultDashboardData: DashboardData = {
  recentOrders: [],
  recentReviews: [],
  recentActivities: [],
  favoriteProducts: [],
  stats: {
    totalOrders: 0,
    favoriteCount: 0,
    addressCount: 0,
    reviewCount: 0
  }
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(defaultDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [validationStatus, setValidationStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/dashboard`, {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
      });
      const result = await response.json();
      setDashboardData(result.dashboard || defaultDashboardData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setDashboardData(defaultDashboardData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Fetch or determine the validation status
    const status = localStorage.getItem('validationStatus');
    console.log("Validation Status from localStorage:", status); // Debugging line
    if (status) {
      setValidationStatus(status as 'pending' | 'approved' | 'rejected');
    }
  }, []);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`
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
      {validationStatus === 'pending' && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          Votre validation est en cours. Veuillez patienter.
        </div>
      )}
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