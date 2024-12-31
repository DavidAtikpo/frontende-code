"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle
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

interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  bookingsByStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  eventsByType: Array<{
    type: string;
    count: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EventsDashboard = () => {
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('year');

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/stats?range=${dateRange}`
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
      <h1 className="text-2xl font-bold mb-8">Tableau de bord des événements</h1>

      {/* Cartes de statistiques */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total des événements</p>
              <p className="text-2xl font-bold">{stats.totalEvents}</p>
            </div>
            <FaCalendarAlt className="text-blue-500 text-3xl" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {stats.upcomingEvents} à venir
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Réservations</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <FaUsers className="text-green-500 text-3xl" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {stats.bookingsByStatus.confirmed} confirmées
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Revenus totaux</p>
              <p className="text-2xl font-bold">
                {stats.totalRevenue.toLocaleString()} CFA
              </p>
            </div>
            <FaMoneyBillWave className="text-yellow-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Note moyenne</p>
              <p className="text-2xl font-bold">
                {stats.averageRating.toFixed(1)} ★
              </p>
            </div>
            <FaChartLine className="text-purple-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Graphique des revenus */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Revenus mensuels</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  name="Revenus"
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#00C49F"
                  name="Réservations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique des types d'événements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Types d'événements</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.eventsByType}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.eventsByType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statut des réservations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Statut des réservations</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                <span>Confirmées</span>
              </div>
              <span className="font-medium">{stats.bookingsByStatus.confirmed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaTimesCircle className="text-red-500 mr-2" />
                <span>Annulées</span>
              </div>
              <span className="font-medium">{stats.bookingsByStatus.cancelled}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUsers className="text-blue-500 mr-2" />
                <span>En attente</span>
              </div>
              <span className="font-medium">{stats.bookingsByStatus.pending}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsDashboard; 