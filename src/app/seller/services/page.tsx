"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { getCookie } from "cookies-next";
import { FaPlus, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

interface Service {
  id: string;
  providerId: string;
  category: string;
  subCategory: string;
  title: string;
  description: string;
  images: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

const getImageUrl = (path: string) => {
  if (!path) return '/default-service.jpg';
  return path.startsWith('http') ? path : `${BASE_URL}/${path}`;
};

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
          {row.original.images && row.original.images.length > 0 && (
            <div className="relative w-12 h-12">
              <Image
                src={getImageUrl(row.original.images[0])}
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
          <div className="text-sm">
            Catégorie: {row.original.category}
          </div>
          <div className="text-sm">
            Sous-catégorie: {row.original.subCategory}
          </div>
          <div className="text-sm text-gray-500">
            {row.original.description}
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
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800"
        };
        return (
          <Badge className={colors[status]}>
            {status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date de création",
      cell: ({ row }: { row: { original: Service } }) => (
        <div className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString('fr-FR')}
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
      if (!token) {
        toast.error('Veuillez vous connecter');
        router.push('/login');
        return;
      }

      console.log('Fetching services with token:', token.substring(0, 10) + '...');
      const response = await fetch(`${BASE_URL}/api/services/get-all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Services data received:', data);

      if (data.success) {
        if (Array.isArray(data.data)) {
          console.log(`Setting ${data.data.length} services`);
          setServices(data.data);
          if (data.data.length === 0) {
            toast.success('Créez votre premier service !');
          }
        } else {
          console.error('Data.data is not an array:', data.data);
          toast.error('Format de données incorrect');
        }
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des services');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
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
      const response = await fetch(`${BASE_URL}/api/services/${serviceId}`, {
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
    return (
      <div className="container mx-auto p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
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