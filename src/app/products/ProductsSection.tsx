"use client";

import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  images: string | string[];
  category: string;
  price: number;
  rating?: number;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product/get-all");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Nos produits en promotion</h2>

      {loading ? (
        <p className="text-gray-500">Chargement des produits...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={Array.isArray(product.images) ? product.images[0] : product.images}
                alt={product.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-bold">{product.title}</h3>
              <p className="text-gray-500 mb-2">{product.category}</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-gray-500 ml-2">({product.rating || 0})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-bold">${product.price}</span>
                <button className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Acheter →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsSection;
