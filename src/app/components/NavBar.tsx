"use client";

import React, { useState, useEffect } from "react";
// import Image from "next/image";
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
    promotion: { name: "É", price: "4990 cfa", discount: "30%" },
  },
  {
    category: "Produits Frais",
    products: [{ id: 1, name: "Tilapia", price: "590 cfa" }],
    promotion: { name: "Tilapia", price: "6990 cfa", discount: "20%" },
  },
];

// const mockCategories = ["Catégorie 1", "Catégorie 2", "Catégorie 3"];
// const mockTrendingProducts = [
//   {
//     id: 1,
//     name: "PlayStation 5",
//     price: "$160",
//     image: "https://via.placeholder.com/150",
//   },
//   {
//     id: 2,
//     name: "VR Headset",
//     price: "$1,500",
//     image: "https://via.placeholder.com/150",
//   },
//   {
//     id: 3,
//     name: "Smartphone",
//     price: "$2,300",
//     discount: "$3,200",
//     image: "https://via.placeholder.com/150",
//   },
// ];

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    if (selectedCategory) {
      console.log("Selected category:", selectedCategory.category);
    }
  }, [selectedCategory]);

  return (
    <nav className="bg-white shadow-lg py-3 sticky top-0 z-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        {/* Dropdown pour Catégories */}
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => {
            setIsDropdownOpen(false);
            setSelectedCategory(null);
          }}
        >
          <button className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none transform hover:scale-105">
            <span className="font-medium">Catégories</span>
            <AiOutlineCaretDown className="ml-2 text-sm" />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full bg-white rounded-lg shadow-xl mt-2 w-72 z-10 overflow-hidden border border-gray-100">
              <ul className="text-gray-700">
                {mockData.map((category, index) => (
                  <li
                    key={index}
                    className="hover:bg-blue-50 px-6 py-3 cursor-pointer flex items-center justify-between transition-colors duration-200"
                    onMouseEnter={() => setSelectedCategory(category)}
                  >
                    <span className="font-medium">{category.category}</span>
                    <AiOutlineCaretRight className="text-blue-600" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedCategory && (
            <div className="absolute left-full top-0 bg-white rounded-lg shadow-xl mt-2 w-96 z-10 overflow-hidden border border-gray-100">
              <h3 className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 font-bold">
                {selectedCategory.category}
              </h3>
              <ul className="text-gray-700 p-6 grid grid-cols-2 gap-4">
                {selectedCategory.products.map((product) => (
                  <li key={product.id} className="hover:bg-blue-50 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                    <span className="font-medium">{product.name}</span>
                    <span className="block text-blue-600 mt-1">{product.price}</span>
                  </li>
                ))}
              </ul>
              <div className="p-6 bg-gradient-to-r from-red-50 to-red-100">
                <h4 className="font-bold text-red-600 mb-2">
                  Promotion : {selectedCategory.promotion.name}
                </h4>
                <p className="text-sm text-gray-700">
                  Prix : <span className="text-blue-600 font-medium">{selectedCategory.promotion.price}</span>{" "}
                  <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs ml-2">-{selectedCategory.promotion.discount}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Menu Hamburger */}
        <div className="md:hidden">
          {isMobileMenuOpen ? (
            <AiOutlineClose
              className="text-3xl cursor-pointer text-gray-800 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ) : (
            <AiOutlineMenu
              className="text-3xl cursor-pointer text-gray-800 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(true)}
            />
          )}
        </div>

        {/* Liens Desktop */}
        <ul className="hidden md:flex items-center space-x-8">
          {[
            { href: '/service', label: 'Services' },
            { href: '/evenement', label: 'Événementiels' },
            { href: '/formation', label: 'Formations' },
            { href: '/restaurant', label: 'E-Restaurant' },
            { href: '/autres', label: 'Autres' },
          ].map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`relative font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2 ${
                  activeLink === link.href ? 'text-blue-600' : ''
                }`}
                onClick={() => setActiveLink(link.href)}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 ${
                  activeLink === link.href ? 'scale-x-100' : ''
                }`}></span>
              </a>
            </li>
          ))}
          <li className="flex items-center space-x-2 text-gray-800 bg-blue-50 px-4 py-2 rounded-full">
            <FaPhoneAlt className="text-blue-600" />
            <span className="font-medium">+229 00 00 00 00</span>
          </li>
        </ul>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-6 px-6 space-y-6 animate-fadeIn">
          {[
            { href: '/service', label: 'Services' },
            { href: '/evenement', label: 'Événementiels' },
            { href: '/formation', label: 'Formations' },
            { href: '/restaurant', label: 'E-Restaurant' },
            { href: '/autres', label: 'Autres' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-gray-800 hover:text-blue-600 transition-colors duration-200 font-medium transform hover:translate-x-2"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
