"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'upcoming' | 'past';
  date: string;
  images: string[];
  sellerId: string;
  seller?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events...');
        const response = await axios.get(`${BASE_URL}/api/events/public?type=all`);
        console.log('Response:', response.data);
        
        if (response.data.success) {
          const sortedEvents = response.data.data.sort((a: Event, b: Event) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          setEvents(sortedEvents);
        } else {
          console.error('Erreur API:', response.data.message);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </motion.div>
    );
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FaCalendar className="text-yellow-500 text-3xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun événement</h3>
        <p className="text-gray-600">
          Aucun événement n'est disponible pour le moment.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative h-48">
            <Image
              src={event.images[0] || '/placeholder-event.jpg'}
              alt={event.title}
              width={400}
              height={300}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              {event.type === 'upcoming' ? 'À venir' : 'Passé'}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-gray-400" />
                <span className="text-sm">{new Date(event.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
            <Link 
              href={`/events/${event.id}`}
              className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir les détails
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 