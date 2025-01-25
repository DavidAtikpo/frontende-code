'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function RequestSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
          >
            <FaCheckCircle className="h-8 w-8 text-green-600" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-3xl font-extrabold text-gray-900"
          >
            Demande envoyée !
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-gray-600"
          >
            Nous avons bien reçu votre demande d'organisation de mariage.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-4 text-gray-600"
        >
          <p>Notre équipe va étudier votre demande et vous contactera dans les plus brefs délais (24-48h) pour :</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Planifier un premier rendez-vous gratuit</li>
            <li>Discuter de vos souhaits en détail</li>
            <li>Établir une proposition personnalisée</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Link
            href="/events"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Retour aux événements
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
} 