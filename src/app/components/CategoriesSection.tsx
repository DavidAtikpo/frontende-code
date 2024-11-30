"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

const BASE_URL = "https://dubon-server.vercel.app";

interface Category {
  _id: string;
  category: string;
  images: string;
  productCount?: number;
}

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/product/get-all`);
        const products = await response.json();

        // Grouper par catégorie et compter les produits
        const categoryMap = products.reduce((acc: Record<string, Category>, product: any) => {
          if (!acc[product.category]) {
            acc[product.category] = {
              _id: product._id,
              category: product.category,
              images: product.images,
              productCount: 1
            };
          } else {
            acc[product.category].productCount = (acc[product.category].productCount || 0) + 1;
          }
          return acc;
        }, {});

        setCategories(Object.values(categoryMap));
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Catégories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits par catégorie
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/category/${category.category}`)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3]">
                {/* Image d'arrière-plan */}
                <Image
                  src={Array.isArray(category.images) ? category.images[0] : category.images}
                  alt={category.category}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />

                {/* Contenu */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.category}
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    {category.productCount} produits disponibles
                  </p>
                  
                  {/* Bouton avec effet hover */}
                  <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="flex items-center space-x-2 text-white bg-blue-600/90 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                      <span>Découvrir</span>
                      <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section bonus pour les promotions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Offres Spéciales</h3>
            <p className="mb-4 opacity-90">Découvrez nos meilleures offres dans toutes les catégories</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Voir les offres
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Nouveautés</h3>
            <p className="mb-4 opacity-90">Les derniers produits ajoutés à notre catalogue</p>
            <button className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition-colors">
              Découvrir
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
