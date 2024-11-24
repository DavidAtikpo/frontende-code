"use client";

import React, { useEffect, useState } from "react";
import { useCartContext } from "../context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CartItem {
  _id: string;
  title: string;
  images: string; // URL de l'image
  price?: number; // Ancien prix (optionnel)
  finalPrice: number; // Prix actuel
  quantity: number; // Quantité dans le panier
}

const CartPage = () => {
  const { state, dispatch } = useCartContext();
  const [couponCode, setCouponCode] = useState<string>(""); // Code coupon
  const [discount, setDiscount] = useState<number>(0); // Réduction appliquée
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Statut d'authentification
  const router = useRouter(); // Gestion des redirections

  const shippingCost = 0; // Frais de livraison (gratuit ici)
  const taxRate = 0.1; // Taxes à 10%

  // Charger le panier depuis le stockage local lors du premier rendu
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch({ type: "SET_CART", payload: JSON.parse(savedCart) });
    }
  }, [dispatch]);

  // Vérification de l'état d'authentification
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Si un token existe, l'utilisateur est connecté
  }, []);

  // Calculer le sous-total
  const calculateSubtotal = () =>
    state.cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);

  // Calculer les taxes
  const calculateTax = () => calculateSubtotal() * taxRate;

  // Calculer le total avec réduction
  const calculateTotal = () =>
    calculateSubtotal() - discount + calculateTax() + shippingCost;

  // Appliquer un code coupon
  const applyCoupon = () => {
    if (couponCode === "PROMO10") {
      const discountAmount = calculateSubtotal() * 0.1; // 10% de réduction
      setDiscount(discountAmount);
      alert("Coupon appliqué : 10% de réduction !");
    } else {
      setDiscount(0);
      alert("Code coupon invalide.");
    }
  };

  // Gestion du paiement (redirection conditionnelle)
  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      const hasShippingAddress =
        localStorage.getItem("hasShippingAddress") === "true";
      if (hasShippingAddress) {
        router.push("/checkout");
      } else {
        router.push("/checkout/shipping-address");
      }
    }
  };

  return (
    <div className="bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section Panier */}
        <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Panier</h2>
          {state.cart.length === 0 ? (
            <p>Votre panier est vide.</p>
          ) : (
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
                {state.cart.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="py-4 flex items-center space-x-4">
                      <button
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_FROM_CART",
                            payload: item._id,
                          })
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        &#x2715;
                      </button>
                      {/* <Image
                        src={item.images || "/logo blanc"} // Remplacez "/default-image.jpg" par une image par défaut valide
                        alt={item.title || "Image par défaut"}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded"
                      /> */}
                      <span>{item.title}</span>
                    </td>
                    <td className="py-4">
                      {/* {item.price && (
                        <span className="line-through text-gray-400 mr-2">
                          {item.price} cfa
                        </span>
                      )} */}
                      {item.finalPrice} cfa
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: { _id: item._id, delta: -1 },
                            })
                          }
                          className="px-2 py-1 border rounded hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: { _id: item._id, delta: 1 },
                            })
                          }
                          className="px-2 py-1 border rounded hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4">
                      {(item.finalPrice * item.quantity).toFixed(2)} cfa
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Section Résumé */}
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Total du panier</h2>
            <div className="flex justify-between py-2">
              <span>Sous-total</span>
              <span>{calculateSubtotal().toFixed(2)} cfa</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Réduction</span>
              <span>-{discount.toFixed(2)} cfa</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Taxes</span>
              <span>{calculateTax().toFixed(2)} cfa</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total</span>
              <span>{calculateTotal().toFixed(2)} cfa</span>
            </div>
            <button
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleCheckout}
            >
              Aller au paiement &rarr;
            </button>
          </div>

          {/* Section Coupon */}
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
              <button
                onClick={applyCoupon}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
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
