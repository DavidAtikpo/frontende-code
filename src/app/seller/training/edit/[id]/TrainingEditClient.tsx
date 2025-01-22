"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';
import Image from 'next/image';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;


interface Params {
  id: string;
}

interface TrainingEditProps {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
}

interface TrainingFormData {
  title: string;
  description: string;
  price: number;
  duration: string;
  startDate: string;
  maxParticipants: number;
  location: string;
  category: string;
  level: string;
  prerequisites: string;
  objectives: string;
  image?: FileList;
  syllabus?: FileList;
}

// Constantes
const DEFAULT_IMAGE = '/default-training.jpg';

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string) => {
  console.log('getImageUrl - Input path:', imagePath);
  
  if (!imagePath) {
    console.log('getImageUrl - No path provided, returning default');
    return DEFAULT_IMAGE;
  }

  // Si l'URL est une URL Cloudinary complète
  if (imagePath.includes('cloudinary.com')) {
    console.log('getImageUrl - Cloudinary URL:', imagePath);
    return imagePath;
  }

  console.log('getImageUrl - Using default image');
  return DEFAULT_IMAGE;
};

const TrainingEditClient = ({ params, searchParams }: TrainingEditProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TrainingFormData>();
  const [previewImage, setPreviewImage] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [syllabusName, setSyllabusName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Surveiller les changements de fichiers
  const watchImage = watch('image');
  const watchSyllabus = watch('syllabus');

  // Mettre à jour les aperçus quand les fichiers changent
  React.useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  React.useEffect(() => {
    if (watchSyllabus && watchSyllabus.length > 0) {
      setSyllabusName(watchSyllabus[0].name);
    }
  }, [watchSyllabus]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && params?.id) {
      fetchTrainingDetails();
    }
  }, [mounted, params?.id]);

  const fetchTrainingDetails = async () => {
    try {
      console.log('Fetching training details for ID:', params.id);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/training/details/${params.id}`);
      console.log('Training response:', response.data);
      
      if (response.data.success) {
        const training = response.data.data;
        console.log('Training data:', training);
        
        // Set form values
        Object.keys(training).forEach((key) => {
          if (key === 'startDate') {
            // Formater la date au format YYYY-MM-DD pour l'input date
            const date = new Date(training[key]);
            const formattedDate = date.toISOString().split('T')[0];
            console.log('Setting startDate:', formattedDate);
            setValue('startDate', formattedDate);
          } else if (key !== 'image' && key !== 'syllabus') {
            setValue(key as keyof TrainingFormData, training[key]);
          }
        });
        
        // Set image preview if exists
        if (training.image) {
          console.log('Raw image path:', training.image);
          const imageUrl = getImageUrl(training.image);
          console.log('Processed image URL:', imageUrl);
          setPreviewImage(imageUrl);
        }
      } else {
        toast.error('Formation non trouvée');
        router.push('/seller/training');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      toast.error('Erreur lors de la récupération des détails de la formation');
      router.push('/seller/training');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TrainingFormData) => {
    setSubmitting(true);
    console.log("Début de la soumission du formulaire", data);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Veuillez vous connecter');
        router.push('/login');
        return;
      }

      const formData = new FormData();

      // Ajouter l'image seulement si une nouvelle image est sélectionnée
      if (selectedImage) {
        formData.append('image', selectedImage);
        console.log('Image à envoyer:', selectedImage);
      }

      // Ajouter le syllabus seulement si un nouveau fichier est sélectionné
      if (data.syllabus?.[0]) {
        formData.append('syllabus', data.syllabus[0]);
        console.log('Syllabus à envoyer:', data.syllabus[0]);
      }

      // Ajouter les autres champs
      const fieldsToAdd = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        duration: data.duration,
        startDate: data.startDate,
        maxParticipants: Number(data.maxParticipants),
        location: data.location,
        category: data.category,
        level: data.level,
        prerequisites: data.prerequisites,
        objectives: data.objectives
      };

      console.log("Données à envoyer:", fieldsToAdd);

      Object.entries(fieldsToAdd).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
          console.log(`Ajout au FormData - ${key}:`, value.toString());
        }
      });

      console.log("Token utilisé:", token);
      console.log("Envoi de la requête au serveur...");

      const response = await axios.put(
        `${BASE_URL}/api/training/update/${params.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("Réponse du serveur:", response.data);

      if (response.data.success) {
        toast.success('Formation mise à jour avec succès');
        router.push('/seller/training');
      }
    } catch (error: any) {
      console.error('Erreur complète:', error);
      if (error.response) {
        console.error('Données de réponse:', error.response.data);
        toast.error(error.response.data.message || 'Erreur lors de la mise à jour');
      } else {
        toast.error('Erreur lors de la mise à jour de la formation');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          Retour
        </button>
        <h1 className="text-2xl font-bold">Modifier la formation</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Titre</label>
                <input
                  type="text"
                  {...register('title')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Prix</label>
                <input
                  type="number"
                  {...register('price')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Durée</label>
                <input
                  type="text"
                  {...register('duration')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date de début</label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre maximum de participants</label>
                <input
                  type="number"
                  {...register('maxParticipants')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lieu</label>
                <input
                  type="text"
                  {...register('location')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                <select
                  {...register('category')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="developpement">Développement</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Niveau</label>
                <select
                  {...register('level')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avance">Avancé</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prérequis</label>
              <textarea
                {...register('prerequisites')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Objectifs</label>
              <textarea
                {...register('objectives')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  {...register('image')}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  id="image"
                />
                <label htmlFor="image" className="cursor-pointer">
                  {previewImage ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={previewImage}
                        alt="Aperçu"
                        width={200}
                        height={200}
                        className="rounded object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600">
                        Cliquez pour sélectionner une image
                      </span>
                    </>
                  )}
                </label>
              </div>
              {errors.image && <span className="text-red-500">{errors.image.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Programme détaillé (PDF)</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  {...register('syllabus')}
                  accept=".pdf"
                  className="hidden"
                  id="syllabus"
                />
                <label htmlFor="syllabus" className="cursor-pointer">
                  {syllabusName ? (
                    <div className="p-4">
                      <p className="text-sm text-gray-600 break-all">{syllabusName}</p>
                    </div>
                  ) : (
                    <>
                      <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600">
                        Cliquez pour sélectionner un fichier PDF
                      </span>
                    </>
                  )}
                </label>
              </div>
              {errors.syllabus && <span className="text-red-500">{errors.syllabus.message}</span>}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => console.log("Bouton cliqué", errors)}
            >
              <FaSave className="mr-2" />
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrainingEditClient; 