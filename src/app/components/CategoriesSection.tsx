"use client";

import React, { useRef } from "react";

const categories = [
  {
    id: 1,
    name: "Computer & Laptop",
    image: "/images/computer-laptop.png", // Remplacez par le chemin correct de votre image
  },
  {
    id: 2,
    name: "SmartPhone",
    image: "/images/smartphone.png", // Remplacez par le chemin correct de votre image
  },
  {
    id: 3,
    name: "Headphones",
    image: "/images/headphones.png", // Remplacez par le chemin correct de votre image
  },
  {
    id: 4,
    name: "Accessories",
    image: "/images/accessories.png", // Remplacez par le chemin correct de votre image
  },
  {
    id: 5,
    name: "Camera & Photo",
    image: "/images/camera-photo.png", // Remplacez par le chemin correct de votre image
  },
  {
    id: 6,
    name: "TV & Homes",
    image: "/images/tv-homes.png", // Remplacez par le chemin correct de votre image
  },
];

const CategoriesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Voir les catégories</h2>

      <div className="relative flex items-center">
        {/* Bouton précédent */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-800 transition z-10"
        >
          ←
        </button>

        {/* Liste des catégories */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 scroll-smooth scrollbar-hide"
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex-shrink-0 w-48 bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover mb-4 rounded"
              />
              <h3 className="text-center font-semibold">{category.name}</h3>
            </div>
          ))}
        </div>

        {/* Bouton suivant */}
        <button
          onClick={scrollRight}
          className="absolute right-0 bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-800 transition z-10"
        >
          →
        </button>
      </div>
    </section>
  );
};

export default CategoriesSection;
