"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Training {
  id: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  instructor: string;
  status: string;
  paymentStatus: string;
  image: string;
}

export default function MyTrainingsPage() {
  const router = useRouter();
  const [activeTrainings, setActiveTrainings] = useState<Training[]>([]);
  const [pastTrainings, setPastTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTrainings();
  }, []);

  const fetchMyTrainings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Veuillez vous connecter pour voir vos formations');
      router.push('/login');
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/training/user/my-trainings`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const now = new Date();
      const active = [];
      const past = [];

      for (const training of response.data.data) {
        const startDate = new Date(training.startDate);
        if (startDate >= now) {
          active.push(training);
        } else {
          past.push(training);
        }
      }

      setActiveTrainings(active);
      setPastTrainings(past);
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error);
      toast.error('Erreur lors de la récupération de vos formations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const TrainingCard = ({ training }: { training: Training }) => (
    <Card className="p-6 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <img
            src={training.image || '/default-training.jpg'}
            alt={training.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{training.title}</h3>
          <p className="text-gray-600 mb-4">{training.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Date de début</p>
              <p className="font-medium">
                {format(new Date(training.startDate), 'PPP', { locale: fr })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Durée</p>
              <p className="font-medium">{training.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Formateur</p>
              <p className="font-medium">{training.instructor}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusBadgeColor(training.status)}>
              Statut: {training.status}
            </Badge>
            <Badge className={getPaymentStatusBadgeColor(training.paymentStatus)}>
              Paiement: {training.paymentStatus}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Formations</h1>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="active">
              Formations en cours ({activeTrainings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Formations passées ({pastTrainings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeTrainings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Vous n'avez pas de formations en cours</p>
              </div>
            ) : (
              activeTrainings.map((training) => (
                <TrainingCard key={training.id} training={training} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastTrainings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Vous n'avez pas de formations passées</p>
              </div>
            ) : (
              pastTrainings.map((training) => (
                <TrainingCard key={training.id} training={training} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 