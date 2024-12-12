"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/dashboard/ProductDialog";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { DollarSign, ArrowUp, ArrowDown, Plus } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface DashboardStats {
  revenue: {
    total: number;
    change: number;
    trend: "up" | "down";
    percentage: number;
  };
  orders: {
    total: number;
    change: number;
    pending: number;
    trend: "up" | "down";
    percentage: number;
  };
  products: {
    total: number;
    active: number;
  };
  customers: {
    total: number;
    new: number;
  };
}

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchDashboardStats = async () => {
    try {
      let token = '';
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token') || '';
      }

      const response = await fetch(`${BASE_URL}/api/seller/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Carte Chiffre d'affaires */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Chiffre d&apos;affaires
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.revenue?.total.toLocaleString()} €</div>
            <div className="flex items-center pt-1">
              {stats?.revenue?.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs ${stats?.revenue?.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stats?.revenue?.percentage}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        {/* Carte Commandes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Commandes</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orders?.total.toLocaleString()}</div>
            <div className="flex items-center pt-1">
              {stats?.orders?.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs ${stats?.orders?.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stats?.orders?.percentage}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        {/* Carte Produits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.products?.active} / {stats?.products?.total}</div>
          </CardContent>
        </Card>

        {/* Carte Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.customers?.total.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{stats?.customers?.new} nouveaux ce mois-ci</div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique et Tableau */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ventes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSalesTable />
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour ajouter un produit */}
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          // Implémentez un rafraîchissement des données si nécessaire
          console.log("Produit ajouté !");
        }}
      />
    </div>
  );
}


