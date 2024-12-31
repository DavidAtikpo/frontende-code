"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaCrown, FaPercent, FaCheck } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;        

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: PlanFeature[];
  type: 'commission' | 'monthly' | 'biannual' | 'annual';
}

const plans: SubscriptionPlan[] = [
  {
    id: 'commission',
    name: 'Commission',
    price: 0,
    period: 'Par vente',
    type: 'commission',
    features: [
      { name: 'Commission de 10% sur les ventes', included: true },
      { name: 'Paiement uniquement sur les ventes réalisées', included: true },
      { name: 'Accès à toutes les fonctionnalités', included: true },
      { name: 'Support prioritaire', included: false },
      { name: 'Statistiques avancées', included: false }
    ]
  },
  {
    id: 'monthly',
    name: 'Mensuel',
    price: 15000,
    period: 'Par mois',
    type: 'monthly',
    features: [
      { name: 'Aucune commission sur les ventes', included: true },
      { name: 'Accès à toutes les fonctionnalités', included: true },
      { name: 'Support prioritaire', included: true },
      { name: 'Statistiques avancées', included: true },
      { name: 'Badge vendeur premium', included: true }
    ]
  },
  {
    id: 'biannual',
    name: 'Semestriel',
    price: 75000,
    period: '6 mois',
    type: 'biannual',
    features: [
      { name: 'Aucune commission sur les ventes', included: true },
      { name: 'Accès à toutes les fonctionnalités', included: true },
      { name: 'Support prioritaire', included: true },
      { name: 'Statistiques avancées', included: true },
      { name: 'Badge vendeur premium', included: true },
      { name: '2 mois gratuits', included: true }
    ]
  },
  {
    id: 'annual',
    name: 'Annuel',
    price: 120000,
    period: 'Par an',
    type: 'annual',
    features: [
      { name: 'Aucune commission sur les ventes', included: true },
      { name: 'Accès à toutes les fonctionnalités', included: true },
      { name: 'Support prioritaire', included: true },
      { name: 'Statistiques avancées', included: true },
      { name: 'Badge vendeur premium', included: true },
      { name: '4 mois gratuits', included: true },
      { name: 'Formation vendeur offerte', included: true }
    ]
  }
];

const SubscriptionPage = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      setLoading(true);
      
      // Simuler un paiement ici
      // En production, intégrer la passerelle de paiement

      const response = await axios.post(
        `${BASE_URL}/api/seller-request/activate-subscription`,
        {
          plan: plan.type
        }
      );

      if (response.data.success) {
        toast.success('Abonnement activé avec succès');
        router.push('/seller/dashboard');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'activation de l\'abonnement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choisissez votre plan</h1>
        <p className="text-gray-600">
          Commencez avec une semaine d'essai gratuit, puis choisissez le plan qui vous convient
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => handlePlanSelect(plan.id)}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${
              selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="p-6">
              <div className="text-center">
                {plan.type === 'commission' ? (
                  <FaPercent className="mx-auto h-12 w-12 text-blue-600" />
                ) : (
                  <FaCrown className="mx-auto h-12 w-12 text-blue-600" />
                )}
                <h2 className="mt-4 text-2xl font-semibold">{plan.name}</h2>
                <p className="mt-2 text-gray-600">{plan.period}</p>
                <p className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? '10%' : `${plan.price.toLocaleString()} CFA`}
                  </span>
                </p>
              </div>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className={`mt-1 ${
                      feature.included ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <span className="ml-3 text-gray-600">{feature.name}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
                className="mt-8 w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Chargement...' : 'Choisir ce plan'}
              </button>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-600">
        <p>
          Une semaine d'essai gratuit est incluse avec tous nos plans.
          <br />
          Annulez à tout moment pendant la période d'essai.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage; 