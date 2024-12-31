"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  
  FaMoneyBillWave, 
  FaShoppingBag, 
  FaUsers,

  FaStar 
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Stats {
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  topDishes: Array<{
    name: string;
    orders: number;
    revenue: number;
  }>;
  salesHistory: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  customerStats: {
    total: number;
    returning: number;
    newThisMonth: number;
  };
  ratings: {
    average: number;
    total: number;
    distribution: {
      [key: number]: number;
    };
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatsPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/stats?range=${timeRange}`
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Statistiques du Restaurant</h1>

      {/* Filtres de période */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {['daily', 'weekly', 'monthly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as typeof timeRange)}
              className={`px-4 py-2 rounded ${
                timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              {range === 'daily' ? 'Jour' : range === 'weekly' ? 'Semaine' : 'Mois'}
            </button>
          ))}
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Chiffre d'affaires</p>
              <h3 className="text-2xl font-bold">{stats.revenue[timeRange].toLocaleString()} CFA</h3>
            </div>
            <FaMoneyBillWave className="text-green-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Commandes</p>
              <h3 className="text-2xl font-bold">{stats.orders.total}</h3>
            </div>
            <FaShoppingBag className="text-blue-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Clients</p>
              <h3 className="text-2xl font-bold">{stats.customerStats.total}</h3>
            </div>
            <FaUsers className="text-purple-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Note moyenne</p>
              <h3 className="text-2xl font-bold">{stats.ratings.average.toFixed(1)}/5</h3>
            </div>
            <FaStar className="text-yellow-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Graphique des ventes */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Évolution des ventes</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.salesHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                name="Revenus"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#82ca9d"
                name="Commandes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Plats les plus vendus */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Plats les plus vendus</h2>
          <div className="space-y-4">
            {stats.topDishes.map((dish, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    {index + 1}
                  </span>
                  <span>{dish.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{dish.orders} commandes</div>
                  <div className="text-sm text-gray-500">{dish.revenue.toLocaleString()} CFA</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution des notes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Distribution des notes</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(stats.ratings.distribution).map(([rating, count]) => ({
                    name: `${rating} étoiles`,
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {Object.entries(stats.ratings.distribution).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage; 