"use client";

import React, { useState } from "react";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>("Debit/Credit Card");

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Commande passée avec succès !");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Section Informations Client */}
      <form className="col-span-2 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Informations</h2>

        {/* Nom et Adresse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="First name"
            className="border p-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            placeholder="Last name"
            className="border p-2 rounded-md w-full"
            required
          />
        </div>
        <input
          type="text"
          placeholder="Nom de l'entreprise (Facultatif)"
          className="border p-2 rounded-md w-full mb-4"
        />
        <input
          type="text"
          placeholder="Adresse"
          className="border p-2 rounded-md w-full mb-4"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select className="border p-2 rounded-md w-full" required>
            <option value="">Select City</option>
            <option value="city1">City 1</option>
            <option value="city2">City 2</option>
          </select>
          <input
            type="text"
            placeholder="Zip Code"
            className="border p-2 rounded-md w-full"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="border p-2 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-6">
          <label className="inline-flex items-center">
            <input type="checkbox" className="mr-2" />
            Ship to a different address
          </label>
        </div>

        {/* Options de paiement */}
        <h2 className="text-2xl font-bold mb-6">Option de paiement</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
          {["Cash on Delivery", "Venmo", "Paypal", "Amazon Pay", "Debit/Credit Card"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => handlePaymentMethodChange(method)}
              className={`p-4 border rounded-md text-center ${
                paymentMethod === method
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {paymentMethod === "Debit/Credit Card" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Name on Card"
              className="border p-2 rounded-md w-full"
              required
            />
            <input
              type="text"
              placeholder="Card Number"
              className="border p-2 rounded-md w-full"
              required
            />
            <input
              type="text"
              placeholder="Expire Date (MM/YY)"
              className="border p-2 rounded-md w-full"
              required
            />
            <input
              type="text"
              placeholder="CVC"
              className="border p-2 rounded-md w-full"
              required
            />
          </div>
        )}

        {/* Informations additionnelles */}
        <h2 className="text-2xl font-bold mb-4">Informations additionnelles</h2>
        <textarea
          placeholder="Notes sur votre commande (optionnel)"
          className="border p-2 rounded-md w-full mb-6"
          rows={4}
        ></textarea>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
        >
          Passer la commande
        </button>
      </form>

      {/* Récapitulatif du Panier */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Panier à acheter</h2>
        <ul className="divide-y divide-gray-200">
          <li className="py-4 flex items-center">
            <img
              src="/images/product1.jpg"
              alt="Product 1"
              className="w-16 h-16 rounded-md object-cover mr-4"
            />
            <div className="flex-1">
              <h4 className="text-sm font-bold">Canon EOS 1500D DSLR</h4>
              <p className="text-sm text-gray-500">1 × 25000 FCFA</p>
            </div>
          </li>
          <li className="py-4 flex items-center">
            <img
              src="/images/product2.jpg"
              alt="Product 2"
              className="w-16 h-16 rounded-md object-cover mr-4"
            />
            <div className="flex-1">
              <h4 className="text-sm font-bold">Wired Over-Ear Gaming Headphones</h4>
              <p className="text-sm text-gray-500">3 × 5000 FCFA</p>
            </div>
          </li>
        </ul>
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Sous-total</span>
            <span className="text-sm font-bold">55000 FCFA</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Livraison</span>
            <span className="text-sm font-bold">Gratuite</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">55000 FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
