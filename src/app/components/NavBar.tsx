"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineCaretDown,
  AiOutlineCaretRight,
} from "react-icons/ai";

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
      { id: 1, name: "Poisson", price: "2990 cfa" },
      { id: 2, name: "Poulet", price: "1990 cfa" },
      { id: 3, name: "Viande", price: "7990 cfa" },
    ],
    promotion: { name: "Écran incurvé 4K", price: "4990 cfa", discount: "30%" },
  },
  {
    category: "Produits Frais",
    products: [{ id: 1, name: "Tilapia", price: "590 cfa" }],
    promotion: { name: "Tilapia", price: "6990 cfa", discount: "20%" },
  },
];

const mockCategories = ["Catégorie 1", "Catégorie 2", "Catégorie 3"];
const mockTrendingProducts = [
  {
    id: 1,
    name: "PlayStation 5",
    price: "$160",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "VR Headset",
    price: "$1,500",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Smartphone",
    price: "$2,300",
    discount: "$3,200",
    image: "https://via.placeholder.com/150",
  },
];

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      console.log("Selected category:", selectedCategory.category);
    }
  }, [selectedCategory]);

  return (
    <nav className="bg-white shadow-md py-1 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        {/* Dropdown pour Catégories */}
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => {
            setIsDropdownOpen(false);
            setSelectedCategory(null);
          }}
        >
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 focus:outline-none">
            <span>Catégories</span>
            <AiOutlineCaretDown className="ml-2" />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full bg-white shadow-lg mt-0 w-64 z-10">
              <ul className="text-gray-700">
                {mockData.map((category, index) => (
                  <li
                    key={index}
                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center justify-between"
                    onMouseEnter={() => setSelectedCategory(category)}
                  >
                    <span>{category.category}</span>
                    <AiOutlineCaretRight />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedCategory && (
            <div className="absolute left-full top-0 bg-white shadow-lg mt-0 w-96 z-10 p-4">
              <h3 className="px-4 py-2 bg-gray-100 text-gray-800 font-bold">
                {selectedCategory.category}
              </h3>
              <ul className="text-gray-700 p-4 grid grid-cols-2 gap-2">
                {selectedCategory.products.map((product) => (
                  <li key={product.id} className="hover:bg-gray-100 px-2 py-1 cursor-pointer">
                    {product.name} - <span className="text-blue-600">{product.price}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 border-t">
                <h4 className="font-bold text-red-600">
                  Promotion : {selectedCategory.promotion.name}
                </h4>
                <p className="text-sm text-gray-700">
                  Prix : <span className="text-blue-600">{selectedCategory.promotion.price}</span>{" "}
                  (Remise : {selectedCategory.promotion.discount})
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Menu Hamburger */}
        <div className="md:hidden">
          {isMobileMenuOpen ? (
            <AiOutlineClose
              className="text-2xl cursor-pointer text-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ) : (
            <AiOutlineMenu
              className="text-2xl cursor-pointer text-gray-800"
              onClick={() => setIsMobileMenuOpen(true)}
            />
          )}
        </div>

        {/* Liens Desktop */}
        <ul className="hidden md:flex items-center space-x-6">
          <li>
            <a href="/service" className="hover:underline text-gray-800">
              Services
            </a>
          </li>
          <li>
            <a href="/evenement" className="hover:underline text-gray-800">
              Événementiels
            </a>
          </li>
          <li>
            <a href="/formation" className="hover:underline text-gray-800">
              Formations
            </a>
          </li>
          <li>
            <a href="/restaurant" className="hover:underline text-gray-800">
              E-Restaurant
            </a>
          </li>
          <li>
            <a href="/autres" className="hover:underline text-gray-800">
              Autres
            </a>
          </li>
          <li className="flex items-center space-x-2 text-gray-800">
            <FaPhoneAlt className="text-blue-600" />
            <span>+229 00 00 00 00</span>
          </li>
        </ul>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-4 space-y-4">
          <a href="/service" className="block text-gray-800 hover:text-blue-600">
            Services
          </a>
          <a href="/evenement" className="block text-gray-800 hover:text-blue-600">
            Événementiels
          </a>
          <a href="/formation" className="block text-gray-800 hover:text-blue-600">
            Formations
          </a>
          <a href="/restaurant" className="block text-gray-800 hover:text-blue-600">
            E-Restaurant
          </a>
          <a href="/autres" className="block text-gray-800 hover:text-blue-600">
            Autres
          </a>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
