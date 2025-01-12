"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight, FaBox, FaTag } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

// Définir les types pour les données
interface Product {
  _id: string;
  category: string;
  images: string | string[]; // Prend en charge une seule image ou un tableau
}

interface Category {
  _id: string;
  category: string;
  images: string;
  productCount?: number;
  description?: string;
}

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null); // Utilisé pour l'interaction utilisateur
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from:', `${BASE_URL}/api/product/get-all`);
      
      const response = await fetch(`${BASE_URL}/api/product/get-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const products: Product[] = await response.json();

      const categoryMap = products.reduce((acc: Record<string, Category>, product: Product) => {
        if (!acc[product.category]) {
          acc[product.category] = {
            _id: product._id,
            category: product.category,
            images: Array.isArray(product.images) ? product.images[0] : product.images,
            productCount: 1,
            description: getCategoryDescription(product.category),
          };
        } else {
          acc[product.category].productCount = (acc[product.category].productCount || 0) + 1;
        }
        return acc;
      }, {});

      setCategories(Object.values(categoryMap));
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du fetch des catégories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getCategoryDescription = (category: string): string => {
    const descriptions: Record<string, string> = {
      Fruits: "Des fruits frais et savoureux pour votre bien-être quotidien",
      Légumes: "Une sélection de légumes frais cultivés avec soin",
      Viandes: "Des viandes de qualité supérieure pour vos repas",
      Poissons: "Le meilleur de la mer dans votre assiette",
    };
    return descriptions[category] || "Découvrez notre sélection de produits de qualité";
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${category}`);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold mb-2 block">Explorez nos catégories</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nos Collections
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Découvrez notre sélection unique de produits soigneusement choisis pour vous
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCategory(category.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/3]">
                <Image
                  src={category.images}
                  alt={category.category}
                  width={500}
                  height={300}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-opacity 
                    ${hoveredCategory === category.category ? "opacity-90" : "opacity-70"}`}
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-2"
                    >
                      <FaTag className="text-blue-400" />
                      <span className="text-white/90 text-sm font-medium">
                        {category.category}
                      </span>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">
                      {category.category}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-white/80 text-sm line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaBox className="text-blue-400" />
                        <span className="text-white/90 text-sm">
                          {category.productCount} produits
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCategoryClick(category.category)}
                        className="flex items-center space-x-2 bg-white/90 hover:bg-white text-blue-600 
                          px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                      >
                        <span>Découvrir</span>
                        <FaArrowRight className="text-xs" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {categories.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => router.push('/products')}
              className="group inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 
                text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="font-medium">Voir toutes les catégories</span>
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Offres Spéciales</h3>
              <p className="mb-6 opacity-90">Profitez de nos meilleures offres sur une sélection de produits</p>
              <button 
                onClick={() => router.push('/products?filter=special_offers')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 
                  transition-colors font-medium flex items-center space-x-2"
              >
                <span>Voir les offres</span>
                <FaArrowRight />
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
              <FaTag className="text-white w-32 h-32" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Nouveaux Produits</h3>
              <p className="mb-6 opacity-90">Découvrez nos dernières nouveautés fraîchement arrivées</p>
              <button 
                onClick={() => router.push('/products?filter=new_arrivals')}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 
                  transition-colors font-medium flex items-center space-x-2"
              >
                <span>Explorer</span>
                <FaArrowRight />
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
              <FaBox className="text-white w-32 h-32" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
