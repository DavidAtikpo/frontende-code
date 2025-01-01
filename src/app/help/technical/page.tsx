"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaChevronRight, 
  FaHeadset,
  FaTicketAlt,
  FaComments,
  FaPaperPlane,
  FaFile,
  FaExclamationCircle,
  FaClock
} from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const TechnicalSupportPage = () => {
  const [activeTab, setActiveTab] = useState<'ticket' | 'chat'>('ticket');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: '',
    attachments: null as FileList | null
  });
  const [chatMessage, setChatMessage] = useState('');
  const [isChatConnected, setIsChatConnected] = useState(false);

  const categories = [
    { id: 'technical', name: 'Problème technique' },
    { id: 'account', name: 'Problème de compte' },
    { id: 'payment', name: 'Problème de paiement' },
    { id: 'other', name: 'Autre' }
  ];

  const priorities = [
    { id: 'low', name: 'Basse', color: 'bg-green-100 text-green-800' },
    { id: 'medium', name: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: 'Haute', color: 'bg-red-100 text-red-800' }
  ];

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simuler l'envoi du ticket
      toast.success('Votre ticket a été créé avec succès');
      setTicketForm({
        subject: '',
        category: '',
        priority: '',
        description: '',
        attachments: null
      });
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const handleChatConnect = () => {
    setIsChatConnected(true);
    toast.success('Connecté au chat du support');
  };

  const handleChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      // Simuler l'envoi du message
      toast.success('Message envoyé');
      setChatMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-white px-4 py-3 shadow-sm mx-4 sm:mx-6 lg:mx-8 mt-4"
      >
        <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
          <FaHome className="mr-1" />
          Accueil
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <Link href="/help" className="hover:text-blue-600 transition-colors">
          Aide
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">Support Technique</span>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Support Technique
        </motion.h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('ticket')}
            className={`flex items-center px-6 py-3 rounded-lg ${
              activeTab === 'ticket'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaTicketAlt className="mr-2" />
            Créer un ticket
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center px-6 py-3 rounded-lg ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaComments className="mr-2" />
            Chat en direct
          </button>
        </div>

        {/* Ticket Form */}
        {activeTab === 'ticket' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <form onSubmit={handleTicketSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sujet</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Priorité</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionnez une priorité</option>
                    {priorities.map(priority => (
                      <option key={priority.id} value={priority.id}>
                        {priority.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pièces jointes</label>
                <input
                  type="file"
                  onChange={(e) => setTicketForm({...ticketForm, attachments: e.target.files})}
                  className="mt-1 block w-full"
                  multiple
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaTicketAlt className="mr-2" />
                Soumettre le ticket
              </button>
            </form>
          </motion.div>
        )}

        {/* Chat */}
        {activeTab === 'chat' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {!isChatConnected ? (
              <div className="p-6 text-center">
                <FaHeadset className="text-6xl text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-4">Chat avec le support</h2>
                <p className="text-gray-600 mb-6">
                  Nos agents sont disponibles pour vous aider en temps réel.
                </p>
                <button
                  onClick={handleChatConnect}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Démarrer le chat
                </button>
              </div>
            ) : (
              <div className="h-[600px] flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto">
                  {/* Messages du chat */}
                </div>
                <form onSubmit={handleChatMessage} className="p-4 border-t bg-gray-50">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}

        {/* Informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaClock className="text-2xl text-blue-600 mb-4" />
            <h3 className="font-semibold mb-2">Heures d'ouverture</h3>
            <p className="text-gray-600">Lun-Ven: 8h-18h</p>
            <p className="text-gray-600">Sam: 9h-15h</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaExclamationCircle className="text-2xl text-blue-600 mb-4" />
            <h3 className="font-semibold mb-2">Temps de réponse</h3>
            <p className="text-gray-600">Tickets: 24-48h</p>
            <p className="text-gray-600">Chat: Immédiat</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaFile className="text-2xl text-blue-600 mb-4" />
            <h3 className="font-semibold mb-2">Documentation</h3>
            <Link href="/docs/guide" className="text-blue-600 hover:underline">
              Consulter le guide
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TechnicalSupportPage; 