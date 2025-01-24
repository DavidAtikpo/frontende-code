"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  FaArrowRight, 
  FaArrowLeft,
  FaShieldAlt,
  FaRegClock,
  FaTruck
} from "react-icons/fa";
import { useRouter } from "next/navigation";

// Images de démonstration (à remplacer par vos images Cloudinary)
const banners = [
  {
    id: 1,
    imageUrl: "https://res.cloudinary.com/dubonservice/image/upload/v1737747273/dubon/baniere/trbn8wlzubbhalkfufsm.jpg",
    title: "Demande de service",
    description: "Demandez nos services avec un seul clic",
  },
  {
    id: 2,
    imageUrl: "https://res.cloudinary.com/dubonservice/image/upload/v1737747273/dubon/baniere/uohs0ozgt5pfdz2nsqnn.webp",
    title: "Nouveautés",
    description: "Explorez nos derniers produits",
  },
  {
    id: 3,
    imageUrl: "https://res.cloudinary.com/dubonservice/image/upload/v1737747273/dubon/baniere/nlwuquhivafxfqfpsmbj.jpg",
    title: "Promotions",
    description: "Profitez de nos meilleures offres",
  },
  {
    id: 4,
    imageUrl: "https://res.cloudinary.com/dubonservice/image/upload/v1737747272/dubon/baniere/qmfazhc8vn2dn33x9rxy.jpg",
    title: "Evenement",
    description: "Profitez de nos meilleures evenements",
  },
  {
    id: 5,
    imageUrl: "https://res.cloudinary.com/dubonservice/image/upload/v1737748823/dubon/baniere/vpqcmf9oxm47mwypgesz.jpg",
    title: "Promotions",
    description: "Profitez de nos meilleures offres",
  },
  {
    id: 6,
    imageUrl: "https://res.cloudinary.com/dubonservice/image/upload/v1737749041/dubon/baniere/i6ycm2ei1qjtaziyofuv.jpg",
    title: "Formation",
    description: "Profitez de nos meilleures formations",
  },
];

const ProductSlider = () => {
  const router = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative overflow-hidden bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bannière Principale */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl h-[150px] lg:h-[350px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative h-full"
              >
                <Image
                  src={banners[currentBanner].imageUrl}
                  alt={banners[currentBanner].title}
                  width={1200}
                  height={180}
                  className="object-cover w-full h-full"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r " />
                <div className="absolute inset-0 p-6 flex flex-col justify-center">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur-sm text-white w-fit"
                  >
                    <span>{banners[currentBanner].title}</span>
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl lg:text-3xl font-bold text-white mt-2"
                  >
                    {banners[currentBanner].description}
                  </motion.h2>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full"
            >
              <FaArrowRight />
            </button>

            {/* Indicateurs */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentBanner === index ? "bg-white w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Cartes Avantages */}
          <div className="space-y-4">
            {/* Carte Promotions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-4 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-2">
                  Offre limitée
                </span>
                <h3 className="text-lg font-bold mb-2">Offres Spéciales</h3>
                <button
                  onClick={() => router.push('/products')}
                  className="bg-white text-purple-600 px-4 py-1.5 rounded-full font-medium 
                    hover:bg-purple-50 transition-all transform hover:scale-105 w-full text-center text-sm"
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
              className="bg-white rounded-3xl p-4 shadow-lg"
            >
              <h3 className="text-sm font-bold mb-3 text-gray-900">Nos Avantages</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaTruck className="text-blue-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">Livraison Rapide</h4>
                    <p className="text-xs text-gray-500">En 24h chez vous</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaShieldAlt className="text-green-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">Qualité Garantie</h4>
                    <p className="text-xs text-gray-500">Produits certifiés</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FaRegClock className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">Service 24/7</h4>
                    <p className="text-xs text-gray-500">Support disponible</p>
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
