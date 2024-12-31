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
import { FaPlus, FaEdit, FaEye, FaTrash, FaClock, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import Image from 'next/image';

const { BASE_URL } = API_CONFIG;

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  location: string;
  status: 'draft' | 'published' | 'archived';
  bookingsCount: number;
  rating: number;
  mainImage: string;
  createdAt: string;
}

export default function SellerServices() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      accessorKey: "service",
      header: "Service",
      cell: ({ row }: { row: { original: Service } }) => (
        <div className="flex items-center space-x-3">
          {row.original.mainImage && (
            <div className="relative w-12 h-12">
              <Image
                src={row.original.mainImage}
                alt={row.original.title}
                width={500}
                height={500}
                className="object-cover rounded"
              />
            </div>
          )}
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-sm text-gray-500">{row.original.category}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "details",
      header: "Détails",
      cell: ({ row }: { row: { original: Service } }) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <FaMoneyBillWave className="mr-2 text-gray-500" />
            {row.original.price.toLocaleString()} FCFA
          </div>
          <div className="flex items-center text-sm">
            <FaClock className="mr-2 text-gray-500" />
            {row.original.duration} min
          </div>
          <div className="flex items-center text-sm">
            <FaMapMarkerAlt className="mr-2 text-gray-500" />
            {row.original.location}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: { row: { original: Service } }) => {
        const status = row.original.status;
        const colors = {
          draft: "bg-yellow-100 text-yellow-800",
          published: "bg-green-100 text-green-800",
          archived: "bg-gray-100 text-gray-800"
        };
        return (
          <Badge className={colors[status]}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "stats",
      header: "Statistiques",
      cell: ({ row }: { row: { original: Service } }) => (
        <div className="space-y-1">
          <div className="text-sm">
            {row.original.bookingsCount} réservations
          </div>
          <div className="text-sm">
            {row.original.rating.toFixed(1)} / 5 ⭐
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: Service } }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/seller/services/${row.original.id}`)}
          >
            <FaEye className="mr-2" />
            Voir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/seller/services/edit/${row.original.id}`)}
          >
            <FaEdit className="mr-2" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <FaTrash className="mr-2" />
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des services');
      }

      const data = await response.json();
      setServices(data.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast.success('Service supprimé avec succès');
      fetchServices();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression du service');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Services</h1>
        <Button
          onClick={() => router.push('/seller/services/create')}
        >
          <FaPlus className="mr-2" />
          Nouveau service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des services</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={services}
            searchKey="title"
          />
        </CardContent>
      </Card>
    </div>
  );
} 