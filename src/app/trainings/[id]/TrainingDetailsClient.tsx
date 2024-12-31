"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { FaCalendar, FaUsers, FaMapMarkerAlt, FaClock, FaGraduationCap } from 'react-icons/fa';

interface TrainingDetails {
  id: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  location: string;
  maxParticipants: number;
  enrolledCount: number;
  price: number;
  image: string;
}

interface TrainingDetailsClientProps {
  params: { id: string };
}

const TrainingDetailsClient = ({ params }: TrainingDetailsClientProps) => {
  const router = useRouter();
  const [training, setTraining] = useState<TrainingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const response = await axios.get(`/api/trainings/${params.id}`);
        setTraining(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Erreur lors du chargement de la formation');
        setLoading(false);
      }
    };
    fetchTraining();
  }, [params.id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!training) {
    return <div>Formation non trouvée</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{training.title}</h1>
      {/* Reste du JSX */}
    </div>
  );
};

export default TrainingDetailsClient; 