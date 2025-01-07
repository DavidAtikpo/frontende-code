"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FaArrowRight, 
  FaShieldAlt,
  FaRegClock,
  FaTruck
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const ProductSlider = () => {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Bannière Principale */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl min-h-[400px] lg:min-h-[500px]">
            <div className="relative h-[400px] lg:h-[500px] bg-gradient-to-r from-blue-600 to-blue-800 
              p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2 text-white space-y-4 sm:space-y-6 z-10">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center space-x-2 bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur-sm"
                >
                  <span>Offre Spéciale</span>
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl lg:text-4xl font-bold"
                >
                  Découvrez nos services de qualité
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/80"
                >
                  Profitez de nos offres exceptionnelles sur une large gamme de produits et services.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-4"
                >
                  <button
                    onClick={() => router.push('/products')}
                    className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium 
                      hover:bg-blue-50 transition-all flex items-center space-x-2"
                  >
                    <span>Découvrir</span>
                    <FaArrowRight />
                  </button>
                </motion.div>
              </div>

              <div className="absolute right-0 bottom-0 lg:relative lg:w-1/2 h-1/2 lg:h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-800/50 to-transparent" />
              </div>
            </div>
          </div>

          {/* Cartes Avantages */}
          <div className="space-y-4">
            {/* Carte Promotions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-3">
                  Offre limitée
                </span>
                <h3 className="text-xl font-bold mb-3">Offres Spéciales</h3>
                <p className="mb-4 text-white/80">
                  Profitez de nos meilleures offres sur une sélection de produits
                </p>
                <button
                  onClick={() => router.push('/products')}
                  className="bg-white text-purple-600 px-6 py-2 rounded-full font-medium 
                    hover:bg-purple-50 transition-all transform hover:scale-105 w-full text-center"
                >
                  Voir les offres
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </motion.div>

            {/* Carte Avantages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900">Nos Avantages</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaTruck className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Livraison Rapide</h4>
                    <p className="text-sm text-gray-500">En 24h chez vous</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaShieldAlt className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Qualité Garantie</h4>
                    <p className="text-sm text-gray-500">Produits certifiés</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaRegClock className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Service 24/7</h4>
                    <p className="text-sm text-gray-500">Support disponible</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
