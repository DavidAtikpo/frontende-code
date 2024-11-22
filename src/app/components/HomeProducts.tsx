"use client";

import React, { useEffect, useState } from "react";

interface Product {
  _id: number;
  title: string;
  images: string | string[];
  category: string;
  price: number;
  rating: number;
  isHot?: boolean;
  isBestDeal?: boolean;
  discount?: number;
}

const HomeProducts = () => {
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
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Promo Section */}
        <div className="bg-orange-400 ">
          <div className="bg-orange-500 text-black p-6 mb-0">
          <h3 className="text-lg font-bold">PRODUITS CONGELE</h3>
          <h2 className="text-3xl font-bold mt-2">30% de réductions !</h2>
          <p className="mt-4">Sur tout vos produits</p>
          <p className="mt-1 text-sm ">
           offre expire <strong className="bg-white text-black">À LA FIN DE L'ANNÉE</strong>
          </p>
          <button className="mt-4 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            PROFITER MAINTENANT →
          </button>
          </div>
          <div>
          <img
            className="mt-0 mb-0 w-45 h-[100%]"
            src="/images/publicite.jpg"
            alt="Promo"
          />
          </div>
         
        </div>

        {/* Products Section */}
        <div className="col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Nos produits en promotion</h2>
            <a
              href="/products"
              className="text-blue-800 hover:underline font-medium"
            >
              Voir tous les produits →
            </a>
          </div>

          {loading ? (
            <p className="text-gray-500">Chargement des produits...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Limiter à 8 produits */}
              {products.slice(0, 8).map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition relative"
                >
                  {/* Product Labels */}
                  {product.isHot && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                      HOT
                    </span>
                  )}
                  {product.isBestDeal && (
                    <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                      BEST DEAL
                    </span>
                  )}
                  {/* {product.discount && (
                    <span className="absolute top-12 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                      {product.discount}% OFF
                    </span>
                  )} */}

                  {/* Product Image */}
                  <img
                    src={Array.isArray(product.images) ? product.images[0] : product.images}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />

                  {/* Product Info */}
                  <h3 className="text-lg font-bold">{product.title}</h3>
                  <p className="text-gray-500 mb-2">{product.category}</p>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-gray-500 ml-2">({product.rating})</span>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 font-bold">
                      {product.price}cfa
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeProducts;
