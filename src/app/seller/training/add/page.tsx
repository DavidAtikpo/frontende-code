"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa';
import Image from 'next/image';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

interface TrainingForm {
  title: string;
  description: string;
  price: number;
  duration: string;
  startDate: string;
  maxParticipants: number;
  location: string;
  category: string;
  level: 'debutant' | 'intermediaire' | 'avance';
  prerequisites: string;
  objectives: string;
  image: FileList;
  syllabus: FileList;
}

const AddTraining = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<TrainingForm>();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [syllabusName, setSyllabusName] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  React.useEffect(() => {
    if (watchSyllabus && watchSyllabus.length > 0) {
      setSyllabusName(watchSyllabus[0].name);
    }
  }, [watchSyllabus]);

  const onSubmit = async (data: TrainingForm) => {
    console.log("Début de la soumission du formulaire", data);
    try {
      setLoading(true);

      // Récupérer le token depuis le localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Veuillez vous connecter');
        router.push('/login');
        return;
      }

      const formData = new FormData();

      // Vérifier si l'image est présente
      if (!selectedImage) {
        toast.error("Une image est requise");
        setLoading(false);
        return;
      }

      // Vérifier si le syllabus est présent
      if (!data.syllabus || data.syllabus.length === 0) {
        toast.error("Le syllabus est requis");
        setLoading(false);
        return;
      }

      // Ajouter les fichiers
      formData.append('image', selectedImage);
      formData.append('syllabus', data.syllabus[0]);

      // Log des fichiers
      console.log('Image à envoyer:', selectedImage);
      console.log('Syllabus à envoyer:', data.syllabus[0]);

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

      // Log des données avant l'ajout au FormData
      console.log("Données à envoyer:", fieldsToAdd);

      Object.entries(fieldsToAdd).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
          console.log(`Ajout au FormData - ${key}:`, value.toString());
        }
      });

      console.log("Token utilisé:", token);
      console.log("Envoi de la requête au serveur...");

      const response = await axios.post(
        `${BASE_URL}/api/training/create`,
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
        toast.success('Formation ajoutée avec succès');
        router.push('/seller/training');
      } else {
        toast.error(response.data.message || 'Erreur lors de l\'ajout de la formation');
      }
    } catch (error: any) {
      console.error('Erreur complète:', error);
      if (error.response) {
        console.error('Données de réponse:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
        
        // Afficher le message d'erreur spécifique du serveur
        const errorMessage = error.response.data.message || error.response.data.error;
        toast.error(errorMessage || 'Erreur lors de l\'ajout de la formation');
      } else if (error.request) {
        console.error('Pas de réponse reçue:', error.request);
        toast.error('Erreur de connexion au serveur');
      } else {
        console.error('Erreur de configuration:', error.message);
        toast.error('Erreur de configuration de la requête');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle formation</h1>

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6"
        encType="multipart/form-data"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Titre de la formation*</label>
            <input
              {...register('title', { 
                required: 'Le titre est requis',
                minLength: { value: 3, message: 'Le titre doit faire au moins 3 caractères' }
              })}
              className="w-full p-2 border rounded"
              placeholder="Titre de la formation"
            />
            {errors.title && <span className="text-red-500">{errors.title.message}</span>}
          </div>

          <div>
            <label className="block mb-2">Catégorie*</label>
            <select
              {...register('category', { required: 'La catégorie est requise' })}
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="business">Business</option>
              <option value="technology">Technologie</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="personal">Développement personnel</option>
            </select>
            {errors.category && <span className="text-red-500">{errors.category.message}</span>}
          </div>

          <div>
            <label className="block mb-2">Prix (CFA)*</label>
            <input
              type="number"
              {...register('price', { 
                required: 'Le prix est requis',
                min: { value: 0, message: 'Le prix ne peut pas être négatif' }
              })}
              className="w-full p-2 border rounded"
              placeholder="Prix en CFA"
            />
            {errors.price && <span className="text-red-500">{errors.price.message}</span>}
          </div>

          <div>
            <label className="block mb-2">Niveau*</label>
            <select
              {...register('level', { required: 'Le niveau est requis' })}
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner un niveau</option>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
            </select>
            {errors.level && <span className="text-red-500">{errors.level.message}</span>}
          </div>

          <div>
            <label className="block mb-2">Lieu*</label>
            <input
              {...register('location', { required: 'Le lieu est requis' })}
              className="w-full p-2 border rounded"
              placeholder="Lieu de la formation"
            />
            {errors.location && <span className="text-red-500">{errors.location.message}</span>}
          </div>

          <div>
            <label className="block mb-2">Durée</label>
            <input
              {...register('duration', { required: true })}
              placeholder="Ex: 3 jours, 2 semaines..."
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Date de début</label>
            <input
              type="date"
              {...register('startDate', { required: true })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Nombre maximum de participants</label>
            <input
              type="number"
              {...register('maxParticipants', { required: true, min: 1 })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            {...register('description', { required: true })}
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Prérequis</label>
          <textarea
            {...register('prerequisites')}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Objectifs de la formation</label>
          <textarea
            {...register('objectives', { required: true })}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Image de couverture</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                {...register('image', { 
                  required: 'Une image est requise'
                })}
                accept="image/*"
                className="hidden"
                id="image"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setSelectedImage(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      if (e.target?.result) {
                        setImagePreview(e.target.result as string);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label htmlFor="image" className="cursor-pointer">
                {imagePreview ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={imagePreview}
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
            {errors.image && <span className="text-red-500">Une image est requise</span>}
          </div>

          <div>
            <label className="block mb-2">Programme détaillé (PDF)</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                {...register('syllabus', { 
                  required: 'Le syllabus est requis'
                })}
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
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => console.log("Bouton cliqué", errors)}
        >
          {loading ? 'Création en cours...' : 'Créer la formation'}
        </button>

        {/* Afficher les erreurs de validation */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 font-medium">Erreurs de validation :</p>
            <ul className="list-disc list-inside mt-2">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field} className="text-red-500">
                  {field}: {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTraining; 