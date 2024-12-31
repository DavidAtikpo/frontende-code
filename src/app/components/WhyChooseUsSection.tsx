"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHandshake, 
  FaUserShield, 
  FaThumbsUp, 
  FaGlobe, 
  FaHeart,
  FaUsers
} from 'react-icons/fa';

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: <FaHandshake className="text-4xl text-blue-500" />,
      title: "Partenaires de Confiance",
      description: "Nous collaborons uniquement avec des professionnels vérifiés et certifiés"
    },
    {
      icon: <FaUserShield className="text-4xl text-green-500" />,
      title: "Sécurité Garantie",
      description: "Protection des données et transactions sécurisées à 100%"
    },
    {
      icon: <FaThumbsUp className="text-4xl text-purple-500" />,
      title: "Qualité Assurée",
      description: "Produits et services rigoureusement sélectionnés"
    },
    {
      icon: <FaGlobe className="text-4xl text-red-500" />,
      title: "Accessibilité",
      description: "Plateforme disponible 24/7 partout dans le pays"
    },
    {
      icon: <FaHeart className="text-4xl text-pink-500" />,
      title: "Satisfaction Client",
      description: "Service client réactif et à l'écoute de vos besoins"
    },
    {
      icon: <FaUsers className="text-4xl text-yellow-500" />,
      title: "Communauté Active",
      description: "Rejoignez une communauté dynamique et grandissante"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pourquoi Nous Choisir ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez ce qui fait de notre plateforme le choix idéal pour tous vos besoins
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-full bg-gray-50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-700 font-medium mb-6">
            Rejoignez les milliers d'utilisateurs satisfaits qui nous font confiance
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Commencer Maintenant
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection; 