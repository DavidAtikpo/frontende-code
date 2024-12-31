"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/utils/config';
import { getCookie } from 'cookies-next' ;
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaPlus, FaCopy, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

interface EventTemplate {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  capacity: number;
  price: number;
  image?: string;
  includedServices: string[];
  additionalServices: Array<{
    name: string;
    price: number;
  }>;
  requirements: string;
  cancellationPolicy: string;
  createdAt: string;
  lastUsed?: string;
  timesUsed: number;
}

const EventTemplates = () => {
  const [templates, setTemplates] = useState<EventTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);
  const [formData, setFormData] = useState<Partial<EventTemplate>>({
    title: '',
    description: '',
    type: '',
    duration: 2,
    capacity: 50,
    price: 0,
    includedServices: [],
    additionalServices: [],
    requirements: '',
    cancellationPolicy: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/templates`
      );
      if (response.data.success) {
        setTemplates(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des modèles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/templates`,
        formData
      );
      if (response.data.success) {
        toast.success('Modèle créé avec succès');
        setShowCreateModal(false);
        fetchTemplates();
      }
    } catch (error) {
      toast.error('Erreur lors de la création du modèle');
      console.error(error);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/templates/${templateId}`
        );
        toast.success('Modèle supprimé');
        fetchTemplates();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error(error);
      }
    }
  };

  const handleUseTemplate = async (template: EventTemplate) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/events`,
        { templateId: template.id }
      );
      if (response.data.success) {
        toast.success('Événement créé à partir du modèle');
        router.push(`/seller/events/${response.data.data.id}/edit`);
      }
    } catch (error) {
      toast.error('Erreur lors de la création de l\'événement');
      console.error(error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Modèles d'événements</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Nouveau modèle
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-white rounded-lg shadow">
            {template.image && (
              <div className="relative h-48">
                <Image
                  src={template.image}
                  alt={template.title}
                  width={500}
                  height={500}
                  className="object-cover rounded-t-lg"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {template.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{template.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Durée</span>
                  <span className="font-medium">{template.duration}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacité</span>
                  <span className="font-medium">{template.capacity} personnes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prix de base</span>
                  <span className="font-medium">{template.price.toLocaleString()} CFA</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Utilisé {template.timesUsed} fois
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Utiliser ce modèle"
                  >
                    <FaCopy />
                  </button>
                  <Link
                    href={`/seller/events/templates/${template.id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                    title="Voir les détails"
                  >
                    <FaEye />
                  </Link>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Aucun modèle créé pour le moment</p>
        </div>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Créer un nouveau modèle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Formulaire de création... */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Créer le modèle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTemplates; 