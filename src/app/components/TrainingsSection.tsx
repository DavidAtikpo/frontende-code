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
          className="relative bg-gradient-to-r from-blue-600 to-blue-800  shadow-lg p-2 mb-2 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{ 
                rotate: [0, 20, -20, 0],
                scale: [1, 1.2, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
              className="text-white"
            >
              <FaGraduationCap size={40} />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Nos Formations
            </h2>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Développez vos compétences avec nos formations professionnelles
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-3 md:space-x-4">
              {trainings.map((training, index) => (
                <motion.div
                  key={training.id}
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 w-[calc(50%-8px)] md:w-[calc(16.666%-12px)] flex-shrink-0"
                >
                  <div className="relative h-32">
                    <img
                      src={training.image || '/default-training.jpg'}
                      alt={training.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-sm font-bold text-white truncate">{training.title}</h3>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2 h-8">{training.description}</p>
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <FaGraduationCap className="text-blue-500 text-xs" />
                        <span className="text-[10px] truncate">{training.instructor}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <FaCalendar className="text-blue-500 text-xs" />
                        <span className="text-[10px]">Début: {new Date(training.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <FaClock className="text-blue-500 text-xs" />
                        <span className="text-[10px]">{training.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <FaUsers className="text-blue-500 text-xs" />
                        <span className="text-[10px]">{training.participantsCount}/{training.maxParticipants} participants</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-blue-600">{training.price.toLocaleString()} CFA</span>
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
                        className="w-full text-center bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-xs"
                      >
                        S'inscrire à la formation
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </motion.section>
  );
}