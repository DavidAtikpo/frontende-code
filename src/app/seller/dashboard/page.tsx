"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;
import { 
  FaStore, 
  FaUtensils, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaCog,
  FaChartLine,
  FaList,
  FaPlus,
  FaUser
} from 'react-icons/fa';

interface SellerProfile {
  businessType: 'products' | 'restaurant' | 'training' | 'events' | 'services';
  businessName: string;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageRating: number;
    pendingOrders: number;
    monthlyRevenue: number;
    totalProducts: number;
    viewsCount: number;
  };
}

const SellerDashboard = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/seller/profile`);
        if (response.data.success) {
          setProfile(response.data.data);
        }
      } catch (error) {
        console.error('Erreur chargement profil:', error);
        toast.error('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getActionButtons = () => {
    switch (profile?.businessType) {
      case 'products':
        return [
          { icon: FaPlus, label: 'Ajouter un produit', href: '/seller/products/add' },
          { icon: FaList, label: 'Mes produits', href: '/seller/products' },
          { icon: FaChartLine, label: 'Statistiques', href: '/seller/stats' }
        ];
      case 'restaurant':
        return [
          { icon: FaPlus, label: 'Ajouter un plat', href: '/seller/restaurant/add' },
          { icon: FaList, label: 'Menu', href: '/seller/restaurant/menu' },
          { icon: FaChartLine, label: 'Statistiques', href: '/seller/stats' }
        ];
      case 'training':
        return [
          { icon: FaPlus, label: 'Nouvelle formation', href: '/seller/training/add' },
          { icon: FaList, label: 'Mes formations', href: '/seller/training' },
          { icon: FaChartLine, label: 'Statistiques', href: '/seller/stats' }
        ];
      case 'events':
        return [
          { icon: FaPlus, label: 'Nouvel événement', href: '/seller/events/add' },
          { icon: FaList, label: 'Mes événements', href: '/seller/events' },
          { icon: FaChartLine, label: 'Statistiques', href: '/seller/stats' }
        ];
      case 'services':
        return [
          { icon: FaPlus, label: 'Ajouter un service', href: '/seller/services/add' },
          { icon: FaList, label: 'Mes services', href: '/seller/services' },
          { icon: FaChartLine, label: 'Statistiques', href: '/seller/stats' }
        ];
      default:
        return [];
    }
  };

  const getBusinessIcon = () => {
    switch (profile?.businessType) {
      case 'products': return FaStore;
      case 'restaurant': return FaUtensils;
      case 'training': return FaGraduationCap;
      case 'events': return FaCalendarAlt;
      default: return FaStore;
    }
  };

  const BusinessIcon = getBusinessIcon();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BusinessIcon className="h-12 w-12 text-blue-600" />
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{profile?.businessName}</h1>
              <p className="text-gray-600">
                {profile?.subscriptionStatus === 'trial' ? (
                  `Période d'essai jusqu'au ${profile.trialEndsAt ? new Date(profile.trialEndsAt).toLocaleDateString() : 'N/A'}`
                ) : (
                  `Abonnement actif jusqu'au ${profile?.subscriptionEndsAt ? new Date(profile.subscriptionEndsAt).toLocaleDateString() : 'N/A'}`
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/seller/settings')}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <FaCog className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {getActionButtons().map((action, index) => (
          <button
            key={index}
            onClick={() => router.push(action.href)}
            className="flex items-center justify-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <action.icon className="h-6 w-6 text-blue-600 mr-3" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Statistiques rapides */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Revenus du mois</h3>
            <FaChartLine className="text-blue-600 h-6 w-6" />
          </div>
          <p className="text-2xl font-bold">
            {profile?.stats.monthlyRevenue.toLocaleString()} FCFA
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total: {profile?.stats.totalRevenue.toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Commandes</h3>
            <FaList className="text-blue-600 h-6 w-6" />
          </div>
          <p className="text-2xl font-bold">{profile?.stats.totalOrders}</p>
          <p className="text-sm text-gray-500 mt-2">
            En attente: {profile?.stats.pendingOrders}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Clients</h3>
            <FaUser className="text-blue-600 h-6 w-6" />
          </div>
          <p className="text-2xl font-bold">{profile?.stats.totalCustomers}</p>
          <p className="text-sm text-gray-500 mt-2">
            Note moyenne: {profile?.stats.averageRating.toFixed(1)}/5
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">Catalogue</h3>
            <FaStore className="text-blue-600 h-6 w-6" />
          </div>
          <p className="text-2xl font-bold">{profile?.stats.totalProducts}</p>
          <p className="text-sm text-gray-500 mt-2">
            Vues: {profile?.stats.viewsCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;


