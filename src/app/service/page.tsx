"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTruck, FaTools, FaHandshake, FaChartLine, FaShieldAlt, FaHeadset, FaHome, FaChevronRight, FaSearch, FaFilter, FaBolt, FaBox, FaGlobeAfrica } from 'react-icons/fa';
import Image from 'next/image';

import Link from 'next/link';

import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

interface Service {
  _id: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  availability?: string;
  images?: string[];
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

interface BackendService {
  id?: string;
  _id?: string;
  icon?: string;
  title: string;
  description: string;
  category: string;
  status?: string;
  availability?: string;
  images?: string[];
}

// Ajout des données statiques pour les zones de couverture et informations supplémentaires
const coverageAreas = [
  {
    id: 1,
    title: "Distribution Locale",
    description: "Livraison rapide dans toute la ville et ses environs",
    icon: "FaTruck",
    features: ["Livraison en 24h", "Suivi en temps réel", "Prix abordables"]
  },
  {
    id: 2,
    title: "Distribution Régionale",
    description: "Service de livraison fiable dans toute la région",
    icon: "FaGlobeAfrica",
    features: ["Planification optimisée", "Service sécurisé", "Tarifs compétitifs"]
  }
];

const serviceFeatures = [
  {
    id: 1,
    title: "Dubon Express",
    description: "Service de livraison ultra-rapide pour vos besoins urgents",
    frequency: "24/7",
    icon: "FaBolt"
  },
  {
    id: 2,
    title: "Entretien Professionnel",
    description: "Services d'entretien et de maintenance de qualité",
    frequency: "Sur rendez-vous",
    icon: "FaTools"
  },
  {
    id: 3,
    title: "Distribution Spécialisée",
    description: "Solutions logistiques adaptées à vos besoins spécifiques",
    frequency: "Planification flexible",
    icon: "FaBox"
  }
];

// Données statiques pour les avantages
const staticAdvantages = [
  {
    id: 1,
    icon: "FaShieldAlt",
    title: "Service Fiable",
    description: "Une équipe professionnelle à votre service 24/7"
  },
  {
    id: 2,
    icon: "FaHandshake",
    title: "Support Client",
    description: "Assistance personnalisée et suivi de qualité"
  },
  {
    id: 3,
    icon: "FaChartLine",
    title: "Performance",
    description: "Solutions optimisées pour votre satisfaction"
  }
];

// Données statiques pour les FAQs
const staticFaqs = [
  {
    id: 1,
    question: "Comment fonctionne la livraison express ?",
    answer: "Notre service de livraison express assure une livraison rapide dans un délai de 24h avec suivi en temps réel."
  },
  {
    id: 2,
    question: "Quelles zones sont couvertes par vos services ?",
    answer: "Nous couvrons toute la ville et ses environs pour la distribution locale, ainsi que les régions principales pour la distribution régionale."
  },
  {
    id: 3,
    question: "Comment puis-je suivre ma livraison ?",
    answer: "Un système de suivi en temps réel est disponible pour tous nos services de livraison."
  }
];

// Ajout des services statiques par défaut
const defaultServices = [
  {
    _id: '1',
    icon: 'FaTruck',
    title: "Service de Livraison Express",
    description: "Livraison rapide et sécurisée dans toute la ville",
    category: "transport",
    availability: "available"
  },
  {
    _id: '2',
    icon: 'FaTools',
    title: "Maintenance Professionnelle",
    description: "Services d'entretien et de réparation de qualité",
    category: "maintenance",
    availability: "available"
  },
  {
    _id: '3',
    icon: 'FaHandshake',
    title: "Service Client Premium",
    description: "Support client personnalisé et réactif",
    category: "support",
    availability: "available"
  },
  {
    _id: '4',
    icon: 'FaBox',
    title: "Distribution Spécialisée",
    description: "Solutions logistiques sur mesure pour vos besoins",
    category: "transport",
    availability: "available"
  }
];

const DEFAULT_IMAGE = '/default-service.jpg';

const getImageUrl = (images?: string[]) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return DEFAULT_IMAGE;
  }

  const firstImage = images[0];
  if (!firstImage) return DEFAULT_IMAGE;

  // Si c'est une URL complète, la retourner
  if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
    return firstImage;
  }

  return DEFAULT_IMAGE;
};

