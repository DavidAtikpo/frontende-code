"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaChevronRight, 
  FaHistory, 
  FaBullseye, 
  FaHandshake, 
  FaUsers,
  FaGlobe,
  FaMedal
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

const AboutPage = () => {
  const sections = [
    {
      id: 'histoire',
      title: 'Notre Histoire',
      icon: <FaHistory />,
      content: `
        Fondée en [année], Dubon Service Event est née d'une vision simple mais ambitieuse : créer une plateforme qui connecte les meilleurs services et produits locaux avec les consommateurs.

        Notre parcours a commencé avec une équipe passionnée, déterminée à révolutionner l'expérience du commerce en ligne en Afrique. Au fil des années, nous avons grandi, innové et constamment amélioré nos services pour mieux servir notre communauté.
      `
    },
    {
      id: 'mission',
      title: 'Notre Mission',
      icon: <FaBullseye />,
      content: `
        Chez Dubon Service Event , notre mission est de :
        • Faciliter l'accès aux services et produits de qualité
        • Soutenir les entrepreneurs et commerçants locaux
        • Créer des opportunités économiques durables
        • Promouvoir l'excellence et l'innovation dans le commerce en ligne
        
        Nous nous efforçons chaque jour de créer une expérience exceptionnelle pour nos utilisateurs et partenaires.
      `
    },
    {
      id: 'valeurs',
      title: 'Nos Valeurs',
      icon: <FaHandshake />,
      content: `
        Nos valeurs fondamentales guident chacune de nos actions :
        • Intégrité : Nous agissons avec honnêteté et transparence
        • Excellence : Nous visons constamment la qualité et l'amélioration
        • Innovation : Nous encourageons la créativité et l'adaptation
        • Communauté : Nous créons des liens durables avec nos partenaires et clients
      `
    },
    {
      id: 'impact',
      title: 'Notre Impact',
      icon: <FaGlobe />,
      content: `
        DuBon s'engage à avoir un impact positif sur :
        • L'économie locale en soutenant les entrepreneurs
        • L'emploi en créant des opportunités professionnelles
        • L'environnement en promouvant des pratiques durables
        • La société en facilitant l'accès à des services de qualité
      `
    },
    {
      id: 'realisations',
      title: 'Nos Réalisations',
      icon: <FaMedal />,
      content: `
        Depuis notre création :
        • Plus de [X] partenaires nous ont rejoint
        • Plus de [X] clients satisfaits
        • Présence dans [X] villes
        • [X] transactions réussies
        
        Ces chiffres témoignent de la confiance que nos utilisateurs nous accordent.
      `
    }
  ];

  const teamMembers = [
    {
      name: "",
      role: "CEO & Fondateur",
      image: ""
    },
    {
      name: "",
      role: "Directrice des Opérations",
      image: ""
    },
    // Ajoutez d'autres membres selon vos besoins
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
        <span className="text-blue-600 font-medium">À Propos de Nous</span>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12 text-gray-800"
        >
          À Propos de Dubon Service Event
        </motion.h1>

        {/* Sections principales */}
        <div className="space-y-8 mb-16">
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

        {/* Section Équipe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden p-6"
        >
          <div className="flex items-center mb-6">
            <FaUsers className="text-2xl text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Notre Équipe</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage; 