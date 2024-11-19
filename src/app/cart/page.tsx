"use client";

import React, { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number; // Pour afficher le prix barré
  quantity: number;
  image: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "4K UHD LED Smart TV with Chromecast Built-in",
      price: 70,
      originalPrice: 99,
      quantity: 1,
      image: "/path-to-image-tv.jpg",
    },
    {
      id: 2,
      name: "Wired Over-Ear Gaming Headphones with USB",
      price: 250,
      quantity: 3,
      image: "/path-to-image-headphones.jpg",
    },
  ]);

  const [couponCode, setCouponCode] = useState<string>("");

  const shippingCost = 0; // Gratuit dans cet exemple
  const taxRate = 0.1; // Taxes à 10%

  // Calculer le sous-total
  const calculateSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculer les taxes
  const calculateTax = () => calculateSubtotal() * taxRate;

  // Calculer le total
  const calculateTotal = () => calculateSubtotal() + calculateTax() + shippingCost;

  // Gestion des quantités
  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Supprimer un produit
  const removeItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section Panier */}
        <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Panier</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Produits</th>
                <th className="py-2">Prix</th>
                <th className="py-2">Quantité</th>
                <th className="py-2">Sous-total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4 flex items-center space-x-4">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      &#x2715;
                    </button>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-4">
                    {item.originalPrice && (
                      <span className="line-through text-gray-400 mr-2">
                        {item.originalPrice}$
                      </span>
                    )}
                    {item.price}$
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-1 border rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4">{(item.price * item.quantity).toFixed(2)}$</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 flex justify-between">
            <button className="px-4 py-2 border rounded hover:bg-gray-200">
              &#x2190; Retourner à la boutique
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Ajouter
            </button>
          </div>
        </div>

        {/* Section Résumé */}
        <div className="space-y-6">
          {/* Total Panier */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Total du panier</h2>
            <div className="flex justify-between py-2">
              <span>Sous-total</span>
              <span>{calculateSubtotal().toFixed(2)}$</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Shipping</span>
              <span>Gratuit</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Taxes</span>
              <span>{calculateTax().toFixed(2)}$</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total</span>
              <span>{calculateTotal().toFixed(2)}$</span>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Aller au paiement &rarr;
            </button>
          </div>

          {/* Code Coupon */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Code Coupon</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Entrez votre coupon"
                className="flex-1 px-4 py-2 border rounded"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Appliquer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
