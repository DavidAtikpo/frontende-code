'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  imageUrl: string;
  price: number;
  status: string;
}

export default function EventDetailsPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/events/${params.eventId}`);
        if (!response.ok) {
          throw new Error('Événement non trouvé');
        }
        const data = await response.json();
        setEvent(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'événement');
      } finally {
        setLoading(false);
      }
    };

    if (params.eventId) {
      fetchEvent();
    }
  }, [params.eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retour aux événements
        </button>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={1200}
            height={400}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center text-gray-600">
              <FaCalendar className="mr-2" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaClock className="mr-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaUsers className="mr-2" />
              <span>{event.currentParticipants} / {event.maxParticipants} participants</span>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700">{event.description}</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-blue-600 mb-4 md:mb-0">
              {event.price} €
            </div>
            <button
              className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors ${
                event.currentParticipants >= event.maxParticipants
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={event.currentParticipants >= event.maxParticipants}
            >
              {event.currentParticipants >= event.maxParticipants
                ? 'Complet'
                : 'Réserver ma place'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 