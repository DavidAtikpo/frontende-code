"use client";

import React, { useEffect } from "react";
import { useCartContext } from "../context/CartContext";
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from "@/components/ui/use-toast";
import ProductImage from "../components/ProductImage";
import Link from "next/link";
import { motion } from "framer-motion";

const { BASE_URL } = API_CONFIG;

const WishlistPage = () => {
  const { state, dispatch } = useCartContext();
  const { toast } = useToast();

  // Charger la wishlist depuis le backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch(`${BASE_URL}/api/user/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          dispatch({ type: "SET_WISHLIST", payload: data.wishlist });
        }
      } catch (error) {
        console.error('Erreur chargement wishlist:', error);
      }
    };

    fetchWishlist();
  }, [dispatch]);

  // Supprimer un produit de la wishlist
  const handleRemoveFromWishlist = async (id: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/user/wishlist/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
        toast({
          title: "Succès",
          description: "Produit retiré de la wishlist"
        });
      }
    } catch (error) {
      console.error('Erreur suppression wishlist:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit",
        variant: "destructive"
      });
    }
  };

  // Ajouter un produit au panier
  const handleAddToCart = async (id: string) => {
    try {
      const product = state.wishlist.find((item) => item._id === id);
      if (product) {
        const token = getCookie('token');
        const response = await fetch(`${BASE_URL}/api/user/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: id, quantity: 1 })
        });

        if (response.ok) {
          dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
          handleRemoveFromWishlist(id);
          toast({
            title: "Succès",
            description: "Produit ajouté au panier"
          });
        }
      }
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter au panier",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">Ma Wishlist</h1>
      {state.wishlist.length === 0 ? (
        <p className="text-gray-600 text-center">Votre wishlist est vide.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead className="hidden sm:table-header-group bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Produits</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Prix</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Stock</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.wishlist.map((item) => (
                <tr
                  key={item._id}
                  className="sm:table-row block mb-4 sm:mb-0 border-b sm:border-0"
                >
                  {/* Produit */}
                  <td className="p-4 flex items-center space-x-4 sm:table-cell block">
                    <div className="relative group">
                      <ProductImage
                        images={item.images}
                        alt={item.title}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-800 sm:hidden">
                      {item.title}
                    </span>
                  </td>

                  {/* Prix */}
                  <td className="p-4 text-blue-600 font-bold sm:table-cell block">
                    {(typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(String(item.finalPrice)) || 0).toFixed(2)} CFA
                  </td>

                  {/* Stock */}
                  <td className="p-4 text-green-600 font-medium sm:table-cell block">
                    En Stock
                  </td>

                  {/* Actions */}
                  <td className="p-4 flex space-x-4 sm:table-cell block">
                    <button
                      onClick={() => handleAddToCart(item._id)}
                      className="w-full sm:w-auto px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                    >
                      Ajouter au Panier
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="w-full sm:w-auto text-red-600 hover:text-red-800 text-sm"
                    >
                      &#x2715;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
