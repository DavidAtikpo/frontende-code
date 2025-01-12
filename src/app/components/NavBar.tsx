"use client";

import React, { useState, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose, AiOutlineCaretDown } from "react-icons/ai";
import { API_CONFIG } from '@/utils/config';
import { useRouter } from "next/navigation";

const { BASE_URL } = API_CONFIG;

const DEFAULT_IMAGE = '/placeholder.jpg';

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string | string[]) => {
  if (!imagePath) return DEFAULT_IMAGE;
  
  try {
    // Si c'est un tableau, prendre la première image
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!path) return DEFAULT_IMAGE;
  
    // Si c'est déjà une URL complète
    if (path.startsWith('http')) {
      return path;
    }
  
    // Si le chemin commence par 'uploads'
    if (path.startsWith('uploads')) {
      return `${BASE_URL}/${path}`;
    }

    // Pour tout autre cas
    return `${BASE_URL}/uploads/products/${path.replace(/^\/+/, '')}`;
  } catch (error) {
    console.error('Erreur dans getImageUrl:', error);
    return DEFAULT_IMAGE;
  }
};

// Types mis à jour selon la structure du backend
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  products?: Product[];
  subcategories?: Category[];
}

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Récupération des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/category/all`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }
        const data = await response.json();
        setCategories(data.data || []);
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
    if (!categoryId) return [];
    try {
      const response = await fetch(`${BASE_URL}/api/category/${categoryId}/products`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }
      const data = await response.json();
      return data.data?.products || [];
    } catch (err) {
      console.error('Erreur:', err);
      return [];
    }
  };

  const handleCategoryClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSelectedCategory(null);
    setSelectedProduct(null);
  };

  const handleCategoryHover = async (category: Category) => {
    if (!category.products) {
      const products = await fetchProductsByCategory(category.id);
      setSelectedCategory({ ...category, products });
    } else {
      setSelectedCategory(category);
    }
    setSelectedProduct(null);
  };

  const handleProductHover = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDropdownEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    setIsDropdownOpen(false);
    setSelectedCategory(null);
    setSelectedProduct(null);
  };

  return (
    <nav className="bg-white shadow-lg py-3 sticky top-0 z-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        {/* Dropdown pour Catégories */}
        <div className="relative hidden md:block"
             onMouseEnter={handleDropdownEnter}
             onMouseLeave={handleDropdownLeave}>
          <button 
            className="flex items-center bg-gradient-to-r from-blue-700 to-blue-800 text-white px-6 py-2.5 rounded-full 
              hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg 
              focus:outline-none transform hover:scale-105"
          >
            <span className="font-medium">Catégories</span>
            <AiOutlineCaretDown className={`ml-2 text-sm transform transition-transform duration-300 
              ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-[calc(100%_-_2px)] flex bg-white rounded-lg shadow-xl border border-gray-100 z-20">
              {/* Première colonne - Catégories */}
              <div className="w-48 border-r border-gray-100">
                <ul className="py-2">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      onMouseEnter={() => handleCategoryHover(category)}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors
                        ${selectedCategory?.id === category.id ? 'bg-blue-50' : ''}`}
                    >
                      <span className="font-medium text-sm">{category.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deuxième colonne - Noms des produits */}
              {selectedCategory && (
                <div className="w-56 border-r border-gray-100 max-h-[400px] overflow-y-auto">
                  <div className="p-3 bg-gray-50 border-b">
                    <h3 className="font-semibold text-sm text-gray-800">
                      {selectedCategory.name}
                    </h3>
                  </div>
                  <ul className="py-2">
                    {selectedCategory.products?.map((product) => (
                      <li
                        key={product.id}
                        onMouseEnter={() => handleProductHover(product)}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors
                          ${selectedProduct?.id === product.id ? 'bg-blue-50' : ''}`}
                      >
                        <p className="text-sm text-gray-800">
                          {product.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Troisième colonne - Aperçu du produit */}
              {selectedProduct && (
                <div className="w-48 p-3">
                  <div className="w-32 h-32 mx-auto relative mb-2">
                    <img
                      src={getImageUrl(selectedProduct.images)}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <h3 className="font-medium text-xs text-gray-900 mb-1 truncate">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 mb-2">
                    {selectedProduct.price.toLocaleString()} CFA
                  </p>
                  <button
                    onClick={() => router.push(`/product/${selectedProduct.id}`)}
                    className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    Voir détails
                  </button>
                </div>
              )}
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
            { href: '/events', label: 'Événementiels' },
            { href: '/trainings', label: 'Formations' },
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
            { href: '/events', label: 'Événementiels' },
            { href: '/trainings', label: 'Formations' },
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
