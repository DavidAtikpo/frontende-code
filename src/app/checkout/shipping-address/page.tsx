"use client";

import React, { useState } from "react";
import { useCartContext } from "../../context/CartContext";
import Image from "next/image";

const BASE_URL = "http://localhost:5000";

const CheckoutPage = () => {
  const { state } = useCartContext(); // Utilisation du contexte pour le panier
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState('fedapay'); // Ajout du state pour la méthode de paiement

  const calculateSubtotal = () =>
    state.cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Mise à jour de la validation pour inclure la ville
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.city) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);

    try {
      // Modification de l'endpoint en fonction de la méthode de paiement
      const endpoint = `${BASE_URL}/api/payments/${paymentMethod}/create`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstname: formData.firstName,
            lastname: formData.lastName,
            email: formData.email,
            phone: formData.phone,
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
            address: formData.address,
            city: formData.city,
          },
          paymentMethod: paymentMethod
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'initialisation du paiement");
      }

      // Redirection selon la méthode de paiement
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else if (data.paypalUrl) {
        window.location.href = data.paypalUrl;
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
      {/* Section Informations Client */}
      <form className="col-span-2 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Informations</h2>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            value={formData.firstName}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={formData.lastName}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleInputChange}
          className="border p-2 rounded-md w-full"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Numéro de téléphone"
          value={formData.phone}
          onChange={handleInputChange}
          className="border p-2 rounded-md w-full"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Adresse"
          value={formData.address}
          onChange={handleInputChange}
          className="border p-2 rounded-md w-full mb-4"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="Ville"
          value={formData.city}
          onChange={handleInputChange}
          className="border p-2 rounded-md w-full mb-4"
          required
        />
        <textarea
          name="notes"
          placeholder="Notes sur votre commande (optionnel)"
          value={formData.notes}
          onChange={handleInputChange}
          className="border p-2 rounded-md w-full mb-6"
          rows={4}
        ></textarea>

        {/* Ajout des options de paiement */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Méthode de paiement</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="fedapay"
                checked={paymentMethod === 'fedapay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio"
              />
              <span>FedaPay</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio"
              />
              <span>PayPal</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio"
              />
              <span>Carte de crédit</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Traitement..." : "Passer la commande"}
        </button>
      </form>

      {/* Récapitulatif du Panier */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Panier à acheter</h2>
        <ul className="divide-y divide-gray-200">
          {state.cart.map((item) => (
            <li key={item._id} className="py-4 flex items-center">
              <Image
                src={Array.isArray(item.images) ? item.images[0] : item.images}
                alt={item.title || "Produit"}
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

export default CheckoutPage;
