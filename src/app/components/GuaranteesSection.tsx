"use client";

import React from 'react';
import { FaTruck, FaUndo, FaLock, FaHeadset } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface GuaranteeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const GuaranteeCard: React.FC<GuaranteeCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100"
    >
      <div className="text-4xl text-blue-600 mb-4 bg-blue-50 p-4 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const GuaranteesSection = () => {
  const guarantees = [
    {
      icon: <FaTruck />,
      title: "Livraison Rapide",
      description: "Service de livraison fiable et rapide pour tous vos achats"
    },
    {
      icon: <FaUndo />,
      title: "Retour 24/24",
      description: "Retours simples et gratuits pendant 24 heures"
    },
    {
      icon: <FaLock />,
      title: "Paiement Sécurisé",
      description: "Vos transactions sont 100% sécurisées"
    },
    {
      icon: <FaHeadset />,
      title: "Support Client 24/7",
      description: "Notre équipe est à votre service 24h/24 et 7j/7"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Confidentialité et Garanties
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Nous mettons un point d&apos;honneur à protéger vos informations personnelles, 
            à garantir vos paiements et à assurer votre satisfaction à travers nos services.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GuaranteeCard {...guarantee} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuaranteesSection; 