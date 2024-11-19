"use client";

import React, { useState, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";

// Interfaces pour typer les données
interface Product {
  id: number;
  name: string;
  price: string;
}

interface Promotion {
  name: string;
  price: string;
  discount: string;
}

interface Category {
  category: string;
  products: Product[];
  promotion: Promotion;
}

// Simulation des données de catégories et produits
const mockData: Category[] = [
  {
    category: "Produits Congelés",
    products: [
      { id: 1, name: "Smartphone", price: "2990 cfa" },
      { id: 2, name: "Tablette", price: "1990 cfa" },
      { id: 3, name: "Ordinateur portable", price: "7990 cfa" },
      { id: 4, name: "Casque audio", price: "490 cfa" },
      { id: 5, name: "Téléviseur", price: "5990 cfa" },
      { id: 6, name: "Clavier gamer", price: "890 cfa" },
      { id: 7, name: "Souris gamer", price: "450 cfa" },
      { id: 8, name: "Montre connectée", price: "1290 cfa" },
      { id: 9, name: "Chargeur rapide", price: "190 cfa" },
      { id: 10, name: "Batterie externe", price: "290 cfa" },
    ],
    promotion: { name: "Écran incurvé 4K", price: "4990 cfa", discount: "30%" },
  },
  {
    category: "Produits Frais",
    products: [
      { id: 1, name: "Mixeur", price: "590 cfa" },
      { id: 2, name: "Aspirateur", price: "1490 cfa" },
      { id: 3, name: "Cafetière", price: "390 cfa" },
      { id: 4, name: "Planche à repasser", price: "290 cfa" },
      { id: 5, name: "Lave-vaisselle", price: "4490 cfa" },
    ],
    promotion: { name: "Réfrigérateur", price: "6990 cfa", discount: "20%" },
  },
];

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simuler le chargement des catégories depuis un backend
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simule un délai de 1 seconde
  }, []);

  return (
    <nav className="bg-white shadow-md py-1 sticky top-20 z-10">
      <ul className="max-w-7xl mx-auto flex justify-between items-center text-sm space-x-4 px-6">
        {/* Dropdown pour Catégories */}
        <li
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => {
            setIsDropdownOpen(false);
            setSelectedCategory(null); // Réinitialiser la sélection
          }}
        >
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 focus:outline-none">
            <span>Catégories</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full bg-white shadow-lg mt-0 w-64 z-10">
              {isLoading ? (
                <p className="text-center py-2">Chargement...</p>
              ) : (
                <ul className="text-gray-700">
                  {mockData.map((category, index) => (
                    <li
                      key={index}
                      className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center justify-between"
                      onMouseEnter={() => setSelectedCategory(category)}
                    >
                      <span>{category.category}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Sous-menu pour afficher les produits de la catégorie */}
          {selectedCategory && (
            <div className="absolute left-full top-0 bg-white shadow-lg mt-2 w-96 z-10 p-4">
              <div className="flex flex-col">
                <h3 className="px-4 py-2 bg-gray-100 text-gray-800 font-bold">
                  {selectedCategory.category}
                </h3>
                <ul className="text-gray-700 p-4 grid grid-cols-2 gap-2">
                  {selectedCategory.products.slice(0, 10).map((product) => (
                    <li
                      key={product.id}
                      className="hover:bg-gray-100 px-2 py-1 cursor-pointer text-sm"
                    >
                      {product.name} - <span className="text-blue-600">{product.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-t">
                <h4 className="font-bold text-red-600">
                  Promotion : {selectedCategory.promotion.name}
                </h4>
                <p className="text-sm text-gray-700">
                  Prix :{" "}
                  <span className="text-blue-600">{selectedCategory.promotion.price}</span>{" "}
                  (Remise : {selectedCategory.promotion.discount})
                </p>
              </div>
            </div>
          )}
        </li>

        {/* Autres liens de navigation */}
        <li>
          <a href="#" className="hover:underline text-gray-800">
            Événements
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline text-gray-800">
            Formations
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline text-gray-800">
            E-restaurant
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline text-gray-800">
            Services
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline text-gray-800">
            Autres
          </a>
        </li>

        {/* Téléphone */}
        <li className="flex items-center space-x-2 text-gray-800">
          <FaPhoneAlt className="text-blue-600" /> {/* Icône de téléphone */}
          <span>+229 00 00 00 00</span> {/* Numéro de téléphone */}
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
