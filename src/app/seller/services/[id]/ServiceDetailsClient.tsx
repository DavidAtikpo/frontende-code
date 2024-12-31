"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import { 
  FaClock, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaEdit, 
  FaStar,
  FaUsers,
} from 'react-icons/fa';
import Image from 'next/image';

const { BASE_URL } = API_CONFIG;

interface ServiceDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  location: string;
  requirements: string;
  status: 'draft' | 'published' | 'archived';
  images: string[];
  bookings: {
    id: string;
    date: string;
    status: string;
    customer: {
      name: string;
      email: string;
    };
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    customer: {
      name: string;
    };
  }[];
  stats: {
    totalBookings: number;
    completedBookings: number;
    averageRating: number;
    totalRevenue: number;
  };
}

interface ServiceDetailsClientProps {
  params: { id: string };
}

const ServiceDetailsClient = ({ params }: ServiceDetailsClientProps) => {
  const router = useRouter();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'reviews' | 'stats'>('overview');

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails');
      }

      const data = await response.json();
      setService(data.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des détails');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services/${params.id}/status`, {
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
      fetchServiceDetails();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading || !service) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{service.title}</h1>
          <Badge className="mt-2">{service.category}</Badge>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/seller/services/edit/${params.id}`)}
          >
            <FaEdit className="mr-2" />
            Modifier
          </Button>
          <Button
            variant={service.status === 'published' ? 'destructive' : 'default'}
            onClick={() => handleStatusChange(service.status === 'published' ? 'draft' : 'published')}
          >
            {service.status === 'published' ? 'Dépublier' : 'Publier'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... reste du JSX */}
      </div>
    </div>
  );
};

export default ServiceDetailsClient; 