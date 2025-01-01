"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaChevronRight, 
  FaQuestionCircle, 
  FaEnvelope, 
  FaPhone,
  FaBook,
  FaPlus,
  FaMinus,
  FaWhatsapp,
  FaSearch,
  FaVideo,
  FaFileDownload,
  FaComments,
  FaClock
} from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [faqFeedback, setFaqFeedback] = useState<Record<string, 'helpful' | 'not-helpful' | null>>({});

  const faqs = [
    {
      id: 'account',
      question: 'Comment créer un compte ?',
      answer: 'Pour créer un compte, cliquez sur "S\'iinscrire" en haut de la page. Remplissez le formulaire avec vos informations personnelles et suivez les instructions.',
      category: 'account'
    },
    {
      id: 'order',
      question: 'Comment suivre ma commande ?',
      answer: 'Connectez-vous à votre compte, allez dans la section "Mes commandes" pour voir le statut et les détails de vos commandes en cours.',
      category: 'orders'
    },
    {
      id: 'payment',
      question: 'Quels sont les moyens de paiement acceptés ?',
      answer: 'Nous acceptons les paiements par carte bancaire, fedapay (Orange Money, MTN Mobile Money) et en espèces à la livraison.',
      category: 'payment'
    },
    {
      id: 'delivery',
      question: 'Quels sont les délais de livraison ?',
      answer: 'Les délais de livraison varient selon votre localisation. En général, comptez 24-48h pour les zones urbaines et 2-5 jours pour les zones rurales.',
      category: 'orders'
    },
    {
      id: 'return',
      question: 'Comment faire un retour ou une réclamation ?',
      answer: 'Pour tout retour ou réclamation, contactez notre service client dans les 48h suivant la réception. Nous vous guiderons dans la procédure.',
      category: 'payment'
    }
  ];

  const resources = [
    {
      title: 'Guide d\'utilisation',
      description: 'Apprenez à utiliser toutes les fonctionnalités de la plateforme',
      icon: <FaBook />,
      link: '/docs/guide'
    },
    {
      title: 'Centre d\'aide',
      description: 'Trouvez des réponses à vos questions fréquentes',
      icon: <FaQuestionCircle />,
      link: '/help/faq'
    },
    {
      title: 'Support technique',
      description: 'Obtenez de l\'aide pour les problèmes techniques',
      icon: <FaPhone />,
      link: '/help/technical'
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les questions' },

  ];

  const tutorials = [
    {
      title: 'Comment passer une commande',
      duration: '3:45',
      thumbnail: '',
      url: ''
    },
    {
      title: 'Gérer votre compte',
      duration: '2:30',
      thumbnail: '',
      url: ''
    },
    // ... autres tutoriels
  ];

  const documents = [
    {
      title: 'Guide utilisateur PDF',
      size: '2.5 MB',
      url: '/docs/user-guide.pdf'
    },
    {
      title: 'Conditions de service',
      size: '1.2 MB',
      url: '/docs/terms.pdf'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simuler l'envoi du formulaire
      toast.success('Votre message a été envoyé avec succès');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'envoi');
    }
  };

  const LiveChat = () => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-700"
    >
      <FaComments className="text-2xl" />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-white px-4 py-3 rounded-lg shadow-sm mx-4 sm:mx-6 lg:mx-8 mt-4"
      >
        <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
          <FaHome className="mr-1" />
          Accueil
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">Aide & Support</span>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12 text-gray-800"
        >
          Comment pouvons-nous vous aider ?
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Tutoriels Vidéo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorials.map((tutorial, index) => (
                <Link
                  key={index}
                  href={tutorial.url}
                  className="group relative rounded-lg overflow-hidden"
                >
                  <div className="aspect-video bg-gray-100 relative">
                    <Image
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <FaVideo className="text-white text-4xl" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                      <FaClock className="mr-1" />
                      {tutorial.duration}
                    </div>
                  </div>
                  <h3 className="mt-2 font-medium">{tutorial.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Documents Utiles</h2>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <FaFileDownload className="text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Télécharger
                  </button>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Questions Fréquentes</h2>
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    {openFaq === faq.id ? (
                      <FaMinus className="text-blue-600" />
                    ) : (
                      <FaPlus className="text-blue-600" />
                    )}
                  </button>
                  {openFaq === faq.id && (
                    <>
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 text-gray-600"
                    >
                      {faq.answer}
                    </motion.p>
                      <div className="mt-4 flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Cette réponse vous a-t-elle aidé ?</span>
                        <button
                          onClick={() => setFaqFeedback({ ...faqFeedback, [faq.id]: 'helpful' })}
                          className={`px-3 py-1 rounded ${
                            faqFeedback[faq.id] === 'helpful' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                          }`}
                        >
                          Oui
                        </button>
                        <button
                          onClick={() => setFaqFeedback({ ...faqFeedback, [faq.id]: 'not-helpful' })}
                          className={`px-3 py-1 rounded ${
                            faqFeedback[faq.id] === 'not-helpful' ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                          }`}
                        >
                          Non
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Contactez-nous</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sujet</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Envoyer
              </button>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Autres moyens de nous contacter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <FaPhone className="text-blue-600 text-xl mr-3" />
                <div>
                  <h3 className="font-medium">Téléphone</h3>
                  <p className="text-gray-600">+229 00 00 00 00</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-blue-600 text-xl mr-3" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">support@dubon.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaWhatsapp className="text-blue-600 text-xl mr-3" />
                <div>
                  <h3 className="font-medium">WhatsApp</h3>
                  <p className="text-gray-600">+229 00 00 00 00</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {resources.map((resource, index) => (
            <Link
              key={index}
              href={resource.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-blue-600 text-2xl mb-3">
                {resource.icon}
              </div>
              <h3 className="font-semibold mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm">{resource.description}</p>
            </Link>
          ))}
        </motion.div>

        <LiveChat />
      </div>
    </div>
  );
};

export default HelpPage; 