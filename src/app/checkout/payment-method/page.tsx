"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/app/context/CartContext';
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from '@/components/ui/use-toast';
import ProductImage from '@/app/components/ProductImage';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

interface CartItem {
  _id: string;
  title: string;
  finalPrice: number | string;
  quantity: number;
  images: string[];
}

declare global {
  interface Window {
    FedaPay: {
      init(options: any): void;
      checkout(options: any): void;
    };
  }
}

const PaymentMethodPage = () => {
  const router = useRouter();
  const { state } = useCartContext();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem("shippingAddress");
    if (!savedAddress) {
      router.push("/checkout/shipping-address");
      return;
    }
    try {
      setShippingAddress(JSON.parse(savedAddress));
    } catch (error) {
      console.error('Erreur parsing adresse:', error);
      router.push("/checkout/shipping-address");
    }
  }, [router]);

  useEffect(() => {
    const loadFedaPayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.fedapay.com/js/checkout.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    };

    if (!scriptLoaded) {
      loadFedaPayScript();
    }

    return () => {
      const script = document.querySelector('script[src="https://checkout.fedapay.com/js/checkout.js"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [scriptLoaded]);

  const calculateTotal = (): number => {
    return (state.cart as CartItem[]).reduce((total: number, item: CartItem) => {
      const price = typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(item.finalPrice) || 0;
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const createOrder = async (): Promise<string> => {
    const token = getCookie('token')?.toString();
    if (!token) throw new Error('Token non trouvé');

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: state.cart,
        shippingAddress
      })
    });

    const data = await response.json();
    if (!data.success || !data.orders?.[0]?.orderId) {
      throw new Error(data.message || "Erreur lors de la création de la commande");
    }

    return data.orders[0].orderId;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const token = getCookie('token')?.toString();
      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer un paiement",
          variant: "destructive"
        });
        router.push('/login');
        return;
      }

      const orderId = await createOrder();
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: calculateTotal(),
          paymentMethod: 'fedapay',
          orderId
        })
      });

      const data = await response.json();
      
      if (data.success && scriptLoaded && window.FedaPay) {
        window.FedaPay.checkout({
          public_key: data.publicKey,
          transaction: {
            amount: data.amount,
            description: data.description,
            currency: data.currency
          },
          customer: {
            email: shippingAddress?.email,
            firstname: shippingAddress?.firstName,
            lastname: shippingAddress?.lastName
          },
          widget_description: 'Votre boutique africaine de confiance',
          widget_image: '/images/logo.png',
          widget_title: 'DUBON SERVICES',
          transaction_token: data.token
        });
      } else {
        throw new Error(data.message || "Erreur d'initialisation du paiement");
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du paiement",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Méthode de paiement</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Récapitulatif de la commande</h2>
        <div className="space-y-4">
          {(state.cart as CartItem[]).map((item) => (
            <div key={item._id} className="flex items-center space-x-4">
              <div className="w-16 h-16 relative">
                <ProductImage images={item.images} alt={item.title} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-gray-600">Quantité: {item.quantity}</p>
                <p className="text-gray-600">Prix: {item.finalPrice} FCFA</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-xl">{calculateTotal()} FCFA</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Paiement</h2>
        <p className="mb-4">Choisissez votre méthode de paiement préférée</p>
        
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isProcessing ? "Traitement en cours..." : "Payer maintenant"}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodPage; 