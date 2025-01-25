"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers, FaTicketAlt, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

const DEFAULT_IMAGE = '/default-event.jpg';

const getImageUrl = (imagePath: string | string[]) => {
  try {
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!path) return DEFAULT_IMAGE;

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    return DEFAULT_IMAGE;
  } catch (error) {
    console.error('Erreur dans getImageUrl:', error);
    return DEFAULT_IMAGE;
  }
};

interface Event {
  id: string;
  title: string;
  description: string;
  images: string[];
  date: string;
  time: string;
  location: string;
  price: number;
  capacity: number;
  registeredCount: number;
  organizer: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/events/public`, {
          headers: {
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        });

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setEvents(data.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement des événements...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4"
        >
          <FaCalendar className="text-blue-500 text-3xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Bientôt disponible</h3>
        <p className="text-gray-600">Nos événements seront bientôt disponibles !</p>
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-0 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 mb-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Nos Événements
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Découvrez nos prochains événements et réservez vos places
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={getImageUrl(event.images)}
                  alt={event.title}
                  width={500}
                  height={300}
                  className="object-cover w-full h-full"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white truncate">{event.title}</h3>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-semibold
                    ${event.status === 'upcoming' ? 'bg-green-500 text-white' : ''}
                    ${event.status === 'ongoing' ? 'bg-yellow-500 text-white' : ''}
                    ${event.status === 'completed' ? 'bg-gray-500 text-white' : ''}
                  `}>
                    {event.status === 'upcoming' ? 'À venir' : ''}
                    {event.status === 'ongoing' ? 'En cours' : ''}
                    {event.status === 'completed' ? 'Terminé' : ''}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4 line-clamp-2 h-12">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaCalendar className="text-blue-500" />
                    <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                    <FaClock className="text-blue-500 ml-2" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span className="text-sm truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaUsers className="text-blue-500" />
                    <span className="text-sm">{event.registeredCount}/{event.capacity} participants</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-2xl text-blue-600">
                    {typeof event.price === 'number' ? `${event.price.toLocaleString()} CFA` : 'Gratuit'}
                  </span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    href={`/events/${event.id}`}
                    className="block text-center bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FaEye />
                      Détails
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
} 