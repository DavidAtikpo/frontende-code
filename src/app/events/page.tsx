"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaFilter,
  FaHome,
  FaChevronRight,
  FaTools,
  FaUsers,
  FaUser,
  FaEnvelope,
  FaTag,
  FaStar,
  FaHeart,
  FaGlobe,
  FaUserFriends,
  FaCheck
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Données statiques pour les statistiques
const statistics = [
  {
    icon: <FaCalendarAlt className="text-blue-500 text-2xl" />,
    value: "200+",
    label: "Événements réussis"
  },
  {
    icon: <FaHeart className="text-blue-500 text-2xl" />,
    value: "150+",
    label: "Mariages organisés"
  },
  {
    icon: <FaStar className="text-blue-500 text-2xl" />,
    value: "98%",
    label: "Clients satisfaits"
  },
  {
    icon: <FaUserFriends className="text-blue-500 text-2xl" />,
    value: "5000+",
    label: "Invités accueillis"
  }
];

// Services proposés
const services = [
  {
    name: "Mariages",
    description: "Organisation complète de votre mariage de rêve",
    image: "https://res.cloudinary.com/dubonservice/image/upload/v1737556453/dubon/baniere/lxwev0uwzcdmbe7ktiye.jpg",
    features: ["Décoration", "Traiteur", "Animation", "Photo/Vidéo"]
  },
  {
    name: "Anniversaires",
    description: "Des célébrations mémorables pour tous les âges",
    image: "https://res.cloudinary.com/dubonservice/image/upload/v1737556453/dubon/baniere/lxwev0uwzcdmbe7ktiye.jpg",
    features: ["Gâteau personnalisé", "Animation", "Décoration", "Musique"]
  },
  {
    name: "Conférences",
    description: "Organisation d'événements professionnels",
    image: "https://res.cloudinary.com/dubonservice/image/upload/v1737556453/dubon/baniere/cfxi5bd2u2rjwsarxlmp.jpg",
    features: ["Lieu adapté", "Équipement audio/vidéo", "Restauration", "Accueil"]
  },
  {
    name: "Concerts",
    description: "Production et organisation de concerts",
    image: "https://res.cloudinary.com/dubonservice/image/upload/v1737556453/dubon/baniere/npmrc1kouiul51amsjl2.jpg",
    features: ["Sonorisation", "Éclairage", "Sécurité", "Billetterie"]
  }
];

const EventsPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    date: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/events/public?type=all`);
      if (response.data.success) {
        setEvents(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.seller.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !filters.type || event.type === filters.type;

    const matchesDate = !filters.date || (() => {
      const eventDate = new Date(event.date);
      const today = new Date();
      
      switch (filters.date) {
        case 'today':
          return eventDate.toDateString() === today.toDateString();
        case 'week':
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          return eventDate >= today && eventDate <= nextWeek;
        case 'month':
          const nextMonth = new Date(today);
          nextMonth.setMonth(today.getMonth() + 1);
          return eventDate >= today && eventDate <= nextMonth;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesType && matchesDate;
  });

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-8 rounded-xl shadow-lg text-center"
    >
      <div className="text-6xl text-blue-600 mb-4 mx-auto">
        <FaTools className="mx-auto" />
      </div>
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">Aucun événement trouvé</h3>
      <p className="text-gray-600">Aucun événement ne correspond à vos critères de recherche.</p>
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
        <span className="text-blue-600 font-medium">Événements</span>
      </motion.nav>

      {/* Nouvelle section Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Votre événement mérite le meilleur
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              De la conception à la réalisation, nous donnons vie à vos moments les plus précieux
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/services/request" 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Demander un devis
              </Link>
              <Link href="/events/upcoming" 
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Voir les événements
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <div className="mb-3">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête et recherche */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-800 mb-4 md:mb-0"
          >
            Découvrez nos événements
          </motion.h1>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Rechercher un événement..."
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
                      Type d'événement
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Tous les types</option>
                      <option value="upcoming">À venir</option>
                      <option value="past">Passés</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <select
                      value={filters.date}
                      onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Toutes les dates</option>
                      <option value="today">Aujourd'hui</option>
                      <option value="week">Cette semaine</option>
                      <option value="month">Ce mois</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des événements */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={event.images?.[0] || '/placeholder-event.jpg'}
                      alt={event.title}
                      width={500}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.type === 'upcoming' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.type === 'upcoming' ? 'À venir' : 'Passé'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-2 text-blue-500" />
                        <span>{new Date(event.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaUser className="mr-2 text-blue-500" />
                        <span>{event.seller.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaEnvelope className="mr-2 text-blue-500" />
                        <span className="truncate">{event.seller.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaTag className="mr-2 text-blue-500" />
                        <span>Créé le {new Date(event.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    <Link 
                      href={`/events/${event.id}`}
                      className="block text-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Voir les détails
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>



      {/* Services proposés - Remplace la section Catégories populaires */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={service.image}
                  alt={service.name}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-xl">{service.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <FaCheck className="mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={`/services/${service.name.toLowerCase()}`}
                  className="mt-4 block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  En savoir plus
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section "Comment ça marche" - Nouvelle section */}
      <div className="bg-gray-50 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Choisissez votre date</h3>
              <p className="text-gray-600">Sélectionnez la date de votre événement et vérifiez notre disponibilité</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserFriends className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Consultation gratuite</h3>
              <p className="text-gray-600">Discutons de vos besoins et de vos envies pour créer l'événement parfait</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Profitez de votre événement</h3>
              <p className="text-gray-600">Détendez-vous pendant que nous nous occupons de tout</p>
            </div>
          </div>
        </div>
      </div>


      {/* Section Newsletter modifiée */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Restez informé de nos événements
            </h2>
            <p className="text-gray-600 mb-8">
              Recevez nos actualités et offres spéciales pour vos événements
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 