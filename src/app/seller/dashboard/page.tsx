"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getCookie } from 'cookies-next';
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
  FaUser,
  FaCogs,
  FaShoppingBag,
  FaClipboardList
} from 'react-icons/fa';
import type { SellerProfile } from '@/types/seller';

const SellerDashboard = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getCookie('token');
        const response = await axios.get(`${BASE_URL}/api/seller/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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
    return [
      // Produits
      { 
        icon: FaStore, 
        label: 'Gérer les produits', 
        href: '/seller/dashboard/products',
        description: 'Ajoutez et gérez vos produits physiques'
      },
      // Restaurant
      { 
        icon: FaUtensils, 
        label: 'Menu restaurant', 
        href: '/seller/restaurant/dashboard',
        description: 'Gérez votre menu et vos plats'
      },
      // Formations
      { 
        icon: FaGraduationCap, 
        label: 'Formations', 
        href: '/seller/training',
        description: 'Créez et gérez vos formations en ligne'
      },
      // Événements
      { 
        icon: FaCalendarAlt, 
        label: 'Événements', 
        href: '/seller/events',
        description: 'Organisez et gérez vos événements'
      },
      // Services
      { 
        icon: FaCogs, 
        label: 'Services', 
        href: '/seller/services',
        description: 'Proposez vos services professionnels'
      },
      // Commandes
      { 
        icon: FaShoppingBag, 
        label: 'Commandes', 
        href: '/seller/dashboard/orders',
        description: 'Gérez toutes vos commandes'
      },
      // Statistiques
      { 
        icon: FaChartLine, 
        label: 'Statistiques', 
        href: '/seller/dashboard/stats',
        description: 'Analysez vos performances'
      },
      // Catalogue
      { 
        icon: FaClipboardList, 
        label: 'Catalogue', 
        href: '/seller/dashboard/catalog',
        description: 'Gérez votre catalogue complet'
      }
    ];
  };

  const BusinessIcon = FaStore;

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <BusinessIcon className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
            <div className="ml-4">
              <h1 className="text-xl sm:text-2xl font-bold">{profile?.businessName}</h1>
              <p className="text-sm sm:text-base text-gray-600">
                {profile?.subscriptionStatus === 'trial' ? (
                  `Période d'essai jusqu'au ${profile.trialEndsAt ? new Date(profile.trialEndsAt).toLocaleDateString() : 'N/A'}`
                ) : (
                  `Abonnement actif jusqu'au ${profile?.subscriptionEndsAt ? new Date(profile.subscriptionEndsAt).toLocaleDateString() : 'N/A'}`
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {profile?.shop ? (
              <button
                onClick={() => router.push('/seller/dashboard/shop')}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <FaStore className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Voir ma boutique
              </button>
            ) : (
              <button
                onClick={() => router.push('/seller/settings')}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                <FaPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Créer ma boutique
              </button>
            )}
            <button
              onClick={() => router.push('/seller/settings')}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <FaCog className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {getActionButtons().map((action, index) => (
          <button
            key={index}
            onClick={() => router.push(action.href)}
            className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <action.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-2 sm:mb-3" />
            <span className="font-semibold text-gray-900 text-sm sm:text-base">{action.label}</span>
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-1 sm:mt-2">{action.description}</p>
          </button>
        ))}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base text-gray-500">Revenus du mois</h3>
            <FaChartLine className="text-blue-600 h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">
            {profile?.stats.monthlyRevenue.toLocaleString()} FCFA
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            Total: {profile?.stats.totalRevenue.toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base text-gray-500">Commandes</h3>
            <FaList className="text-blue-600 h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{profile?.stats.totalOrders}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            En attente: {profile?.stats.pendingOrders}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base text-gray-500">Clients</h3>
            <FaUser className="text-blue-600 h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{profile?.stats.totalCustomers}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            Note moyenne: {profile?.stats.averageRating.toFixed(1)}/5
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base text-gray-500">Catalogue</h3>
            <FaStore className="text-blue-600 h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{profile?.stats.totalProducts}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            Vues: {profile?.stats.viewsCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;