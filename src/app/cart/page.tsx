"use client";

import React, { useState, useEffect } from "react";
import { useCartContext } from "../context/CartContext";
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/ui/ProductImage";
import Link from "next/link";
import { motion } from "framer-motion";

const { BASE_URL } = API_CONFIG;

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string | string[]) => {
  if (!imagePath) return "/placeholder.jpg";
  const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path}`;
};

const CartPage = () => {
  const { state, dispatch } = useCartContext();
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Charger le panier depuis le backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = getCookie('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/api/user/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          dispatch({ type: "SET_CART", payload: data.cart });
        } else if (response.status === 403) {
          toast({
            title: "Erreur d'autorisation",
            description: "Vous n'avez pas les permissions nécessaires pour accéder au panier",
            variant: "destructive"
          });
          // Rediriger vers la page de connexion utilisateur
          router.push('/login');
        }
      } catch (error) {
        console.error('Erreur chargement panier:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le panier",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [dispatch, router, toast]);

  // Mettre à jour la quantité
  const handleUpdateQuantity = async (productId: string, delta: number) => {
    try {
      const token = getCookie('token');
      if (!token) {
        toast({
          title: "Erreur",
          description: "Veuillez vous connecter",
          variant: "destructive"
        });
        router.push('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/user/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ delta })
      });

      if (response.ok) {
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { _id: productId, delta }
        });
        toast({
          title: "Succès",
          description: "Quantité mise à jour"
        });
      } else if (response.status === 403) {
        toast({
          title: "Erreur d'autorisation",
          description: "Vous n'avez pas les permissions nécessaires",
          variant: "destructive"
        });
        router.push('/login');
      } else {
        const data = await response.json();
        toast({
          title: "Erreur",
          description: data.message || "Impossible de mettre à jour la quantité",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur mise à jour quantité:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive"
      });
    }
  };

  // Supprimer du panier
  const handleRemoveFromCart = async (productId: string) => {
    try {
      const token = getCookie('token');
      if (!token) {
        toast({
          title: "Erreur",
          description: "Veuillez vous connecter",
          variant: "destructive"
        });
        router.push('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/user/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        dispatch({ type: "REMOVE_FROM_CART", payload: productId });
        toast({
          title: "Succès",
          description: "Produit retiré du panier"
        });
      } else if (response.status === 403) {
        toast({
          title: "Erreur d'autorisation",
          description: "Vous n'avez pas les permissions nécessaires",
          variant: "destructive"
        });
        router.push('/login');
      } else {
        const data = await response.json();
        toast({
          title: "Erreur",
          description: data.message || "Impossible de retirer le produit",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur suppression panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit",
        variant: "destructive"
      });
    }
  };

  const shippingCost = 0;

  const calculateSubtotal = () =>
    state.cart.reduce((sum, item) => {
      const price = typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(String(item.finalPrice)) || 0;
      return sum + price * (item.quantity || 1);
    }, 0);

  const calculateTotal = () => calculateSubtotal() - discount + shippingCost;

  const applyCoupon = () => {
    if (couponCode === "PROMO10") {
      const discountAmount = calculateSubtotal() * 0.1;
      setDiscount(discountAmount);
    } else {
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    const isAuthenticated = !!localStorage.getItem("token");
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      const hasShippingAddress =
        localStorage.getItem("hasShippingAddress") === "true";
      router.push(hasShippingAddress ? "/checkout" : "/checkout/shipping-address");
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <nav className="text-gray-600 text-sm mb-6">
        <Link href="/" className="hover:underline">
          Accueil
        </Link>{" "}
        /{" "}
        <Link href="/cart" className="hover:underline">
          Panier
        </Link>
      </nav>
      <div className="max-w-7xl mx-auto space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Section Panier */}
        <motion.div 
          className="col-span-2 bg-white shadow-lg rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Panier</h2>
          {state.cart.length === 0 ? (
            <p className="text-base">Votre panier est vide.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-base">
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
                          onClick={() => handleRemoveFromCart(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          &#x2715;
                        </button>
                        <ProductImage
                          images={item.images}
                          alt={item.title || "Produit"}
                          width={48}
                          height={48}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <span className="text-base">{item.title}</span>
                      </td>
                      <td className="py-4">{(typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(String(item.finalPrice)) || 0).toFixed(2)} CFA</td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, -1)}
                            className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity || 1}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, 1)}
                            className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4">
                        {((typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(String(item.finalPrice)) || 0) * (item.quantity || 1)).toFixed(2)} CFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Section Résumé */}
        <motion.div 
          className="bg-white shadow-lg rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-lg font-bold mb-4">Total du panier</h2>
          <div className="flex justify-between py-2 text-base">
            <span>Sous-total</span>
            <span>{calculateSubtotal().toFixed(2)} CFA</span>
          </div>
          <div className="flex justify-between py-2 text-base">
            <span>Réduction</span>
            <span>-{discount.toFixed(2)} CFA</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total</span>
            <span>{calculateTotal().toFixed(2)} CFA</span>
          </div>
          <button
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
            onClick={handleCheckout}
          >
            Aller au paiement &rarr;
          </button>
        </motion.div>

        {/* Section Coupon */}
        <motion.div 
          className="bg-white shadow-lg rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-bold mb-4">Code Coupon</h2>
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Entrez votre coupon"
              className="flex-1 px-4 py-2 border rounded w-full"
            />
            <button
              onClick={applyCoupon}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all w-full md:w-auto"
            >
              Appliquer
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
