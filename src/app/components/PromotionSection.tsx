"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";

interface Product {
  _id: number;
  title: string;
  images: string | string[];
  category: string;
  price: number;
  discountPrice: number;
  rating: number;
  discount?: number;
  isHot?: boolean;
  isBestSeller?: boolean;
}

const PromotionsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product/promotions");
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Données inattendues : ce n'est pas un tableau.");
          setProducts([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des promotions :", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const targetDate = new Date().getTime() + 16 * 24 * 60 * 60 * 1000; // 16 jours à partir de maintenant
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % 1000) / 1000);

      setCountdown(`${days}d : ${hours}h : ${minutes}m : ${seconds}s`);

      if (distance < 0) {
        clearInterval(interval);
        setCountdown("Promotion terminée !");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Promotions</h2>
        <p className="text-sm text-gray-500">
          Se termine dans :{" "}
          <span className="text-yellow-500 font-semibold">{countdown}</span>
        </p>
        <a href="/products" className="text-blue-800 hover:underline font-medium">
          Voir tous les produits →
        </a>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.isArray(products) &&
          products.slice(0, 8).map((product) => ( // Limiter à 8 produits
            <div
              key={product._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition relative group"
            >
              {/* Product Labels */}
              {product.isHot && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                  HOT
                </span>
              )}
              {product.discount && (
                <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                  {product.discount}% OFF
                </span>
              )}
              {product.isBestSeller && (
                <span className="absolute top-12 right-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">
                  PLUS VENDU
                </span>
              )}

              {/* Product Image */}
              <div className="relative">
                <img
                  src={Array.isArray(product.images) ? product.images[0] : product.images}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition">
                    <FaHeart size={20} />
                  </button>
                  <button className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition">
                    <FaShoppingCart size={20} />
                  </button>
                  <button className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition">
                    <FaEye size={20} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <h3 className="text-lg font-bold">{product.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{product.category}</p>

              {/* Rating */}
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-gray-500 ml-2">({product.rating})</span>
              </div>

              {/* Price and Add to Cart */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-blue-800 font-bold">${product.discountPrice}</span>
                  {product.discount && (
                    <span className="text-gray-500 line-through text-sm ml-2">
                      ${product.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default PromotionsSection;
