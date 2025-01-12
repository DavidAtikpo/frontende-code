"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/app/context/CartContext';
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from '@/components/ui/use-toast';
import ProductImage from '@/app/components/ProductImage';

const { BASE_URL } = API_CONFIG;

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

const PaymentMethodPage = () => {
  const router = useRouter();
  const { state, dispatch } = useCartContext();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  useEffect(() => {
    // Récupérer l'adresse de livraison du localStorage
    const savedAddress = localStorage.getItem("shippingAddress");
    if (!savedAddress) {
      router.push("/checkout/shipping-address");
      return;
    }
    setShippingAddress(JSON.parse(savedAddress) as ShippingAddress);
  }, [router]);

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      const price = typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(String(item.finalPrice)) || 0;
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const createOrder = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify({
          items: state.cart,
          total: calculateTotal(),
          shippingAddress
        })
      });

      const data = await response.json();
      console.log('Réponse création commande:', data);

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la création de la commande");
      }

      // Extraire l'ID de la première commande du tableau orders
      const orderId = data.orders?.[0]?.orderId;
      console.log('OrderId extrait:', orderId);

      if (!orderId) {
        throw new Error("ID de commande non trouvé dans la réponse");
      }

      return orderId;
    } catch (error) {
      console.error('Erreur création commande:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const token = getCookie('token');
      
      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer un paiement",
          variant: "destructive"
        });
        router.push('/login');
        return;
      }

      // Créer la commande
      const orderId = await createOrder();

      // Initialiser le paiement
      const response = await fetch(`${BASE_URL}/api/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: calculateTotal(),
          orderId,
          paymentMethod: 'fedapay',
          currency: 'XOF'
        })
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // Vider le panier après création de la commande
        dispatch({ type: 'CLEAR_CART' });
        // Supprimer l'adresse de livraison du localStorage
        localStorage.removeItem("shippingAddress");
        localStorage.removeItem("hasShippingAddress");
        // Rediriger vers la page de paiement
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.message || "Erreur lors de l'initialisation du paiement");
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initialisation du paiement",
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