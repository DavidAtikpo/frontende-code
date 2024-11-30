"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaTruck, FaWarehouse, FaIndustry, FaChartBar, 
   FaUserTie, FaCogs,
  FaClipboardCheck, 
} from 'react-icons/fa';

const DetailedServiceCard = ({ 
  icon, 
  title, 
  description, 
  features 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  features: string[]
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-lg overflow-hidden"
  >
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="text-3xl text-blue-600 bg-blue-50 p-3 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-semibold ml-4 text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <FaClipboardCheck className="text-green-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
    <div className="px-6 py-4 bg-gray-50 border-t">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
      >
        En savoir plus
        <span className="ml-2">→</span>
      </motion.button>
    </div>
  </motion.div>
);

const DetailedServices = () => {
  const services = [
    {
      icon: <FaTruck />,
      title: "Transport & Livraison",
      description: "Service de transport professionnel et fiable pour tous vos besoins logistiques.",
      features: [
        "Livraison express",
        "Suivi en temps réel",
        "Transport sécurisé",
        "Couverture nationale"
      ]
    },
    {
      icon: <FaWarehouse />,
      title: "Stockage & Entreposage",
      description: "Solutions d'entreposage flexibles et sécurisées pour vos marchandises.",
      features: [
        "Espaces sécurisés",
        "Gestion des stocks",
        "Température contrôlée",
        "Accès 24/7"
      ]
    },
    {
      icon: <FaIndustry />,
      title: "Solutions Industrielles",
      description: "Services industriels complets pour optimiser votre production.",
      features: [
        "Maintenance préventive",
        "Réparation d'équipements",
        "Optimisation des processus",
        "Support technique"
      ]
    },
    {
      icon: <FaChartBar />,
      title: "Conseil en Performance",
      description: "Expertise en amélioration de la performance opérationnelle.",
      features: [
        "Analyse des processus",
        "Optimisation des coûts",
        "Gestion de projet",
        "Formation du personnel"
      ]
    },
    {
      icon: <FaUserTie />,
      title: "Services Professionnels",
      description: "Accompagnement professionnel pour le développement de votre entreprise.",
      features: [
        "Conseil stratégique",
        "Gestion des ressources",
        "Développement commercial",
        "Support administratif"
      ]
    },
    {
      icon: <FaCogs />,
      title: "Solutions Techniques",
      description: "Support technique et maintenance pour vos installations.",
      features: [
        "Maintenance préventive",
        "Dépannage rapide",
        "Installation d'équipements",
        "Mise à niveau technique"
      ]
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Nos Services Détaillés
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme complète de services professionnels conçus pour répondre 
            à tous vos besoins d&apos;entreprise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <DetailedServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedServices; 