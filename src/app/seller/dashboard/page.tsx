"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { 
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from "lucide-react";
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { RecentReviews } from "@/components/dashboard/RecentReviews";
import { SalesGoals } from "@/components/dashboard/SalesGoals";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { ActivePromotions } from "@/components/dashboard/ActivePromotions";
import { ReturnsOverview } from "@/components/dashboard/ReturnsOverview";
import { ProductPerformance } from "@/components/dashboard/ProductPerformance";
import { DeliveryStats } from "@/components/dashboard/DeliveryStats";
import { getCookie } from "cookies-next";


interface DashboardData {
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    minStock: number;
  }>;
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
  };
  salesTrend: Array<{
    date: string;
    revenue: number;
  }>;
  recentReviews: Array<{
    id: string;
    customerName: string;
    customerAvatar?: string;
    rating: number;
    comment: string;
    productName: string;
    createdAt: string;
  }>;
  salesGoals: Array<{
    label: string;
    current: number;
    target: number;
    unit: string;
  }>;
  recentMessages: Array<{
    id: string;
    customerName: string;
    customerAvatar?: string;
    content: string;
    createdAt: string;
    read: boolean;
  }>;
  activePromotions: Array<{
    id: string;
    name: string;
    type: 'percentage' | 'fixed_amount';
    value: number;
    startDate: string;
    endDate: string;
    usageCount: number;
    maxUses: number | null;
    minPurchase: number | null;
    products: Array<{
      id: string;
      name: string;
    }>;
  }>;
  returns: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    productName: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    refundAmount: number;
  }>;
  productStats: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    views: number;
    conversionRate: number;
    rating: number;
    stockLevel: number;
    trend: Array<{
      date: string;
      sales: number;
    }>;
  }>;
  deliveryStats: {
    inTransit: number;
    delivered: number;
    delayed: number;
    zones: Array<{
      name: string;
      count: number;
      avgTime: number;
    }>;
    metrics: {
      avgDeliveryTime: number;
      onTimeDeliveryRate: number;
      returnRate: number;
    };
  };
}

export default function DashboardPage() {
 
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/seller/dashboard`, {
        headers: {
          'Authorization': `Bearer ${getCookie('sellerToken')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setData(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "text-yellow-600",
      processing: "text-blue-600",
      completed: "text-green-600",
      cancelled: "text-red-600",
    };
    return colors[status as keyof typeof colors] || "text-gray-600";
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace vendeur
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chiffre d'affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.metrics.totalRevenue} FCFA
            </div>
            <div className={`flex items-center text-sm ${
              (data?.metrics?.revenueGrowth ?? 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {(data?.metrics?.revenueGrowth ?? 0) >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(data?.metrics?.revenueGrowth ?? 0)}% vs mois dernier
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.metrics.totalOrders}
            </div>
            <div className={`flex items-center text-sm ${
              (data?.metrics?.ordersGrowth ?? 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {(data?.metrics?.ordersGrowth ?? 0) >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(data?.metrics?.ordersGrowth ?? 0)}% vs mois dernier
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.metrics.totalCustomers}
            </div>
            <div className={`flex items-center text-sm ${
              (data?.metrics?.customersGrowth ?? 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {(data?.metrics?.customersGrowth ?? 0) >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(data?.metrics?.customersGrowth ?? 0)}% vs mois dernier
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.metrics.totalProducts}
            </div>
            <div className="text-sm text-muted-foreground">
              {data?.lowStockProducts.length} en stock faible
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    name="Revenus"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Commandes récentes</span>
                <Button variant="link" className="text-sm">
                  Voir tout
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">#{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customerName}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-right">
                        {order.total} FCFA
                      </div>
                      <div className={`text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                Alertes stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-red-600">
                      Stock: {product.stock} / {product.minStock}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentReviews reviews={data?.recentReviews ?? []} />
        <SalesGoals goals={data?.salesGoals ?? []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentMessages 
          messages={data?.recentMessages ?? []}
          onReply={(messageId) => {
            console.log('Répondre au message:', messageId);
          }}
        />
        <ActivePromotions promotions={data?.activePromotions ?? []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReturnsOverview 
          returns={data?.returns ?? []}
          onViewDetails={(returnId) => {
            console.log('Voir les détails du retour:', returnId);
          }}
        />
        <ProductPerformance products={data?.productStats ?? []} />
      </div>

      <div className="w-full lg:w-1/2">
        <DeliveryStats data={data?.deliveryStats ?? {
          inTransit: 0,
          delivered: 0,
          delayed: 0,
          zones: [],
          metrics: {
            avgDeliveryTime: 0,
            onTimeDeliveryRate: 0,
            returnRate: 0
          }
        }} />
      </div>
    </div>
  );
}


