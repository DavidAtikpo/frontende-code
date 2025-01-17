"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone } from "lucide-react";
import { SellerFormData } from "../page";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Définir une interface pour la configuration FedaPay
interface FedaPayConfig {
  public_key: string;
  transaction: {
    amount: number;
    description: string;
  };
  customer: {
    email: string;
    firstname?: string;
    lastname?: string;
  };
}

interface FedaPayInstance {
  init: (config: FedaPayConfig) => void;
  // ... autres méthodes FedaPay
}

declare global {
  interface Window {
    FedaPay: {
      init(): void;
    };
  }
}

interface PaymentFormProps {
  data: SellerFormData;
  onUpdate: (data: SellerFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

const paymentMethods = [
  {
    id: 'mobile_money',
    title: 'Mobile Money',
    icon: Smartphone,
    providers: ['Orange Money', 'MTN Mobile Money', 'Moov Money']
  },
  {
    id: 'card',
    title: 'Carte bancaire',
    icon: CreditCard,
    providers: ['Visa', 'Mastercard']
  }
];

interface PaymentError {
  message: string;
  code?: string;
  details?: unknown;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

type PaymentMethodType = 'mobile_money' | 'card' | 'bank_transfer';

export const PaymentForm: React.FC<PaymentFormProps> = ({ data, onUpdate, onNext, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | ''>('');
  const [loading, setLoading] = useState(false);

  // Initialiser FedaPay
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.fedapay.com/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/payments/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result: PaymentResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Échec du paiement');
      }

      onNext();
    } catch (err) {
      const error = err as PaymentError;
      console.error("Erreur de paiement:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Utiliser handlePaymentUpdate dans la gestion des méthodes de paiement
  const handleMethodChange = (method: PaymentMethodType) => {
    setSelectedMethod(method);
    onUpdate({
      ...data,
      payment: {
        ...data.payment,
        method,
        status: 'pending',
        amount: data.subscription?.price || 0
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Récapitulatif</h3>
        <p className="text-sm text-gray-600">
          Plan sélectionné : {data.subscription?.plan}
        </p>
        <p className="text-lg font-bold text-blue-600">
          Montant à payer : {data.subscription?.price?.toLocaleString()} FCFA
        </p>
      </div>

      <div className="space-y-6">
        {/* Méthodes de paiement */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Choisissez votre méthode de paiement
          </h3>
          <RadioGroup
            value={selectedMethod}
            onValueChange={handleMethodChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 rounded-lg border cursor-pointer ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  className="hidden"
                />
                <Label
                  htmlFor={method.id}
                  className="cursor-pointer flex items-center space-x-3"
                >
                  <method.icon className="w-5 h-5" />
                  <span>{method.title}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Conteneur FedaPay */}
        <div id="fedapay-container"></div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            Retour
          </Button>
          <Button
            type="submit"
            className="bg-[#1D4ED8] hover:bg-[#1e40af]"
            disabled={!selectedMethod || loading}
          >
            {loading ? "Traitement..." : "Procéder au paiement"}
          </Button>
        </div>
      </div>
    </form>
  );
}; 