"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaTools, FaHandshake, FaChartLine, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import Image from 'next/image';
import DetailedServices from '../components/DetailedServices';

// const fadeInUp = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.5 }
// };

// const ServiceCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
//   <motion.div
//     whileHover={{ y: -5, scale: 1.02 }}
//     className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//   >
//     <div className="text-4xl text-blue-600 mb-4 bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center">
//       {icon}
//     </div>
//     <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
//     <p className="text-gray-600">{description}</p>
//   </motion.div>
// );

const ServicesPage = () => {
  const mainServices = [
    {
      icon: <FaTruck />,
      title: "Transport & Logistique",
      description: "Solutions de transport personnalisées et gestion logistique complète pour vos besoins commerciaux."
    },
    {
      icon: <FaTools />,
      title: "Maintenance Industrielle",
      description: "Services de maintenance préventive et corrective pour optimiser la performance de vos équipements."
    },
    {
      icon: <FaHandshake />,
      title: "Conseil & Accompagnement",
      description: "Expertise stratégique et accompagnement personnalisé pour le développement de votre entreprise."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services-hero.jpg"
            alt="Services Dubon"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Nos Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto"
          >
            Des solutions innovantes pour répondre à tous vos besoins professionnels
          </motion.p>
        </div>
      </section>

      {/* Services Principaux */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            Nos Services Principaux
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl text-blue-600 mb-4 bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Détaillés */}
      <DetailedServices />

      {/* Section Avantages */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Pourquoi Choisir Dubon Services ?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <FaChartLine className="text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Performance</h3>
              <p className="text-white/80">Des résultats mesurables et une amélioration continue de nos services</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <FaShieldAlt className="text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fiabilité</h3>
              <p className="text-white/80">Une expertise reconnue et des engagements respectés</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <FaHeadset className="text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Support 24/7</h3>
              <p className="text-white/80">Une équipe disponible pour vous accompagner à tout moment</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6 text-gray-800"
          >
            Prêt à Commencer ?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Contactez-nous dès aujourd&apos;hui pour discuter de vos besoins et découvrir comment nous pouvons vous aider.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Contactez-nous
          </motion.button>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            Questions Fréquentes
          </motion.h2>
          <div className="space-y-6">
            {[
              {
                question: "Quels types d'entreprises accompagnez-vous ?",
                answer: "Nous accompagnons tous types d'entreprises, des startups aux grandes entreprises, dans divers secteurs d'activité."
              },
              {
                question: "Comment démarrer une collaboration avec Dubon Services ?",
                answer: "Il suffit de nous contacter pour un premier rendez-vous gratuit où nous évaluerons ensemble vos besoins."
              },
              {
                question: "Quels sont vos délais d'intervention ?",
                answer: "Nos délais varient selon le service, mais nous garantissons une réponse sous 24h et une intervention rapide."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage; 