"use client";

import React, { useState, useEffect } from "react";
import { useCartContext } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import ProductImage from "../../components/ProductImage";
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

const ShippingAddressPage = () => {
  const router = useRouter();
  const { state } = useCartContext();
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

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      const price = typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(String(item.finalPrice)) || 0;
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation des champs
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData].trim());

    if (emptyFields.length > 0) {
      setErrorMessage(`Veuillez remplir les champs suivants : ${emptyFields.join(', ')}`);
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Veuillez entrer une adresse email valide");
      return;
    }

    // Validation du numéro de téléphone (exemple pour format international)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setErrorMessage("Veuillez entrer un numéro de téléphone valide");
      return;
    }

    try {
      setIsLoading(true);
      
      // Sauvegarder l'adresse dans le localStorage
      localStorage.setItem("shippingAddress", JSON.stringify(formData));
      localStorage.setItem("hasShippingAddress", "true");

      // Rediriger vers la page de paiement
      router.push("/checkout/payment-method");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'adresse:", error);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) {
      setFormData(JSON.parse(savedAddress));
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulaire d'adresse */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Adresse de livraison</h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Traitement..." : "Continuer vers le paiement"}
          </button>
        </form>
      </div>

      {/* Récapitulatif de la commande */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>
        <ul className="divide-y divide-gray-200">
          {state.cart.map((item) => (
            <li key={item._id} className="py-4 flex items-center">
              <ProductImage
                images={item.images}
                alt={item.title}
                width={64}
                height={64}
                className="w-16 h-16 rounded-md object-cover mr-4"
              />
              <div className="flex-1">
                <h4 className="text-sm font-bold">{item.title}</h4>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {(typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(String(item.finalPrice)) || 0).toFixed(2)} FCFA
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Sous-total</span>
            <span className="text-sm font-bold">{calculateTotal().toFixed(2)} FCFA</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Livraison</span>
            <span className="text-sm font-bold">Gratuite</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">{calculateTotal().toFixed(2)} FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressPage;
