"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaPlus, 
  FaCalendarAlt, 
  FaUsers, 
  FaClock, 
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaEye,
  FaChartBar
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  images: string[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

const EventsPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'draft'>('all');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    upcoming: 0,
    completed: 0
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/events/seller/events`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const eventData: Event[] = response.data.data;
        setEvents(eventData);
        
        // Calculer les statistiques
        const now = new Date();
        setStats({
          total: eventData.length,
          published: eventData.filter((e: Event) => e.status === 'published').length,
          upcoming: eventData.filter((e: Event) => new Date(e.date) > now).length,
          completed: eventData.filter((e: Event) => e.status === 'completed').length
        });
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des événements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    
    try {
      await axios.delete(`${BASE_URL}/api/events/${eventId}`);
      toast.success('Événement supprimé avec succès');
      fetchEvents();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error(error);
    }
  };

  const handleStatusChange = async (eventId: string, status: Event['status']) => {
    try {
      await axios.put(`${BASE_URL}/api/events/${eventId}`, { status });
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
        return eventDate >= today && event.status === 'published';
      case 'past':
        return eventDate < today || event.status === 'completed';
      case 'draft':
        return event.status === 'draft';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête avec statistiques */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord des événements</h1>
          <Link
            href="/seller/events/create"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Créer un événement
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total événements</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FaChartBar className="text-blue-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Publiés</p>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
              <FaEye className="text-green-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">À venir</p>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
              </div>
              <FaCalendarAlt className="text-yellow-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Terminés</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <FaUsers className="text-blue-500 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Passés
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'draft' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Brouillons
          </button>
        </div>
      </div>

      {/* Liste des événements */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={event.images?.[0] || '/placeholder-event.jpg'}
                alt={event.title}
                width={500}
                height={300}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  {event.status === 'draft' ? 'Brouillon' :
                   event.status === 'published' ? 'Publié' :
                   event.status === 'cancelled' ? 'Annulé' : 'Terminé'}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <span>{new Date(event.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <select
                  value={event.status}
                  onChange={(e) => handleStatusChange(event.id, e.target.value as Event['status'])}
                  className="p-2 border rounded-lg text-sm"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publier</option>
                  <option value="cancelled">Annuler</option>
                  <option value="completed">Terminer</option>
                </select>

                <div className="flex space-x-2">
                  <Link
                    href={`/seller/events/${event.id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                  <Link
                    href={`/seller/events/${event.id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <FaEye />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-600">Aucun événement trouvé</p>
          <p className="text-gray-500 mt-2">Commencez par créer votre premier événement</p>
          <Link
            href="/seller/events/create"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Créer un événement
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventsPage; 