"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTruck, FaTools, FaHandshake, FaChartLine, FaShieldAlt, FaHeadset, FaHome, FaChevronRight, FaSearch, FaFilter } from 'react-icons/fa';

import Link from 'next/link';

const BASE_URL = "https://dubon-server.onrender.com";

interface Service {
  _id: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  availability?: string;
}

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

interface Advantage {
  _id: string;
  icon: string;
  title: string;
  description: string;
}

const ServicesPage = () => {
  const [mainServices, setMainServices] = useState<Service[]>([]);
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    availability: '',
    priceRange: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tentative de récupération des données
        const [servicesRes, advantagesRes, faqsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/services`),
          fetch(`${BASE_URL}/api/advantages`),
          fetch(`${BASE_URL}/api/faqs`)
        ]);

        // Si une des requêtes échoue, on affiche "Bientôt disponible"
        if (!servicesRes.ok || !advantagesRes.ok || !faqsRes.ok) {
          throw new Error('Données non disponibles');
        }

        const [servicesData, advantagesData, faqsData] = await Promise.all([
          servicesRes.json(),
          advantagesRes.json(),
          faqsRes.json()
        ]);

        setMainServices(servicesData);
        setAdvantages(advantagesData);
        setFaqs(faqsData);

      } catch (error) {
        console.error('Erreur:', error);
        // Message "Bientôt disponible" pour toutes les sections
        const comingSoonData = {
          _id: '1',
          icon: 'FaTools',
          title: "Bientôt disponible",
          description: "Cette section sera bientôt disponible",
          category: "default"
        };

        setMainServices([comingSoonData]);
        setAdvantages([{
          ...comingSoonData,
          icon: 'FaChartLine'
        }]);
        setFaqs([{
          _id: '1',
          question: "Bientôt disponible",
          answer: "Cette section sera bientôt disponible"
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour obtenir l'icône correspondante
  const getIcon = (iconName: string) => {
    const icons = {
      FaTruck: <FaTruck />,
      FaTools: <FaTools />,
      FaHandshake: <FaHandshake />,
      FaChartLine: <FaChartLine />,
      FaShieldAlt: <FaShieldAlt />,
      FaHeadset: <FaHeadset />
    };
    return icons[iconName as keyof typeof icons] || <FaTools />;
  };

  const ComingSoonCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-3 bg-white p-8 rounded-xl shadow-lg text-center"
    >
      <div className="text-6xl text-blue-600 mb-4 mx-auto">
        <FaTools className="mx-auto" />
      </div>
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">Bientôt disponible</h3>
      <p className="text-gray-600">Cette section sera bientôt disponible</p>
    </motion.div>
  );

  const filteredServices = mainServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filters.category || service.category === filters.category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-white px-4 py-3 rounded-lg shadow-sm"
      >
        <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
          <FaHome className="mr-1" />
          Accueil
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">Services</span>
      </motion.nav>

      {/* Services Principaux */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-gray-800 mb-4 md:mb-0"
            >
              Nos Services
            </motion.h2>
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="mr-2" />
                Filtres
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Toutes les catégories</option>
                        <option value="transport">Transport</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="conseil">Conseil</option>
                        <option value="support">Support</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Disponibilité
                      </label>
                      <select
                        value={filters.availability}
                        onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Toutes les disponibilités</option>
                        <option value="available">Disponible</option>
                        <option value="busy">Occupé</option>
                        <option value="scheduled">Planifié</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fourchette de prix
                      </label>
                      <select
                        value={filters.priceRange}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Tous les prix</option>
                        <option value="0-50000">0 - 50,000 CFA</option>
                        <option value="50000-100000">50,000 - 100,000 CFA</option>
                        <option value="100000">100,000+ CFA</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-4xl text-blue-600 mb-4 bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                    {getIcon(service.icon)}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              ))
            ) : (
              <ComingSoonCard />
            )}
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Nos Avantages
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.length > 0 ? (
              advantages.map((advantage) => (
                <motion.div 
                  key={advantage._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/10 p-6 rounded-xl backdrop-blur-sm"
                >
                  <div className="text-4xl mx-auto mb-4">
                    {getIcon(advantage.icon)}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                  <p className="text-white/80">{advantage.description}</p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 p-8 rounded-xl backdrop-blur-sm"
                >
                  <FaTools className="text-6xl mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">Bientôt disponible</h3>
                  <p className="text-white/80">Cette section sera bientôt disponible</p>
                </motion.div>
              </div>
            )}
          </div>
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
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <motion.div
                  key={faq._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center"
              >
                <FaTools className="text-6xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">Bientôt disponible</h3>
                <p className="text-gray-600">Cette section sera bientôt disponible</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage; 