"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaChevronRight, 
  FaTools,
  FaCar,
  FaShoppingBag,
  FaGraduationCap,
  FaBriefcase,
  FaHandshake,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BASE_URL = "https://dubon-server.onrender.com";

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  price?: number;
  image?: string;
  features?: string[];
  availability?: boolean;
  contactInfo?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
}

interface Category {
  _id: string;
  name: string;
  description: string;
}

const AutresPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, categoriesRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/autres-services`),
        axios.get(`${BASE_URL}/api/autres-categories`)
      ]);

      setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      FaCar: <FaCar />,
      FaShoppingBag: <FaShoppingBag />,
      FaGraduationCap: <FaGraduationCap />,
      FaBriefcase: <FaBriefcase />,
      FaHandshake: <FaHandshake />,
      FaTools: <FaTools />
    };
    return icons[iconName] || <FaTools />;
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const ComingSoonCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-8 rounded-xl shadow-lg text-center"
    >
      <div className="text-6xl text-blue-600 mb-4 mx-auto">
        <FaTools className="mx-auto" />
      </div>
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">Bientôt disponible</h3>
      <p className="text-gray-600">Nos services supplémentaires seront bientôt disponibles</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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
        <span className="text-blue-600 font-medium">Autres Services</span>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête et recherche */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-800 mb-4 md:mb-0"
          >
            Autres Services
          </motion.h1>
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

        {/* Filtres */}
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
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des services */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-2xl text-gray-600">Chargement...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {service.image ? (
                    <div className="relative h-48">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={500}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-blue-50 flex items-center justify-center">
                      <div className="text-6xl text-blue-600">
                        {getIcon(service.icon)}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                    
                    {service.features && service.features.length > 0 && (
                      <ul className="mb-4 space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <FaChevronRight className="mr-2 text-blue-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex justify-between items-center">
                      {service.price && (
                        <span className="text-xl font-bold text-blue-600">
                          {service.price.toLocaleString()} CFA
                        </span>
                      )}
                      <Link
                        href={`/autres/${service._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                      >
                        En savoir plus
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <ComingSoonCard />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutresPage;
