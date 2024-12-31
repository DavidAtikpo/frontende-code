"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaCalendarAlt, FaClock, FaUsers, FaCheck, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { getCookie } from 'cookies-next';
// import { fr } from 'date-fns/locale';

interface Reservation {
  id: string;
  tableId: string;
  date: string;
  time: string;
  guestCount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialRequests?: string;
  table: {
    number: number;
    capacity: number;
    location: string;
  };
}

const ReservationsPage = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const restaurantId = getCookie('restaurantId');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      router.push('/seller/restaurant/setup');
      return;
    }
    fetchReservations();
  }, [selectedDate, restaurantId, router]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/reservations?date=${selectedDate}`
      );
      if (response.data.success) {
        setReservations(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des réservations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId: string, status: Reservation['status']) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/reservations/${reservationId}`,
        { status }
      );
      toast.success('Statut mis à jour');
      fetchReservations();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error(error);
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Réservations</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <div className="space-y-4">
        {reservations.map(reservation => (
          <div key={reservation.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FaClock className="text-blue-600 mr-2" />
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="text-blue-600 mr-2" />
                  <span>{reservation.guestCount} personnes</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-600 mr-2" />
                  <span>Table {reservation.table.number}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full ${getStatusColor(reservation.status)}`}>
                {getStatusText(reservation.status)}
              </span>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setShowDetails(showDetails === reservation.id ? null : reservation.id)}
                className="text-blue-600 hover:underline"
              >
                {showDetails === reservation.id ? 'Masquer les détails' : 'Voir les détails'}
              </button>
            </div>

            {showDetails === reservation.id && (
              <div className="mt-4 space-y-2 border-t pt-4">
                <p><strong>Client:</strong> {reservation.customerName}</p>
                <p><strong>Téléphone:</strong> {reservation.customerPhone}</p>
                <p><strong>Email:</strong> {reservation.customerEmail}</p>
                {reservation.specialRequests && (
                  <p><strong>Demandes spéciales:</strong> {reservation.specialRequests}</p>
                )}
                <p><strong>Emplacement:</strong> {reservation.table.location}</p>
              </div>
            )}

            {reservation.status === 'pending' && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <FaCheck className="mr-2" />
                  Confirmer
                </button>
                <button
                  onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <FaTimes className="mr-2" />
                  Annuler
                </button>
              </div>
            )}

            {reservation.status === 'confirmed' && (
              <div className="mt-4">
                <button
                  onClick={() => handleStatusChange(reservation.id, 'completed')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Marquer comme terminée
                </button>
              </div>
            )}
          </div>
        ))}

        {reservations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Aucune réservation pour cette date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage; 