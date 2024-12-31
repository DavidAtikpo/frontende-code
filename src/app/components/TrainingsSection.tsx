"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendar, FaGraduationCap, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Training {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  startDate: string;
  duration: string;
  price: number;
  participantsCount: number;
  maxParticipants: number;
}

export default function TrainingsSection() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/trainings/featured`);
        setTrainings(response.data.data);
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </motion.div>
    );
  }

  if (trainings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FaGraduationCap className="text-green-500 text-3xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h3>
        <p className="text-gray-600">
          Nos formations seront bientôt disponibles !
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainings.map((training, index) => (
        <motion.div
          key={training.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="relative h-48">
            <Image
              src={training.image}
              alt={training.title}
              width={500}
              height={500}
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{training.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{training.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <FaGraduationCap className="text-gray-400" />
                <span className="text-sm">{training.instructor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-gray-400" />
                <span className="text-sm">Début: {new Date(training.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="text-gray-400" />
                <span className="text-sm">{training.participantsCount}/{training.maxParticipants} participants</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-blue-600">{training.price} CFA</span>
              <span className="text-sm text-gray-500">{training.duration}</span>
            </div>
            <Link 
              href={`/trainings/${training.id}`}
              className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              S'inscrire
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 