"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Users, ShoppingBag, Store, Clock } from 'lucide-react';
import { getApiUrl } from '@/utils/api';

const BASE_URL = getApiUrl();
// const BASE_URL = 'http://localhost:3000';

interface DashboardStats {
  users: {
    total: number;
    regular: number;
    sellers: number;
  };
  pendingRequests: number;
  totalOrders: number;
  revenue: {
    total: number;
    weekly: number;
    monthly: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Vérifier l'authentification admin avec les cookies
    const adminToken = document.cookie.includes('adminToken=');
    const userRole = document.cookie.split(';').find(c => c.trim().startsWith('userRole='));
    const isAdmin = userRole?.includes('admin');

    if (!adminToken || !isAdmin) {
      router.replace('/adminLogin');
      return;
    }

    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      const adminToken = document.cookie
        .split(';')
        .find(c => c.trim().startsWith('adminToken='))
        ?.split('=')[1];

      const response = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        // Si la réponse n'est pas ok, vérifier si c'est un problème d'authentification
        if (response.status === 401) {
          router.replace('/adminLogin');
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
            <p className="text-sm text-gray-500">Réguliers: {stats?.users.regular || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Vendeurs
            </CardTitle>
            <Store className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.sellers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Demandes en attente
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingRequests || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Commandes totales
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-sm text-gray-500">
              Revenu total: {stats?.revenue.total.toLocaleString()} FCFA
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 