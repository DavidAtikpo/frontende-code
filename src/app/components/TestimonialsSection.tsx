"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaUsers, FaStore, FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import axios from 'axios';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  createdAt: string;
}

interface Stats {
  users: number;
  partners: number;
  orders: number;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stats>({ users: 0, partners: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsRes, statsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/featured`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/overview`)
        ]);

        setTestimonials(testimonialsRes.data.data);
        setStats(statsRes.data.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const statsDisplay = [
    {
      icon: <FaUsers className="text-blue-500 text-3xl" />,
      value: `${Math.floor(stats.users / 1000)}K+`,
      label: "Utilisateurs Actifs"
    },
    {
      icon: <FaStore className="text-green-500 text-3xl" />,
      value: `${stats.partners}+`,
      label: "Partenaires"
    },
    {
      icon: <FaShoppingCart className="text-purple-500 text-3xl" />,
      value: `${Math.floor(stats.orders / 1000)}K+`,
      label: "Commandes Livrées"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {statsDisplay.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {testimonials.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ce que disent nos clients
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Découvrez les expériences de nos utilisateurs satisfaits
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg relative"
                >
                  <div className="absolute -top-4 left-6">
                    <FaQuoteLeft className="text-4xl text-blue-500 bg-white rounded-full p-2" />
                  </div>
                  <div className="flex items-center mb-4 mt-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.image || '/images/default-avatar.png'}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600">{testimonial.content}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection; 