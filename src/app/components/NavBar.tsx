"use client";

import React, { useState, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose, AiOutlineCaretDown } from "react-icons/ai";
import { API_CONFIG } from '@/utils/config';
import { useRouter } from "next/navigation";

const { BASE_URL } = API_CONFIG;

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

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
  
    // Construction de l'URL
    return `http://localhost:5000/uploads/products/${path.replace(/^\/+/, '')}`;
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
  products: Product[];
  subcategories: Category[];
}

const NavigationBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category | null>(null);
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
        console.log('Début du chargement des catégories');
        const response = await fetch(`${BASE_URL}/api/category/all`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }
        
        const data = await response.json();
        console.log('Données reçues:', data);
        
        if (data.success && data.data) {
          console.log('Catégories:', data.data);
          console.log('Première catégorie:', data.data[0]);
          if (data.data[0]?.subcategories) {
            console.log('Sous-catégories de la première catégorie:', data.data[0].subcategories);
            console.log('Produits de la première sous-catégorie:', data.data[0].subcategories[0]?.products);
          }
          setCategories(data.data);
        } else {
          throw new Error('Format de données invalide');
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur détaillée:", err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedProduct(null);
  };

  const handleCategoryHover = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedProduct(null);
  };

  const handleSubcategoryHover = (subcategory: Category) => {
    setSelectedSubcategory(subcategory);
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
    setSelectedSubcategory(null);
    setSelectedProduct(null);
  };

  return (
    <nav className="bg-white shadow-lg py-3 sticky top-20 z-[30] transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        {/* Dropdown pour Catégories */}
        <div 
          className="relative hidden md:block"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          <button 
            className="flex items-center bg-gradient-to-r from-blue-700 to-blue-800 text-white px-6 py-2.5 rounded-full 
              hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg 
              focus:outline-none transform hover:scale-105 relative z-[101]"
          >
            <span className="font-medium">Catégories</span>
            <AiOutlineCaretDown className={`ml-2 text-sm transform transition-transform duration-300 
              ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <>
              {/* Zone tampon invisible pour une navigation fluide */}
              <div className="absolute w-full h-8 -bottom-8 left-0 z-[101]" />
              
              <div 
                className="absolute left-0 top-full pt-2 z-[102]"
              >
                <div className="bg-white rounded-lg shadow-xl border border-gray-100 flex"
                  style={{ 
                    minHeight: '300px'
                  }}
                >
                  <div className="flex relative bg-white rounded-lg overflow-hidden">
                    {/* Première colonne - Catégories principales */}
                    <div className="w-48 border-r border-gray-100 bg-white">
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

                    {/* Deuxième colonne - Sous-catégories */}
                    {selectedCategory && (
                      <div className="w-48 border-r border-gray-100 bg-white">
                        <div className="p-3 bg-gray-50 border-b sticky top-0">
                          <h3 className="font-semibold text-sm text-gray-800">
                            {selectedCategory.name}
                          </h3>
                        </div>
                        <ul className="py-2">
                          {selectedCategory.subcategories?.map((subcategory) => (
                            <li
                              key={subcategory.id}
                              onMouseEnter={() => handleSubcategoryHover(subcategory)}
                              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors
                                ${selectedSubcategory?.id === subcategory.id ? 'bg-blue-50' : ''}`}
                            >
                              <span className="text-sm">{subcategory.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Troisième colonne - Produits */}
                    {selectedSubcategory && selectedSubcategory.products && (
                      <div className="w-48 border-r border-gray-100 bg-white">
                        <div className="p-3 bg-gray-50 border-b sticky top-0">
                          <h3 className="font-semibold text-sm text-gray-800">
                            {selectedSubcategory.name}
                          </h3>
                        </div>
                        <ul className="py-2">
                          {selectedSubcategory.products.map((product) => (
                            <li
                              key={product.id}
                              onMouseEnter={() => handleProductHover(product)}
                              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors
                                ${selectedProduct?.id === product.id ? 'bg-blue-50' : ''}`}
                            >
                              <span className="text-sm">{product.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Quatrième colonne - Aperçu du produit */}
                    {selectedProduct && (
                      <div className="w-48 p-4 bg-white">
                        <div className="aspect-square w-full relative mb-3">
                          <img
                            src={getImageUrl(selectedProduct.images)}
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover rounded-lg shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Éviter les boucles infinies
                              target.src = DEFAULT_IMAGE;
                            }}
                          />
                        </div>
                        <h3 className="font-medium text-sm text-gray-900 mb-1 truncate">
                          {selectedProduct.name}
                        </h3>
                        <p className="text-sm font-bold text-blue-600 mb-2">
                          {selectedProduct.price.toLocaleString()} CFA
                        </p>
                        <button
                          onClick={() => router.push(`/product/${selectedProduct.id}`)}
                          className="w-full bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Voir détails
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
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
            { href: '/products', label: 'Produits' },
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
