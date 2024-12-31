"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaMoneyBillWave,
  FaCheck,
  FaTimes,
  FaPhoneAlt,
  FaEnvelope
} from 'react-icons/fa';

const { BASE_URL } = API_CONFIG;

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  startTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes: string;
  createdAt: string;
}

interface Row {
  original: Booking;
}

export default function ServiceBookings() {
//   const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      accessorKey: "service",
      header: "Service & Client",
      cell: ({ row }: { row: Row }) => (
        <div className="space-y-2">
          <p className="font-medium">{row.original.serviceName}</p>
          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <FaUser className="mr-2 text-gray-500" />
              {row.original.customer.name}
            </div>
            <div className="flex items-center text-sm">
              <FaEnvelope className="mr-2 text-gray-500" />
              {row.original.customer.email}
            </div>
            <div className="flex items-center text-sm">
              <FaPhoneAlt className="mr-2 text-gray-500" />
              {row.original.customer.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "datetime",
      header: "Date & Heure",
      cell: ({ row }: { row: Row }) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            {new Date(row.original.date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <FaClock className="mr-2 text-gray-500" />
            {row.original.startTime}
          </div>
          <div className="text-sm text-gray-500">
            Durée: {row.original.duration} min
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: { row: Row }) => {
        const status = row.original.status;
        const colors = {
          pending: "bg-yellow-100 text-yellow-800",
          confirmed: "bg-green-100 text-green-800",
          completed: "bg-blue-100 text-blue-800",
          cancelled: "bg-red-100 text-red-800"
        };
        return (
          <div className="space-y-2">
            <Badge className={colors[status]}>
              {status}
            </Badge>
            <div className="flex items-center text-sm">
              <FaMoneyBillWave className="mr-2 text-gray-500" />
              {row.original.paymentStatus}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row }) => {
        const booking = row.original;
        const isPending = booking.status === 'pending';
        const isConfirmed = booking.status === 'confirmed';

        return (
          <div className="flex items-center space-x-2">
            {isPending && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleStatusChange(booking.id, 'confirmed')}
              >
                <FaCheck className="mr-2" />
                Confirmer
              </Button>
            )}
            {isConfirmed && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleStatusChange(booking.id, 'completed')}
              >
                <FaCheck className="mr-2" />
                Terminer
              </Button>
            )}
            {(isPending || isConfirmed) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleStatusChange(booking.id, 'cancelled')}
              >
                <FaTimes className="mr-2" />
                Annuler
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des réservations');
      }

      const data = await response.json();
      setBookings(data.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      toast.success('Statut mis à jour avec succès');
      fetchBookings();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Réservations de services</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={bookings}
            searchKey="customer.name"
          />
        </CardContent>
      </Card>
    </div>
  );
} 