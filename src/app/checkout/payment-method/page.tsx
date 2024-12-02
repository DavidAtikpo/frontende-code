"use client";

import React, { useState } from "react";
import { useCartContext } from "../../context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

// const BASE_URL = "https://dubon-server.vercel.app";
const BASE_URL = "http://localhost:5000";
const PaymentMethodPage = () => {
  const { state } = useCartContext();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('fedapay');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const calculateSubtotal = () =>
    state.cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
      const endpoint = `${BASE_URL}/api/payments/${paymentMethod}/create`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstname: shippingAddress.firstName,
            lastname: shippingAddress.lastName,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
          },
          amount: calculateSubtotal(),
          description: "Paiement commande Dubon Services",
          items: state.cart.map(item => ({
            productId: item._id,
            name: item.title,
            quantity: item.quantity,
            price: item.finalPrice,
          })),
          shipping_address: {
            address: shippingAddress.address,
            city: shippingAddress.city,
          },
          paymentMethod: paymentMethod
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'initialisation du paiement");
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("URL de paiement non reçue");
      }
    } catch (error) {
      console.error("Erreur de paiement:", error);
      setErrorMessage("Une erreur est survenue lors de l'initialisation du paiement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Méthode de paiement</h2>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <form onSubmit={handlePayment}>
          <div className="space-y-4 mb-6">
            <div className="flex items-center p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="fedapay"
                checked={paymentMethod === 'fedapay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio text-blue-600"
              />
              <div className="ml-4">
                <label className="font-medium">FedaPay</label>
                <p className="text-sm text-gray-500">Paiement sécurisé via FedaPay</p>
              </div>
              <Image 
                src="/images/fedapay.png" 
                alt="FedaPay" 
                width={120} 
                height={40} 
                className="ml-auto"
              />
            </div>

            <div className="flex items-center p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio text-blue-600"
              />
              <div className="ml-4">
                <label className="font-medium">Carte bancaire</label>
                <p className="text-sm text-gray-500">Visa, Mastercard, etc.</p>
              </div>
              <div className="ml-auto flex gap-2">
                <Image src="/visa.png" alt="Visa" width={40} height={25} />
                <Image src="/mastercard.png" alt="Mastercard" width={40} height={25} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Traitement..." : "Procéder au paiement"}
          </button>
        </form>
      </div>

      {/* Récapitulatif de la commande */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>
        <ul className="divide-y divide-gray-200">
          {state.cart.map((item) => (
            <li key={item._id} className="py-4 flex items-center">
              <Image
                src={Array.isArray(item.images) ? item.images[0] : item.images}
                alt={item.title}
                width={64}
                height={64}
                className="w-16 h-16 rounded-md object-cover mr-4"
              />
              <div className="flex-1">
                <h4 className="text-sm font-bold">{item.title}</h4>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {item.finalPrice.toFixed(2)} FCFA
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Sous-total</span>
            <span className="text-sm font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Livraison</span>
            <span className="text-sm font-bold">Gratuite</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage; 