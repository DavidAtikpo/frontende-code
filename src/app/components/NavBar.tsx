"use client";

import React, { useState, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose, AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";

const BASE_URL = "https://dubon-server.onrender.com";

// Types mis à jour selon la structure du backend
interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  products?: Product[];
}

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupération des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/categories`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Récupération des produits pour une catégorie
  const fetchProductsByCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/category/${categoryId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }
      const products = await response.json();
      return products;
    } catch (err) {
      console.error('Erreur:', err);
      return [];
    }
  };

  const handleCategoryClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSelectedCategory(null);
  };

  const handleSubCategoryClick = async (category: Category) => {
    const products = await fetchProductsByCategory(category._id);
    setSelectedCategory({ ...category, products });
  };

  return (
    <nav className="bg-white shadow-lg py-3 sticky top-0 z-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        {/* Dropdown pour Catégories */}
        <div className="relative hidden md:block">
          <button 
            onClick={handleCategoryClick}
            className="flex items-center bg-gradient-to-r from-blue-700 to-blue-800 text-white px-6 py-2.5 rounded-full 
              hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg 
              focus:outline-none transform hover:scale-105"
          >
            <span className="font-medium">Catégories</span>
            <AiOutlineCaretDown className={`ml-2 text-sm transform transition-transform duration-300 
              ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full bg-white rounded-lg shadow-xl mt-2 w-72 z-10 
              overflow-hidden border border-gray-100">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Chargement...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : (
                <ul className="text-gray-700">
                  {categories.map((category) => (
                    <li
                      key={category._id}
                      onClick={() => handleSubCategoryClick(category)}
                      className={`px-6 py-3 cursor-pointer flex items-center justify-between 
                        transition-colors duration-200 hover:bg-blue-50
                        ${selectedCategory?._id === category._id ? 'bg-blue-50' : ''}`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <AiOutlineCaretRight className={`text-blue-600 transform transition-transform duration-300
                        ${selectedCategory?._id === category._id ? 'rotate-90' : ''}`} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {selectedCategory && selectedCategory.products && isDropdownOpen && (
            <div className="absolute left-full top-0 bg-white rounded-lg shadow-xl mt-2 w-96 z-10 
              overflow-hidden border border-gray-100">
              <h3 className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 font-bold">
                {selectedCategory.name}
              </h3>
              <ul className="text-gray-700 p-6 grid grid-cols-2 gap-4">
                {selectedCategory.products.map((product) => (
                  <li 
                    key={product._id} 
                    className="hover:bg-blue-50 px-4 py-2 rounded-lg cursor-pointer 
                      transition-colors duration-200"
                  >
                    <span className="font-medium">{product.title}</span>
                    <span className="block text-blue-600 mt-1">{product.price} FCFA</span>
                  </li>
                ))}
              </ul>
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
