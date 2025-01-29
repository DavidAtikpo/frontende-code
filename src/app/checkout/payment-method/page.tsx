"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/app/context/CartContext';
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from '@/components/ui/use-toast';
import ProductImage from '@/app/components/ProductImage';
const {BASE_URL} = API_CONFIG

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
      init(options: any): {
        open(): void;
      };
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
    const loadFedaPayScript = async () => {
      try {
        // Supprimer d'abord tout script existant
        const existingScripts = document.querySelectorAll('script[src*="fedapay"]');
        existingScripts.forEach((script: Element) => {
          if (script instanceof HTMLScriptElement) {
            script.remove();
          }
        });

        console.log('🔄 Début chargement script FedaPay');
        const script = document.createElement('script');
        script.src = 'https://cdn.fedapay.com/checkout.js?v=1.1.7';
        script.async = true;
        
        script.onload = () => {
          console.log('✅ Script FedaPay chargé avec succès');
          if (window.FedaPay) {
            console.log('🔍 FedaPay disponible:', {
              methods: Object.keys(window.FedaPay)
            });
            setScriptLoaded(true);
          } else {
            console.error('❌ window.FedaPay non disponible après chargement');
            setScriptLoaded(false);
          }
        };
        
        script.onerror = (error) => {
          console.error('❌ Erreur chargement script FedaPay:', error);
          setScriptLoaded(false);
        };

        document.body.appendChild(script);
        console.log('📝 Script ajouté au DOM');
      } catch (error) {
        console.error('❌ Erreur inattendue lors du chargement:', error);
        setScriptLoaded(false);
      }
    };

    if (!scriptLoaded) {
      loadFedaPayScript();
    }

    return () => {
      const scripts = document.querySelectorAll('script[src*="fedapay"]');
      scripts.forEach((script: Element) => {
        if (script instanceof HTMLScriptElement) {
          script.remove();
        }
      });
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

    const response = await fetch(`${BASE_URL}/api/orders`, {
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

      console.log('📦 Données panier:', {
        items: state.cart,
        total: calculateTotal()
      });

      const orderId = await createOrder();
      console.log('📝 Commande créée:', orderId);

      const paymentData = {
        amount: calculateTotal(),
        paymentMethod: 'fedapay',
        orderId
      };

      console.log('💳 Données paiement envoyées:', paymentData);

      const response = await fetch(`${BASE_URL}/api/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      console.log('🔄 Réponse du serveur:', data);
      
      if (data.success && scriptLoaded && window.FedaPay) {
        console.log('🔑 Configuration FedaPay avec:', {
          publicKey: data.publicKey,
          token: data.token
        });

        // Initialiser le widget FedaPay avec toutes les informations nécessaires
        const widget = window.FedaPay.init({
          public_key: data.publicKey,
          transaction: {
            amount: data.amount,
            description: data.description,
            token: data.token
          },
          customer: {
            email: shippingAddress?.email,
            firstname: shippingAddress?.firstName,
            lastname: shippingAddress?.lastName
          }
        });

        // Ouvrir directement la fenêtre de paiement
        widget.open();
        
        console.log('✅ Fenêtre de paiement FedaPay ouverte');
      } else {
        throw new Error(data.message || "Erreur d'initialisation du paiement");
      }
    } catch (error) {
      console.error('❌ Erreur de paiement:', error);
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Récapitulatif de la commande */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Récapitulatif de la commande</h2>
          
          {/* Adresse de livraison */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Adresse de livraison</h3>
            <p>{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
            <p>{shippingAddress?.address}</p>
            <p>{shippingAddress?.city}</p>
            <p>{shippingAddress?.phone}</p>
          </div>

          <div className="space-y-4">
            {(state.cart as CartItem[]).map((item) => (
              <div key={item._id} className="flex items-center space-x-4 border-b pb-4">
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
        </div>

        {/* Section Paiement */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Paiement</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">{calculateTotal()} FCFA</span>
            </div>

            {/* Conteneur FedaPay */}
            <div id="fedapay-container"></div>
            
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isProcessing ? "Traitement en cours..." : "Payer maintenant"}
            </button>
            
            <p className="text-sm text-gray-600 text-center mt-2">
              Paiement sécurisé par FedaPay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage; 