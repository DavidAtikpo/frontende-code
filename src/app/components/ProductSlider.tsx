"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaShoppingCart, FaRegClock, FaShieldAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ProductSlider = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      title: "Produits Frais",
      subtitle: "Qualité Premium",
      description: "Découvrez notre sélection de produits frais, soigneusement choisis pour votre satisfaction",
      image: "/images/produits-frais.jpg",
      price: "À partir de 1500 FCFA",
      badge: "Nouveau",
      buttonText: "Découvrir",
      bgColor: "from-blue-600 to-blue-800"
    },
    {
      title: "Fruits de Mer",
      subtitle: "Fraîcheur Garantie",
      description: "Les meilleurs fruits de mer, directement de l'océan à votre table",
      image: "/images/fruits-de-mer.jpg",
      price: "À partir de 2500 FCFA",
      badge: "Populaire",
      buttonText: "Commander",
      bgColor: "from-teal-600 to-teal-800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const lastIndex = slides.length - 1;
    if (currentIndex < 0) {
      setCurrentIndex(lastIndex);
    }
    if (currentIndex > lastIndex) {
      setCurrentIndex(0);
    }
  }, [currentIndex, slides.length]);

  return (
    <section className="relative overflow-hidden bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Slider Principal */}
          <motion.div 
            className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`relative h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-r ${slides[currentIndex].bgColor} 
                  p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-center`}
              >
                <div className="w-full lg:w-1/2 text-white space-y-4 sm:space-y-6 z-10 text-center lg:text-left">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block bg-white/20 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm"
                  >
                    {slides[currentIndex].subtitle}
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                  >
                    {slides[currentIndex].title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/80 text-sm sm:text-base hidden sm:block"
                  >
                    {slides[currentIndex].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                  >
                    <button
                      onClick={() => router.push('/products')}
                      className="bg-white text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium 
                        hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center gap-2 
                        text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                      {slides[currentIndex].buttonText}
                      <FaArrowRight />
                    </button>
                    <span className="text-xl sm:text-2xl font-bold">{slides[currentIndex].price}</span>
                  </motion.div>
                </div>

                <div className="absolute right-0 bottom-0 lg:top-0 w-full lg:w-1/2 h-1/2 lg:h-full">
                  <Image
                    src={slides[currentIndex].image}
                    alt={slides[currentIndex].title}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Indicateurs */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-6 sm:w-8 bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Cartes latérales */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Carte Promotions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm mb-3 sm:mb-4">
                  -30% cette semaine
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Offres Spéciales</h3>
                <p className="mb-4 sm:mb-6 text-white/80 text-sm sm:text-base">
                  Profitez de nos meilleures offres sur une sélection de produits
                </p>
                <button
                  onClick={() => router.push('/products?filter=promotions')}
                  className="bg-white text-purple-600 px-4 sm:px-6 py-2 rounded-full font-medium 
                    hover:bg-purple-50 transition-all transform hover:scale-105 text-sm sm:text-base
                    w-full sm:w-auto text-center"
                >
                  Voir les offres
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full blur-2xl" />
            </motion.div>

            {/* Carte Avantages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">Nos Avantages</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaShoppingCart className="text-blue-600" />
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
