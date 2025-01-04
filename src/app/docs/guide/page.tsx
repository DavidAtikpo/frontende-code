"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaChevronRight, 
  FaBook,
  FaUser,
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaStore,
  FaList
} from 'react-icons/fa';
import Link from 'next/link';

const UserGuidePage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Premiers pas',
      icon: <FaBook />,
      content: `
        Bienvenue sur Dubon Service Event ! Voici comment commencer :
        
        1. Créez votre compte
        2. Complétez votre profil
        3. Explorez nos services
        4. Effectuez votre première commande
        
        Notre plateforme est conçue pour être intuitive et facile à utiliser.
      `
    },
    {
      id: 'account-management',
      title: 'Gestion du compte',
      icon: <FaUser />,
      content: `
        Gérez votre compte efficacement :
        
        • Modification du profil
        • Changement de mot de passe
        • Paramètres de notification
        • Préférences de communication
        • Gestion des adresses
      `
    },
    {
      id: 'ordering',
      title: 'Commander un service',
      icon: <FaShoppingCart />,
      content: `
        Pour commander un service :
        
        1. Sélectionnez le service souhaité
        2. Choisissez vos options
        3. Ajoutez au panier
        4. Vérifiez votre commande
        5. Procédez au paiement
      `
    },
    {
      id: 'payment',
      title: 'Paiement',
      icon: <FaCreditCard />,
      content: `
        Modes de paiement disponibles :
        
        • Carte bancaire
        • FedaPay
        • Mobile Money (MTN, Moov)
        • Paiement à la livraison
        • Paiement à la comande
        
        Tous les paiements sont sécurisés et cryptés.
      `
    },
    {
      id: 'delivery',
      title: 'Livraison',
      icon: <FaTruck />,
      content: `
        Suivi de votre commande :
        
        • Confirmation de commande par email
        • Suivi en temps réel
        • Notifications de statut
        • Options de livraison express
        • Points de retrait disponibles
      `
    },
    {
      id: 'seller',
      title: 'Devenir vendeur',
      icon: <FaStore />,
      content: `
        Pour devenir vendeur :
        
        1. Créez un compte professionnel
        2. Soumettez vos documents
        3. Configurez votre boutique
        4. Ajoutez vos produits/services
        5. Commencez à vendre
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-white px-4 py-3 shadow-sm mx-4 sm:mx-6 lg:mx-8 mt-4"
      >
        <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
          <FaHome className="mr-1" />
          Accueil
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <Link href="/help" className="hover:text-blue-600 transition-colors">
          Aide
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">Guide d'utilisation</span>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-semibold text-lg mb-4 flex items-center">
                <FaList className="mr-2" />
                Sommaire
              </h2>
              <nav className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{section.icon}</span>
                      {section.title}
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {sections.map(section => (
              <div
                key={section.id}
                className={`bg-white rounded-lg shadow-md p-6 ${
                  activeSection === section.id ? 'block' : 'hidden'
                }`}
              >
                <div className="flex items-center mb-6">
                  <div className="text-2xl text-blue-600 mr-3">
                    {section.icon}
                  </div>
                  <h1 className="text-2xl font-bold">{section.title}</h1>
                </div>
                <div className="prose prose-blue max-w-none">
                  {section.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-600 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserGuidePage; 