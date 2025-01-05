"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SellerFormData } from "../page";

interface SubscriptionPlanFormProps {
  data: SellerFormData;
  onUpdate: (data: SellerFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

const plans = [
  {
    id: 'monthly',
    title: 'Abonnement Mensuel',
    price: 10000,
    features: [
      'Accès au dashboard vendeur',
      'Jusqu\'à 50 produits',
      'Support standard'
    ]
  },
  {
    id: 'yearly',
    title: 'Abonnement Annuel',
    price: 100000,
    features: [
      'Tout de l\'abonnement mensuel',
      'Jusqu\'à 200 produits',
      '2 mois gratuits'
    ]
  },
  {
    id: 'premium',
    title: 'Premium',
    price: 150000,
    features: [
      'Tout de l\'abonnement annuel',
      'Produits illimités',
      'Support prioritaire',
      'Badge vendeur premium'
    ]
  }
];

export function SubscriptionPlanForm({ data, onUpdate, onNext, onBack }: SubscriptionPlanFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load saved data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem('sellerFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      onUpdate(parsedData);
    }
  }, [onUpdate]);

  const handlePlanSelect = (planId: 'monthly' | 'yearly' | 'premium') => {
    const planMapping: Record<string, "premium" | "basic" | "standard"> = {
      monthly: "basic",
      yearly: "standard",
      premium: "premium"
    };

    const selectedPlan = plans.find(p => p.id === planId);
    if (selectedPlan) {
      const updatedData = {
        ...data,
        subscription: {
          plan: planMapping[planId],
          price: selectedPlan.price
        }
      };
      onUpdate(updatedData);
      // Save to local storage
      localStorage.setItem('sellerFormData', JSON.stringify(updatedData));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.subscription?.plan) {
      setError("Veuillez sélectionner un plan d'abonnement");
      return;
    }

    setLoading(true); // Set loading state

    try {
      const response = await fetch('/api/seller/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: data.subscription.plan,
          price: data.subscription.price,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement de l\'abonnement');
      }

      // Proceed to payment
      onNext();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`p-6 rounded-lg border ${
              data.subscription?.plan === plan.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200'
            }`}
          >
            <RadioGroup
              value={data.subscription?.plan}
              onValueChange={(value: 'monthly' | 'yearly' | 'premium') => 
                handlePlanSelect(value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={plan.id} id={plan.id} />
                <Label htmlFor={plan.id}>{plan.title}</Label>
              </div>
            </RadioGroup>
            
            <p className="mt-4 text-2xl font-bold">
              {plan.price.toLocaleString()} FCFA
            </p>
            
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      {loading && <p className="text-sm text-blue-500 text-center">En attente de validation...</p>}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit" className="bg-[#1D4ED8] hover:bg-[#1e40af]">
          Continuer vers le paiement
        </Button>
      </div>
    </form>
  );
} 