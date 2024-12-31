"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from 'lucide-react';

const { BASE_URL } = API_CONFIG;

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
  status: 'draft' | 'published' | 'cancelled';
  seller: {
    id: string;
    name: string;
    email: string;
  };
  bookings: number;
  createdAt: string;
}

type Row = {
  original: Event;
};

export default function AdminEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      accessorKey: "title",
      header: "Titre",
      cell: ({ row }: { row: Row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-sm text-gray-500">{row.original.type}</p>
        </div>
      ),
    },
    {
      accessorKey: "seller",
      header: "Organisateur",
      cell: ({ row }: { row: Row }) => (
        <div>
          <p>{row.original.seller.name}</p>
          <p className="text-sm text-gray-500">{row.original.seller.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: { row: Row }) => (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date(row.original.date).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Lieu",
      cell: ({ row }: { row: Row }) => (
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4" />
          {row.original.location}
        </div>
      ),
    },
    {
      accessorKey: "capacity",
      header: "Capacité",
      cell: ({ row }: { row: Row }) => (
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          {row.original.bookings}/{row.original.capacity}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Prix",
      cell: ({ row }: { row: Row }) => (
        <div className="font-medium">
          {row.original.price.toLocaleString()} FCFA
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: { row: Row }) => {
        const status = row.original.status;
        const colors = {
          draft: "bg-gray-100 text-gray-800",
          published: "bg-green-100 text-green-800",
          cancelled: "bg-red-100 text-red-800",
        };
        return (
          <Badge className={colors[status]}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/events/${row.original.id}`)}
          >
            Détails
          </Button>
          {row.original.status === 'draft' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleApprove(row.original.id)}
            >
              Approuver
            </Button>
          )}
        </div>
      ),
    },
  ];

  const fetchEvents = useCallback(async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/events`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/adminLogin');
          return;
        }
        throw new Error("Erreur lors du chargement des événements");
      }

      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleApprove = async (eventId: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/events/${eventId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    const token = getCookie('token');
    const userRole = getCookie('role');

    if (!token || userRole !== 'admin') {
      router.replace('/adminLogin');
      return;
    }

    fetchEvents();
  }, [fetchEvents, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des événements</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des événements</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={events}
            searchKey="title"
          />
        </CardContent>
      </Card>
    </div>
  );
}
