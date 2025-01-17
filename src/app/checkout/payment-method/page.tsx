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
      init(): void;
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
        total: calculateTotal(),
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
      
      if (data.success && scriptLoaded) {
        const container = document.getElementById('fedapay-container');
        if (container) {
          const fedaPayButton = document.createElement('button');
          const buttonAttributes = {
            'data-public-key': data.publicKey,
            'data-transaction-token': data.token,
            'data-button-text': `Payer ${data.amount} FCFA`,
            'data-button-class': 'fedapay-button',
            'data-currency-iso': data.currency,
            'data-widget-description': 'Votre boutique africaine de confiance',
            'data-widget-image': '/images/logo.png',
            'data-widget-title': 'DUBON SERVICES'
          };

          Object.entries(buttonAttributes).forEach(([key, value]) => {
            fedaPayButton.setAttribute(key, value);
          });

          container.innerHTML = '';
          container.appendChild(fedaPayButton);
          window.FedaPay?.init();
        }
      } else {
        throw new Error(data.message || "Erreur d'initialisation du paiement");
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors du paiement",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!shippingAddress) {
    return null; // ou un loader
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Récapitulatif de la commande */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Récapitulatif de la commande</h2>
          
          {/* Adresse de livraison */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Adresse de livraison</h3>
            <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.city}</p>
            <p>{shippingAddress.phone}</p>
          </div>

          <div className="space-y-4">
            {state.cart.map((item) => (
              <div key={item._id} className="flex items-center space-x-4 border-b pb-4">
                <ProductImage
                  images={item.images}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">Quantité: {item.quantity}</p>
                  <p className="text-blue-600 font-bold">
                    {(typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(String(item.finalPrice)) || 0).toFixed(2)} FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Paiement */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Paiement</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">{calculateTotal().toFixed(2)} FCFA</span>
            </div>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Traitement..." : "Payer maintenant"}
            </button>
            <p className="text-sm text-gray-600 text-center mt-4">
              Paiement sécurisé par FedaPay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage; 