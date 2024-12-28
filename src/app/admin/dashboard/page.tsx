"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Users, ShoppingBag, Package, DollarSign } from 'lucide-react';
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface DashboardStats {
  users: { 
    total: number;
    new: number;
  };
  sellers: {
    total: number;
    pending: number;
  };
  products: {
    total: number;
  };
  orders: {
    total: number;
    today: number;
  };
  revenue: {
    total: number;
    today: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const token = getCookie('token');
      console.log('token', token);

      const response = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('response', response);

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/adminLogin');
          return;
        }
        throw new Error("Erreur lors du chargement des statistiques");
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = getCookie('token');
    const userRole = getCookie('role');

    if (!token || userRole !== 'admin') {
      router.replace('/adminLogin');
      return;
    }

    fetchDashboardStats();
  }, [fetchDashboardStats, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Tableau de bord</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Utilisateurs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
            <p className="text-sm text-gray-500">
              +{stats?.users.new || 0} aujourd'hui
            </p>
          </CardContent>
        </Card>

        {/* Vendeurs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Vendeurs
            </CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sellers.total || 0}</div>
            <p className="text-sm text-orange-500">
              {stats?.sellers.pending || 0} en attente
            </p>
          </CardContent>
        </Card>

        {/* Commandes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Commandes
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orders.total || 0}</div>
            <p className="text-sm text-green-500">
              +{stats?.orders.today || 0} aujourd'hui
            </p>
          </CardContent>
        </Card>

        {/* Revenus */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Revenus
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.revenue.total.toLocaleString()} FCFA
            </div>
            <p className="text-sm text-green-500">
              +{stats?.revenue.today.toLocaleString()} FCFA aujourd'hui
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Autres statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.products.total || 0} produits
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 