"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers, FaTicketAlt, FaCheck, FaHeart, FaGem } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

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

interface Props {
  eventId: string;
}

export default function EventDetailsClient({ eventId }: Props) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guestCount: '',
    budget: '',
    specialRequests: '',
    preferences: ''
  });
  const router = useRouter();
  

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/events/details/${eventId}`);
        const data = await response.json();

        if (data.success && data.data) {
          setEvent(data.data);
        } else {
          setError('Événement non trouvé');
        }
      } catch (error) {
        setError('Erreur lors du chargement de l\'événement');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/events/request/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        router.push('/events/request-success');
      } else {
        setError('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi de la demande');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement de l'événement...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="bg-red-100 rounded-full p-4 mb-4">
          <FaCalendar className="text-red-500 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{error || 'Événement non trouvé'}</h3>
        <button
          onClick={() => router.push('/events')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Retour aux événements
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-96">
          <Image
            src={event.images[0] || '/default-event.jpg'}
            alt={event.title}
            width={1200}
            height={600}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            {event.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <FaCalendar className="text-blue-500" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <FaClock className="text-blue-500 ml-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaGem className="text-blue-500" />
                <span>Service Premium de Mariage</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
          </motion.div>

          {/* Section des services inclus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-semibold mb-4">Services Inclus</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <FaHeart className="text-blue-500 text-2xl mb-2" />
                <h4 className="font-semibold mb-2">Organisation Complète</h4>
                <p className="text-gray-600">Planification détaillée de A à Z de votre mariage</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <FaCheck className="text-blue-500 text-2xl mb-2" />
                <h4 className="font-semibold mb-2">Services Premium</h4>
                <p className="text-gray-600">Décoration, traiteur, musique, et plus encore</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <FaUsers className="text-blue-500 text-2xl mb-2" />
                <h4 className="font-semibold mb-2">Coordination</h4>
                <p className="text-gray-600">Gestion des prestataires et du planning</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <button
              onClick={() => router.push(`/events/request/${event.id}`)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Faire une demande
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 