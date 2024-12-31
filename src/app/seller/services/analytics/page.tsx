"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
 
  FaUsers, 
  FaMoneyBillWave,
  FaStar,
  FaCalendarCheck
} from 'react-icons/fa';

const { BASE_URL } = API_CONFIG;

interface ServiceAnalytics {
  overview: {
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    completionRate: number;
  };
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  bookingsByService: {
    serviceName: string;
    bookings: number;
  }[];
  customerSatisfaction: {
    rating: number;
    count: number;
  }[];
  popularTimeSlots: {
    hour: string;
    bookings: number;
  }[];
}

export default function ServiceAnalytics() {
//   const router = useRouter();
  const [analytics, setAnalytics] = useState<ServiceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des analytiques');
      }

      const data = await response.json();
      setAnalytics(data.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des analytiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytiques des services</h1>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded ${
                timeRange === range 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Réservations</p>
                <p className="text-2xl font-bold">{analytics.overview.totalBookings}</p>
              </div>
              <FaUsers className="text-2xl text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenus</p>
                <p className="text-2xl font-bold">
                  {analytics.overview.totalRevenue.toLocaleString()} FCFA
                </p>
              </div>
              <FaMoneyBillWave className="text-2xl text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Note moyenne</p>
                <p className="text-2xl font-bold">
                  {analytics.overview.averageRating.toFixed(1)}/5
                </p>
              </div>
              <FaStar className="text-2xl text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux de complétion</p>
                <p className="text-2xl font-bold">
                  {analytics.overview.completionRate}%
                </p>
              </div>
              <FaCalendarCheck className="text-2xl text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenus par mois */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus par mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    name="Revenus (FCFA)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Réservations par service */}
        <Card>
          <CardHeader>
            <CardTitle>Réservations par service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.bookingsByService}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="serviceName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="bookings" 
                    fill="#82ca9d" 
                    name="Nombre de réservations"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Satisfaction client */}
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.customerSatisfaction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="#ffc658" 
                    name="Nombre d'avis"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Créneaux horaires populaires */}
        <Card>
          <CardHeader>
            <CardTitle>Créneaux horaires populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.popularTimeSlots}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="bookings" 
                    fill="#8884d8" 
                    name="Nombre de réservations"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 