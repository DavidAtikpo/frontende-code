"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendar, FaGraduationCap, FaUsers, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_CONFIG } from '@/utils/config';
import { useRouter } from 'next/navigation';
const { BASE_URL } = API_CONFIG;

const DEFAULT_IMAGE = '/default-training.jpg';



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
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/training/get-all`);
        setTrainings(response.data.data);
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const handleTrainingClick = (trainingId: string) => {
    try {
      router.push(`/trainings/${trainingId}`);
    } catch (error) {
      console.error('Erreur de navigation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement des formations...</p>
      </div>
    );
  }

  if (trainings.length === 0) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4"
        >
          <FaGraduationCap className="text-blue-500 text-3xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h3>
        <p className="text-gray-600">Nos formations seront bientôt disponibles !</p>
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-0 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 mb-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Nos Formations
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Développez vos compétences avec nos formations professionnelles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training, index) => (
            <motion.div
              key={training.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={training.image ||'/default-training.jpg' }
                  alt={training.title}
                  // width={500}
                  // height={300}
                  className="object-cover w-full h-full"
                  // priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white truncate">{training.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4 line-clamp-2 h-12">{training.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaGraduationCap className="text-blue-500" />
                    <span className="text-sm truncate">{training.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaCalendar className="text-blue-500" />
                    <span className="text-sm">Début: {new Date(training.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaClock className="text-blue-500" />
                    <span className="text-sm">{training.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaUsers className="text-blue-500" />
                    <span className="text-sm">{training.participantsCount}/{training.maxParticipants} participants</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-2xl text-blue-600">{training.price.toLocaleString()} CFA</span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleTrainingClick(training.id);
                    }}
                    className="w-full text-center bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    S'inscrire à la formation
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
} 