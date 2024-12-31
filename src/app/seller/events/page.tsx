"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaCalendarAlt, FaUsers, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  price: number;
  images: string[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  bookings?: {
    id: string;
    status: string;
  }[];
}

const EventsPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/events`
      );
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des événements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId: string, status: Event['status']) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`,
        { status }
      );
      toast.success('Statut mis à jour');
      fetchEvents();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error(error);
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    
    switch (filter) {
      case 'upcoming':
        return eventDate >= today;
      case 'past':
        return eventDate < today;
      default:
        return true;
    }
  });

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mes Événements</h1>
        <Link
          href="/seller/events/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Créer un événement
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded ${
              filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded ${
              filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Passés
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {event.images?.[0] && (
              <div className="relative h-48">
                <Image
                  src={event.images[0]}
                  alt={event.title}
                  width={500}
                  height={500}
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaUsers className="mr-2" />
                  <span>{event.capacity} places</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <select
                  value={event.status}
                  onChange={(e) => handleStatusChange(event.id, e.target.value as Event['status'])}
                  className="p-2 border rounded"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="cancelled">Annulé</option>
                  <option value="completed">Terminé</option>
                </select>

                <Link
                  href={`/seller/events/${event.id}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Voir les détails →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Aucun événement trouvé</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage; 