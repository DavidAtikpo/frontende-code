"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaChevronRight, 
  FaQuestionCircle,
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaStore,
  FaHeadset
} from 'react-icons/fa';
import Link from 'next/link';

const FaqPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Toutes les questions', icon: <FaQuestionCircle /> },
    { id: 'account', name: 'Compte', icon: <FaUser /> },
    { id: 'orders', name: 'Commandes', icon: <FaShoppingCart /> },
    { id: 'payment', name: 'Paiement', icon: <FaCreditCard /> },
    { id: 'delivery', name: 'Livraison', icon: <FaTruck /> },
    { id: 'seller', name: 'Vendeurs', icon: <FaStore /> },
    { id: 'support', name: 'Support', icon: <FaHeadset /> }
  ];

  const faqItems = [
    {
      category: 'account',
      questions: [
        {
          q: "Comment créer un compte ?",
          a: "Pour créer un compte, cliquez sur 'S'inscrire' en haut de la page. Remplissez le formulaire avec vos informations personnelles et validez votre email."
        },
        {
          q: "Comment réinitialiser mon mot de passe ?",
          a: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Entrez votre email et suivez les instructions envoyées."
        },
        {
          q: "Comment modifier mes informations personnelles ?",
          a: "Connectez-vous à votre compte, allez dans 'Paramètres', puis 'Profil' pour modifier vos informations."
        }
      ]
    },
    {
      category: 'orders',
      questions: [
        {
          q: "Comment suivre ma commande ?",
          a: "Dans votre compte, section 'Mes commandes', vous trouverez toutes vos commandes et leur statut en temps réel."
        },
        {
          q: "Comment annuler une commande ?",
          a: "Vous pouvez annuler une commande dans les 30 minutes suivant la validation depuis 'Mes commandes'. Au-delà, contactez le support."
        }
      ]
    },
    {
      category: 'payment',
      questions: [
        {
          q: "Quels moyens de paiement acceptez-vous ?",
          a: "Nous acceptons les cartes bancaires, FedaPay, et les paiements mobiles (MTN, Orange Money)."
        },
        {
          q: "Les paiements sont-ils sécurisés ?",
          a: "Oui, tous nos paiements sont sécurisés et cryptés selon les normes bancaires en vigueur."
        }
      ]
    },
    {
      category: 'delivery',
      questions: [
        {
          q: "Quels sont les délais de livraison ?",
          a: "Les délais varient selon votre localisation : 24-48h en zone urbaine, 2-5 jours en zone rurale."
        },
        {
          q: "Comment suivre ma livraison ?",
          a: "Un code de suivi vous est envoyé par email. Utilisez-le sur notre site ou l'application pour suivre votre colis."
        }
      ]
    },
    {
      category: 'seller',
      questions: [
        {
          q: "Comment devenir vendeur ?",
          a: "Créez un compte professionnel, soumettez vos documents et attendez la validation de notre équipe."
        },
        {
          q: "Quelles sont les commissions ?",
          a: "Nos commissions varient selon les catégories de produits. Consultez notre grille tarifaire dans l'espace vendeur."
        }
      ]
    }
  ];

  const filteredFaqs = faqItems
    .filter(category => selectedCategory === 'all' || category.category === selectedCategory)
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
             q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(category => category.questions.length > 0);

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
        <span className="text-blue-600 font-medium">FAQ</span>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Questions Fréquentes
        </motion.h1>

        {/* Barre de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Catégories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Questions et Réponses */}
        <div className="space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  {categories.find(c => c.id === category.category)?.icon}
                  <span className="ml-2">
                    {categories.find(c => c.id === category.category)?.name}
                  </span>
                </h2>
                <div className="space-y-4">
                  {category.questions.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <h3 className="font-medium text-lg mb-2">{item.q}</h3>
                      <p className="text-gray-600">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <Link
            href="/help/technical"
            className="inline-flex items-center mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaHeadset className="mr-2" />
            Contacter le support technique
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqPage; 