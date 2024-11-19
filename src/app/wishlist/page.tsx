"use client";

import React, { useState } from "react";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  image: string;
}

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "Bose Sport Earbuds - Wireless Earphones",
      price: 999,
      originalPrice: 1299,
      inStock: true,
      image: "/images/product1.jpg",
    },
    {
      id: 2,
      name: "Simple Mobile 5G LTE Galaxy 12 Mini",
      price: 2300,
      inStock: true,
      image: "/images/product2.jpg",
    },
    {
      id: 3,
      name: "Portable Washing Machine",
      price: 70,
      inStock: true,
      image: "/images/product3.jpg",
    },
    {
      id: 4,
      name: "TOZO T6 True Wireless Earbuds",
      price: 220,
      originalPrice: 250,
      inStock: false,
      image: "/images/product4.jpg",
    },
    {
      id: 5,
      name: "Wyze Cam Pan v2 1080p Pan/Tilt/Zoom",
      price: 1499.99,
      inStock: true,
      image: "/images/product5.jpg",
    },
  ]);

  const handleRemoveFromWishlist = (id: number) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id));
  };

  const handleAddToCart = (id: number) => {
    alert(`Product with ID: ${id} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
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
          {wishlist.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="p-4 flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <span className="text-sm font-medium text-gray-800">{item.name}</span>
              </td>
              <td className="p-4">
                {item.originalPrice && (
                  <span className="line-through text-gray-400 mr-2">${item.originalPrice}</span>
                )}
                <span className="text-blue-600 font-bold">${item.price}</span>
              </td>
              <td className="p-4">
                {item.inStock ? (
                  <span className="text-green-600 font-medium">IN STOCK</span>
                ) : (
                  <span className="text-red-600 font-medium">OUT OF STOCK</span>
                )}
              </td>
              <td className="p-4 flex items-center space-x-4">
                <button
                  onClick={() => handleAddToCart(item.id)}
                  className={`px-4 py-2 rounded ${
                    item.inStock
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={!item.inStock}
                >
                  ADD TO CART
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  &#x2715;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WishlistPage;
