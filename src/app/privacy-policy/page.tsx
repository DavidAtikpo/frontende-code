"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaChevronRight, FaShieldAlt, FaUserLock, FaDatabase, FaUserEdit } from 'react-icons/fa';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <FaShieldAlt />,
      content: `Cette politique de confidentialité décrit la manière dont nous collectons, sauvegardons, utilisons, protégeons et archivons les données à caractère personnel conformément aux lois en vigueur, notamment le Règlement Général sur la Protection des Données (RGPD) ou toute législation nationale applicable.`
    },
    {
      id: 'collecte',
      title: 'Collecte des Données Personnelles',
      icon: <FaUserLock />,
      content: `Nous collectons les données personnelles dans le cadre de :
        • La création d'un compte utilisateur
        • L'accès et l'utilisation des fonctionnalités de l'application
        • La communication avec le service client
        
        Types de données collectées :
        • Informations d'identification : nom, prénom, adresse email, numéro de téléphone
        • Données de connexion : adresse IP, type de navigateur, localisation
        • Informations supplémentaires fournies par l'utilisateur`
    },
    {
      id: 'protection',
      title: 'Sauvegarde et Protection des Données',
      icon: <FaDatabase />,
      content: `Les données collectées sont sauvegardées sur des serveurs sécurisés, utilisant :
        • Chiffrement des données lors du stockage et des transferts
        • Pare-feu et contrôle d'accès
        • Sauvegardes régulières et redondantes
        • Audits réguliers de sécurité
        • Formation du personnel sur la gestion des informations sensibles`
    },
    {
      id: 'utilisation',
      title: 'Utilisation des Données Personnelles',
      icon: <FaUserEdit />,
      content: `Les données collectées sont utilisées pour :
        • Fournir les services et fonctionnalités de l'application
        • Améliorer l'expérience utilisateur
        • Garantir la sécurité et la conformité légale
        
        Partage des données uniquement dans les cas suivants :
        • Obligation légale ou demande des autorités compétentes
        • Consentement explicite de l'utilisateur`
    },
    {
      id: 'archivage',
      title: 'Archivage des Données',
      icon: <FaDatabase />,
      content: `Les données personnelles sont conservées uniquement pendant la durée nécessaire pour remplir les objectifs pour lesquels elles ont été collectées, conformément aux exigences légales. À l'issue de cette période :
        • Elles sont supprimées de manière sécurisée
        • Ou archivées dans un environnement protégé si requis par la loi
        
        La durée de conservation varie selon le type de données et les obligations légales applicables.`
    },
    {
      id: 'droits',
      title: 'Droits des Utilisateurs',
      icon: <FaUserEdit />,
      content: `Conformément à la réglementation en vigueur, vous disposez des droits suivants :
        • Accès à vos données personnelles
        • Rectification ou suppression de vos données
        • Opposition ou limitation au traitement de vos données
        • Portabilité des données
        
        Pour exercer ces droits, contactez-nous à l'adresse suivante : privacy@dubon.com`
    },
    {
      id: 'modifications',
      title: 'Modifications de la Politique',
      icon: <FaShieldAlt />,
      content: `Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les utilisateurs seront informés de toute mise à jour par :
        • Des notifications sur l'application
        • Un email d'information
        • Une mention spéciale lors de la prochaine connexion
        
        Il est recommandé de consulter régulièrement cette politique pour rester informé des évolutions.`
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
        <span className="text-blue-600 font-medium">Politique de Confidentialité</span>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12 text-gray-800"
        >
          Politique de Confidentialité
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mt-8"
          >
            <p className="text-gray-600 text-center">
              Pour toute question concernant notre politique de confidentialité, 
              contactez-nous à l'adresse suivante : 
              <a href="mailto:privacy@dubon.com" className="text-blue-600 hover:underline ml-1">
                privacy@dubon.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 