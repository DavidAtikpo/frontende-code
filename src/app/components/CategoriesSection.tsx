"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight, FaBox, FaTag } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;
// const BASE_URL = "http://localhost:5000";
// Définir les types pour les données
interface Product {
  _id: string;
  category: string;
  images: string | string[]; // Prend en charge une seule image ou un tableau
}

interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  images?: string[]; // Tableau d'images créé à partir de l'image unique
}

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null); // Utilisé pour l'interaction utilisateur
  const router = useRouter();

  const getCurrentImage = (category: Category): string => {
    // Utiliser l'image principale
    return category.image || `/images/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/category/all`, {
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

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        console.log('Categories data:', data.data);
        setCategories(data.data);
      } else {
        console.error('Format de données inattendu:', data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du fetch des catégories:', error);
      setLoading(false);
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

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
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
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nos Collections
          </h2>

        </motion.div>

        <div className="relative">
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-3 md:space-x-4">
              {categories.map((category, index) => (
                <motion.div
                  key={`category-${category.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCategoryClick(category.id)}
                  className="relative bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-500 w-[calc(50%-8px)] md:w-[calc(16.666%-12px)] flex-shrink-0 cursor-pointer overflow-hidden"
                  style={{
                    backgroundImage: `url(${getCurrentImage(category)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'background-image 1s ease-in-out'
                  }}
                >
                  {/* Overlay pour améliorer la lisibilité du texte sur l'image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/70 to-transparent"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-2 text-center">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md">
                      <FaTag className="text-blue-500 text-xl" />
                    </div>
                    <h3 className="font-bold text-white px-2 py-1 rounded-md backdrop-blur-sm bg-blue-500/20 text-lg">
                      {category.name}
                    </h3>
                    <p className="text-xs text-white px-2 py-1 rounded-md backdrop-blur-sm bg-blue-500/20 max-w-[90%] line-clamp-2">
                      {category.description || "Découvrez notre sélection de produits"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {categories.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            {/* <button
              onClick={() => router.push('/products')}
              className="group inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="font-medium">Voir toutes les catégories</span>
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </button> */}
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
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center space-x-2"
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
                className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium flex items-center space-x-2"
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
