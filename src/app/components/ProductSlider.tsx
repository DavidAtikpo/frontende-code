"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const ProductSlider = () => {
  // Tableau d'images pour le slider
  const images = [
    "/images/product1.jpg",
    "/images/product2.jpg",
    "/images/product3.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change d'image toutes les 10 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle
  }, [images.length]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Section principale avec Slider */}
      <div className="col-span-2 bg-gray-100 p-6 rounded-lg relative flex items-center">
        <div className="flex-1">
          <h3 className="text-blue-700 font-semibold uppercase mb-2">
            L&apos;endroit pour tout avoir
          </h3>
          <h2 className="text-3xl font-bold mb-4">Poissons congelés</h2>
          <p className="text-sm text-gray-700 mb-6">
            Save up to 50% on select Xbox games. Get 3 months of PC Game Pass
            for $2 USD.
          </p>
          <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition">
            ACHETER MAINTENANT →
          </button>
        </div>

        {/* Slider d'images */}
        <div className="relative w-1/2">
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            width={400}
            height={300}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Prix affiché */}
        <div className="absolute top-6 right-6 bg-blue-700 text-white py-1 px-3 rounded-full text-sm">
          1500 FCFA
        </div>

        {/* Indicateurs de pagination */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-blue-700" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Offres secondaires */}
      <div className="space-y-4">
        {/* Carte 1 */}
        <div className="bg-black text-white p-4 rounded-lg relative">
          <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
            -29%
          </div>
          <h3 className="text-yellow-400 uppercase">Grosses Offres</h3>
          <h4 className="font-bold text-lg mt-2">New Google Pixel 6 Pro</h4>
          <Image
            src="https://via.placeholder.com/400x200?text=Google+Pixel+6+Pro"
            alt="Google Pixel 6 Pro"
            width={400}
            height={200}
            className="mt-4 rounded-lg object-cover w-full"
          />
          <button className="bg-yellow-400 text-black px-4 py-2 rounded mt-4 hover:bg-yellow-500 transition">
            ACHETER →
          </button>
        </div>

        {/* Carte 2 */}
        <div className="bg-white text-black p-4 rounded-lg shadow">
          <h4 className="font-bold text-lg mb-2">Viandes</h4>
          <Image
            src="https://via.placeholder.com/400x200?text=Viande"
            alt="Viandes"
            width={400}
            height={200}
            className="rounded-lg object-cover w-full"
          />
          <p className="text-gray-600 mt-4">1500 FCFA</p>
          <button className="bg-blue-700 text-white px-4 py-2 rounded mt-4 hover:bg-blue-500 transition">
            ACHETER →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
