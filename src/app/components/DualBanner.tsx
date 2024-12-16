"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const DualBanner = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 py-12">
      {/* Premier banner */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl shadow-lg group"
      >
        <div className="relative h-[300px]">
          <Image
            src="/banner1.jpg"
            alt="Promotion Banner 1"
            width={500}
            height={300}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Offres Spéciales</h3>
            <p className="mb-4">Découvrez nos meilleures offres du moment</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors"
            >
              Voir plus
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Deuxième banner */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl shadow-lg group"
      >
        <div className="relative h-[300px]">
          <Image
            src="/banner2.jpg"
            alt="Promotion Banner 2"
            width={500}
            height={300}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
          <div className="absolute bottom-0 right-0 p-8 text-white text-right">
            <h3 className="text-2xl font-bold mb-2">Nouveautés</h3>
            <p className="mb-4">Explorez nos derniers produits</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors"
            >
              Découvrir
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DualBanner;
  