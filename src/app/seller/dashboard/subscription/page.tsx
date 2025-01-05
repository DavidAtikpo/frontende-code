"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Pour démarrer votre activité',
    features: [
      'Jusqu\'à 50 produits',
      'Support client standard',
      'Statistiques de base',
      'Une seule boutique'
    ],
    pricing: {
      monthly: 5000,
      annual: 50000, // 2 mois gratuits
    }
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Pour les entreprises en croissance',
    features: [
      'Jusqu\'à 200 produits',
      'Support client prioritaire',
      'Statistiques avancées',
      'Jusqu\'à 2 boutiques',
      'Marketing automation'
    ],
    pricing: {
      monthly: 15000,
      annual: 150000, // 2 mois gratuits
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Pour les entreprises établies',
    features: [
      'Produits illimités',
      'Support client VIP',
      'Statistiques premium',
      'Boutiques illimitées',
      'Marketing automation',
      'API accès',
      'Account manager dédié'
    ],
    pricing: {
      monthly: 30000,
      annual: 300000, // 2 mois gratuits
    }
  }
];

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      toast.error('Veuillez sélectionner un plan.');
      return;
    }
    
    try {
      setLoading(true);
      const token = getCookie('token');
      
      if (!token) {
        toast.error('Vous devez être connecté pour vous abonner.');
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/seller/subscription/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          planId: selectedPlan,
          billingCycle: billingCycle,
          amount: plans.find(p => p.id === selectedPlan)?.pricing[billingCycle]
        })
      });

      const data = await response.json();
      
      if (data.success && data.paymentUrl) {
        // Redirection vers la page de paiement FedaPay
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.message || 'Erreur lors de l\'initiation du paiement');
      }
    } catch (error) {
      console.error('Erreur initiation paiement:', error);
      toast.error('Une erreur est survenue lors de l\'initiation du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Choisissez votre abonnement</h1>
      
      {/* Sélecteur de cycle de facturation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
            onClick={() => setBillingCycle('monthly')}
            className="rounded-lg"
          >
            Mensuel
          </Button>
          <Button
            variant={billingCycle === 'annual' ? 'default' : 'ghost'}
            onClick={() => setBillingCycle('annual')}
            className="rounded-lg"
          >
            Annuel (-20%)
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={cn(
              "p-6 relative cursor-pointer transition-all",
              selectedPlan === plan.id ? "border-2 border-blue-500 shadow-lg" : "hover:shadow-md"
            )}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {selectedPlan === plan.id && (
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
            
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-3xl font-bold mt-2">
              {plan.pricing[billingCycle].toLocaleString()} FCFA
              <span className="text-sm font-normal text-gray-600">
                /{billingCycle === 'monthly' ? 'mois' : 'an'}
              </span>
            </p>
            <p className="text-gray-600 mt-2">{plan.description}</p>
            
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <span className="mr-2 text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          size="lg"
          onClick={handleSubscribe}
          disabled={loading || !selectedPlan}
          className="min-w-[200px]"
        >
          {loading ? 'Chargement...' : 'Continuer vers le paiement'}
        </Button>
        {billingCycle === 'annual' && (
          <p className="text-sm text-gray-600 mt-2">
            Économisez 20% avec la facturation annuelle
          </p>
        )}
      </div>
    </div>
  );
} 