const ServicesPage: React.FC = () => {
  console.log('Initializing ServicesPage');
  
  const [mainServices, setMainServices] = useState<Service[]>(() => {
    console.log('Setting initial mainServices with defaultServices');
    return defaultServices;
  });
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    availability: ''
  });

  // Fonction pour obtenir l'icône correspondante
  const getIcon = (iconName: string) => {
    const icons = {
      FaTruck: <FaTruck />,
      FaTools: <FaTools />,
      FaHandshake: <FaHandshake />,
      FaChartLine: <FaChartLine />,
      FaShieldAlt: <FaShieldAlt />,
      FaHeadset: <FaHeadset />,
      FaBolt: <FaBolt />,
      FaBox: <FaBox />,
      FaGlobeAfrica: <FaGlobeAfrica />
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching services...');
        const servicesRes = await fetch(`${BASE_URL}/api/services/public`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        const response = await servicesRes.json();
        console.log('API Response:', JSON.stringify(response, null, 2));

        if (response.success && Array.isArray(response.data)) {
          console.log('Setting services:', response.data.length);
          // Formater les services reçus pour correspondre à notre interface
          const formattedServices = response.data.map((service: BackendService) => ({
            _id: service._id || service.id || String(Math.random()),
            icon: service.icon || 'FaTools',
            title: service.title,
            description: service.description,
            category: service.category,
            availability: service.availability || service.status || 'available',
            images: Array.isArray(service.images) ? service.images : []
          }));
          console.log('Formatted services:', formattedServices);
          setMainServices(formattedServices); // Ne plus inclure les services par défaut
        } else {
          console.log('Using default services (invalid response format)');
          setMainServices(defaultServices);
        }

      } catch (error) {
        console.error('Erreur détaillée:', error);
        setMainServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les services en fonction de la recherche et des filtres
  const filteredServices = Array.isArray(mainServices) ? mainServices.filter(service => {
    if (!service || typeof service !== 'object') return false;
    
    const matchesSearch = (service.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (service.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesCategory = !filters.category || service.category === filters.category;
    const matchesAvailability = !filters.availability || service.availability === filters.availability;

    return matchesSearch && matchesCategory && matchesAvailability;
  }) : [];

  console.log('mainServices:', mainServices);
  console.log('filteredServices:', filteredServices);
  console.log('loading:', loading);

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

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Services Professionnels Dubon</h1>
            <p className="text-xl mb-8 text-blue-100">Solutions logistiques et services d'excellence pour votre entreprise</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-50 transition-colors"
              onClick={() => window.location.href = '/contact'}
            >
              Demander un Service
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Section des caractéristiques principales */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            Nos Services Spécialisés
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceFeatures.map((feature) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl text-blue-600 mb-4">
                  {getIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="text-sm text-blue-600">
                  Fréquence: {feature.frequency}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section des zones de couverture */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            Zones de Couverture
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coverageAreas.map((area) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="text-4xl text-blue-600 mb-4">
                  {getIcon(area.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-3">{area.title}</h3>
                <p className="text-gray-600 mb-4">{area.description}</p>
                <ul className="space-y-2">
                  {area.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <FaChevronRight className="text-blue-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section des services principaux */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {service.images && service.images.length > 0 && (
                    <div className="relative h-48 mb-4">
                      <Image
                        src={getImageUrl(service.images)}
                        alt={service.title}
                        width={500}
                        height={300}
                        className="object-cover w-full h-full rounded-lg"
                        priority
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">
                      {service.category}
                    </span>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      service.availability === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {service.availability === 'available' ? 'Disponible' : 'Occupé'}
                    </span>
                  </div>
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
            {staticAdvantages.map((advantage) => (
              <motion.div 
                key={advantage.id}
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
            ))}
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
            {staticFaqs.map((faq) => (
              <motion.div
                key={faq.id}
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

      {/* Section CTA */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Prêt à commencer ?</h2>
          <p className="text-gray-600 mb-8">Contactez-nous dès aujourd'hui pour bénéficier de nos services professionnels</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/service/request'}
          >
            Demander un Service
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default ServicesPage; 