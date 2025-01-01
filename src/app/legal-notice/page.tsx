"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaChevronRight, FaBuilding, FaPhone, FaEnvelope, FaGavel, FaServer } from 'react-icons/fa';
import Link from 'next/link';

const LegalNoticePage = () => {
  const sections = [
    {
      id: 'company',
      title: 'Informations Légales',
      icon: <FaBuilding />,
      content: `
        Dénomination : [Nom de l'entreprise]
        Forme juridique : [Forme juridique]
        Capital social : [Montant] FCFA
        RCS : [Numéro]
        Siège social : [Adresse complète]
        N° TVA : [Numéro TVA]
      `
    },
    {
      id: 'publication',
      title: 'Direction de la Publication',
      icon: <FaGavel />,
      content: `
        Directeur de la publication : [Nom du directeur]
        Responsable de la rédaction : [Nom du responsable]
      `
    },
    {
      id: 'hosting',
      title: 'Hébergement',
      icon: <FaServer />,
      content: `
        Le site est hébergé par :
        [Nom de l'hébergeur]
        [Adresse de l'hébergeur]
        Téléphone : [Numéro]
      `
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: <FaEnvelope />,
      content: `
        Email : contact@dubon.com
        Téléphone : [Numéro]
        Adresse : [Adresse complète]
        
        Pour toute question concernant le site et ses services, vous pouvez nous contacter via ces coordonnées.
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-white px-4 py-3 rounded-lg shadow-sm mx-4 sm:mx-6 lg:mx-8 mt-4"
      >
        <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
          <FaHome className="mr-1" />
          Accueil
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">Mentions Légales</span>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12 text-gray-800"
        >
          Mentions Légales
        </motion.h1>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-2xl text-blue-600 mr-3">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {section.title}
                  </h2>
                </div>
                <div className="prose prose-blue max-w-none">
                  {section.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-600 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalNoticePage; 