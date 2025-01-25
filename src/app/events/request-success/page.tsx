'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

export default function RequestSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <button
          onClick={() => router.push('/events')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Retour aux événements
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Demande envoyée avec succès !
          </h1>

          <p className="text-gray-600 mb-8">
            Votre demande d'organisation a été reçue par notre équipe.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 text-left mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Prochaines étapes
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">1.</span>
                Notre équipe examinera votre demande dans les 24-48 heures.
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">2.</span>
                Vous recevrez un email de confirmation avec les détails de votre demande.
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">3.</span>
                Un membre de notre équipe vous contactera pour organiser un premier rendez-vous gratuit.
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">4.</span>
                Lors de ce rendez-vous, nous discuterons en détail de vos souhaits et établirons un devis personnalisé.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push('/dashboard/requests')}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voir mes demandes
            </button>
            <button
              onClick={() => router.push('/events')}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Retour aux événements
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 