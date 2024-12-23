"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { DateRangePicker as DatePickerWithRange } from "@/components/ui/date-range-picker";
import { LoadingSpinner } from "@/components/ui/loading";
import { API_CONFIG } from "@/utils/config";
import { 
  BarChart, 
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { DateRange } from "react-day-picker";
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface Analytics {
  revenue: {
    total: number;
    byCategory: Array<{
      category: string;
      total: number;
    }>;
  };
  users: {
    newUsers: number;
    activeUsers: number;
  };
  orders: {
    count: number;
    averageValue: number;
  };
  products: {
    newProducts: number;
    outOfStock: number;
  };
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/analytics?` + 
        `startDate=${dateRange?.from?.toISOString()}&` +
        `endDate=${dateRange?.to?.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`,
          },
          credentials: 'include'
        }
      );
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analyses détaillées</h1>
        <DatePickerWithRange
          value={dateRange}
          onChange={handleDateRangeChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Revenus par catégorie */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Revenus par catégorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.revenue.byCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" name="Revenus" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Statistiques utilisateurs */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Activité utilisateurs</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {analytics?.users.newUsers}
              </p>
              <p className="text-sm text-gray-500">Nouveaux utilisateurs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {analytics?.users.activeUsers}
              </p>
              <p className="text-sm text-gray-500">Utilisateurs actifs</p>
            </div>
          </div>
        </Card>

        {/* Statistiques commandes */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Performance des commandes</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {analytics?.orders.count}
              </p>
              <p className="text-sm text-gray-500">Nombre de commandes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {analytics?.orders.averageValue.toLocaleString()} FCFA
              </p>
              <p className="text-sm text-gray-500">Panier moyen</p>
            </div>
          </div>
        </Card>

        {/* Statistiques produits */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">État des produits</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {analytics?.products.newProducts}
              </p>
              <p className="text-sm text-gray-500">Nouveaux produits</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {analytics?.products.outOfStock}
              </p>
              <p className="text-sm text-gray-500">Ruptures de stock</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 