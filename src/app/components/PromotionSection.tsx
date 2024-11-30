"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaClock, FaFire } from 'react-icons/fa';

const PromotionSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Offres Spéciales
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos meilleures offres et promotions exclusives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Grande Promotion */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/promo1.jpg"
                alt="Promotion principale"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 text-yellow-400 mb-3">
                  <FaFire className="text-xl" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Offre Limitée</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Promotion Exceptionnelle
                </h3>
                <p className="text-white/90 mb-4">
                  Profitez de -50% sur une sélection de produits
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white/80">
                    <FaClock />
                    <span>Fin dans 2 jours</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    En profiter <FaArrowRight />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Grid de petites promotions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative h-[180px]">
                  <Image
                    src={`/promo-small-${index}.jpg`}
                    alt={`Promotion ${index}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-lg font-semibold text-white mb-1">
                      Offre Flash #{index}
                    </h4>
                    <p className="text-white/90 text-sm mb-2">
                      Jusqu'à -30% de réduction
                    </p>
                    <Link 
                      href="#" 
                      className="text-white/90 text-sm hover:text-white flex items-center gap-1 transition-colors"
                    >
                      Voir l'offre <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bannière bas de promotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white text-center"
        >
          <h3 className="text-xl font-bold mb-2">
            🎉 Profitez de -10% supplémentaires avec le code DUBON10
          </h3>
          <p className="text-white/90">
            Offre valable sur tout le site jusqu'à la fin du mois
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionSection;
