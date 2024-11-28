"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// import { fetchQuickSales, fetchBestSellers, fetchTopRated, fetchNewArrivals } from "../utils/api";

interface Product {
  _id: number;
  title: string;
  images: string;
  price: number;
}

const CategoriesGrid = () => {
  const [quickSales, ] = useState<Product[]>([]);
  const [bestSellers,] = useState<Product[]>([]);
  const [topRated, ] = useState<Product[]>([]);
  const [newArrivals,] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // setQuickSales(await fetchQuickSales());
      // setBestSellers(await fetchBestSellers());
      // setTopRated(await fetchTopRated());
      // setNewArrivals(await fetchNewArrivals());
    };

    fetchProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Vente Rapide Aujourd'hui */}
        <div>
          <h3 className="text-lg font-bold mb-4">VENTE RAPIDE AUJOURD&apos;HUI</h3>
          <div className="space-y-4">
            {quickSales.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <Image src={product.images} alt={product.title} className="w-full h-20 object-cover mb-2 rounded-md" 
                                width={64}
                                height={64}
                />
                <h4 className="text-sm font-semibold">{product.title}</h4>
                <p className="text-blue-800 font-bold">${product.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meilleures Ventes */}
        <div>
          <h3 className="text-lg font-bold mb-4">MEILLEURES VENTES</h3>
          <div className="space-y-4">
            {bestSellers.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <Image src={product.images} alt={product.title} className="w-full h-20 object-cover mb-2 rounded-md" 
                width={64}
                height={64}
                />
                <h4 className="text-sm font-semibold">{product.title}</h4>
                <p className="text-blue-800 font-bold">${product.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meilleures Notes */}
        <div>
          <h3 className="text-lg font-bold mb-4">MEILLEURES NOTES</h3>
          <div className="space-y-4">
            {topRated.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <Image src={product.images} alt={product.title} className="w-full h-20 object-cover mb-2 rounded-md" />
                <h4 className="text-sm font-semibold">{product.title}</h4>
                <p className="text-blue-800 font-bold">{product.price}cfa</p>
              </div>
            ))}
          </div>
        </div>

        {/* Arrivages */}
        <div>
          <h3 className="text-lg font-bold mb-4">ARRIVAGE</h3>
          <div className="space-y-4">
            {newArrivals.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <Image src={product.images }
                
                alt={product.title} className="w-full h-20 object-cover mb-2 rounded-md" 
                                width={64}
                                height={64}
                />
                <h4 className="text-sm font-semibold">{product.title}</h4>
                <p className="text-blue-800 font-bold">{product.price}cfa</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
