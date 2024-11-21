"use client";

import React from "react";
import { useCartContext } from "../context/CartContext"; // Import du contexte

const WishlistPage = () => {
  const { state, dispatch } = useCartContext(); // Accès au contexte global

  // Supprimer un produit de la wishlist
  const handleRemoveFromWishlist = (id: number) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
  };

  // Ajouter un produit au panier
  const handleAddToCart = (id: number) => {
    const product = state.wishlist.find((item) => item._id === id);
    if (product) {
      dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id }); // Optionnel : supprimer de la wishlist
      alert(`Produit "${product.title}" ajouté au panier !`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
      {state.wishlist.length === 0 ? (
        <p className="text-gray-600">Votre wishlist est vide.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left text-sm font-semibold text-gray-600">PRODUCTS</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">PRICE</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">STOCK STATUS</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {state.wishlist.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="p-4 flex items-center space-x-4">
                  <img
                    src={item.images}
                    alt={item.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <span className="text-sm font-medium text-gray-800">{item.title}</span>
                </td>
                <td className="p-4">
                  <span className="text-blue-600 font-bold">${item.finalPrice}</span>
                </td>
                <td className="p-4">
                  <span className="text-green-600 font-medium">IN STOCK</span>
                </td>
                <td className="p-4 flex items-center space-x-4">
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    &#x2715;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WishlistPage;
