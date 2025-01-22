"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaCalendar, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaTools, 
  FaHome, 
  FaChevronRight,
  FaSearch,
  FaFilter 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Training {
  _id: string;
  id?: string;  // Pour la compatibilité avec l'API
  title: string;
  description: string;
  price: number;
  duration: string;
  startDate: string;
  maxParticipants: number;
  enrolledCount: number;
  location: string;
  category: string;
  level: string;
  image: string;
  instructor?: string;
}

const DEFAULT_IMAGE = '/default-training.jpg';

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string | string[]): string => {
  if (!imagePath) return DEFAULT_IMAGE;

  // Si c'est une string simple
  if (typeof imagePath === 'string') {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return DEFAULT_IMAGE;
  }

  // Si c'est un tableau
  if (imagePath.length === 0) return DEFAULT_IMAGE;
  const firstImage = imagePath[0];
  
  if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
    return firstImage;
  }

  return DEFAULT_IMAGE;
};

// Fonction pour obtenir l'icône correspondante
const getIcon = (iconName: string) => {
  const icons = {
    FaUsers: <FaUsers />,
    FaTools: <FaTools />,
    FaCalendar: <FaCalendar />,
    FaMapMarkerAlt: <FaMapMarkerAlt />
  };
  return icons[iconName as keyof typeof icons] || <FaTools />;
};

// Données statiques pour les avantages de la formation
const trainingBenefits = [
  {
    id: 1,
    icon: "FaUsers",
    title: "Formation en Groupe",
    description: "Apprenez et échangez avec d'autres participants"
  },
  {
    id: 2,
    icon: "FaTools",
    title: "Pratique Intensive",
    description: "Des exercices pratiques et des projets concrets"
  },
  {
    id: 3,
    icon: "FaCalendar",
    title: "Planning Flexible",
    description: "Des horaires adaptés à vos disponibilités"
  }
];

// Données pour les statistiques
const trainingStats = [
  {
    id: 1,
    value: "500+",
    label: "Apprenants Formés"
  },
  {
    id: 2,
    value: "50+",
    label: "Formations Disponibles"
  },
  {
    id: 3,
    value: "95%",
    label: "Taux de Satisfaction"
  }
];

// Données pour les domaines de formation
const trainingDomains = [
  {
    id: 1,
    icon: "FaUsers",
    title: "Business",
    areas: ["Entrepreneuriat", "Gestion d'entreprise", "Finance", "Stratégie commerciale"]
  },
  {
    id: 2,
    icon: "FaTools",
    title: "Marketing Digital",
    areas: ["Réseaux sociaux", "SEO", "Content Marketing", "E-commerce"]
  },
  {
    id: 3,
    icon: "FaCalendar",
    title: "Marketing & Communication",
    areas: ["Marketing stratégique", "Relations publiques", "Communication d'entreprise", "Branding"]
  }
];

// Données pour les témoignages
const testimonials = [
  {
    id: 1,
    name: "Jean Dupont",
    role: "Chef d'équipe",
    comment: "La formation m'a permis d'améliorer significativement mes compétences en gestion d'équipe.",
    rating: 5
  },
  {
    id: 2,
    name: "Marie Claire",
    role: "Technicienne",
    comment: "Une formation pratique et complète qui m'a donné tous les outils nécessaires.",
    rating: 5
  },
  {
    id: 3,
    name: "Paul Martin",
    role: "Responsable logistique",
    comment: "Excellente formation avec des formateurs expérimentés et professionnels.",
    rating: 5
  }
];

const TrainingList = () => {
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    priceRange: ''
  });

  useEffect(() => {
    fetchTrainings();
  }, [filters]);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/training/get-all`);
      console.log('Training response:', response.data);
      const trainingsData = Array.isArray(response.data.data) ? response.data.data : [];
      trainingsData.forEach((training: Training) => {
        console.log('Training ID:', training._id || training.id, 'Training:', training);
      });
      // Utiliser _id ou id selon ce qui est disponible
      const validTrainings = trainingsData.map((training: any) => ({
        ...training,
        _id: training._id || training.id // Utiliser _id s'il existe, sinon utiliser id
      }));
      setTrainings(validTrainings);
    } catch (error) {
      console.error('Erreur:', error);
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filters.category || training.category === filters.category;
    const matchesLevel = !filters.level || training.level === filters.level;
    const matchesPrice = !filters.priceRange || (() => {
      const [min, max] = filters.priceRange.split('-').map(Number);
      return training.price >= min && (!max || training.price <= max);
    })();

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
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
      <p className="text-gray-600">Nos formations seront bientôt disponibles</p>
    </motion.div>
  );

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
        <span className="text-blue-600 font-medium">Formations</span>
      </motion.nav>

      {/* Hero Section avec Motion */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Centre de Formation Dubon
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-blue-100"
          >
            Développez vos compétences avec nos formations professionnelles
          </motion.p>
        </div>
      </motion.section>
{/* Section Formations du Backend */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Nos Formations Disponibles
          </motion.h2>
          
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Rechercher une formation..."
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

          {/* Liste des formations */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrainings.length > 0 ? (
                filteredTrainings.map((training) => (
                  <motion.div
                    key={training._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-48">
                      <Image
                        src={getImageUrl(training.image)}
                        alt={training.title}
                        width={500}
                        height={300}
                        className="object-cover w-full h-full"
                        priority
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{training.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {training.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{training.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendar className="mr-2" />
                          <span>Début: {new Date(training.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaUsers className="mr-2" />
                          <span>Places: {training.enrolledCount}/{training.maxParticipants}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{training.location}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {training.price.toLocaleString()} CFA
                        </span>
                        <Link 
                          href={`/trainings/${training._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                        >
                          Voir détails
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
      </section>

      {/* Section Statistiques */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Centre de Formation Dubon Services Event
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingStats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Domaines de Formation */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Nos Domaines de Formation
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingDomains.map((domain) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="text-4xl text-blue-600 mb-4">
                  {getIcon(domain.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-4">{domain.title}</h3>
                <ul className="space-y-2">
                  {domain.areas.map((area, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <FaChevronRight className="text-blue-500 mr-2" />
                      {area}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Pourquoi Choisir Nos Formations
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingBenefits.map((benefit) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl shadow-lg"
              >
                <div className="text-4xl text-blue-600 mb-4">
                  {getIcon(benefit.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12 text-white"
          >
            Ce que disent nos apprenants
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaTools key={i} className="w-4 h-4" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6"
          >
            Prêt à développer vos compétences ?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mb-8"
          >
            Inscrivez-vous maintenant et commencez votre parcours de formation avec nous.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-colors"
            onClick={() => router.push('/contact')}
          >
            Contactez-nous
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default TrainingList; 