"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa';

interface TrainingForm {
  title: string;
  description: string;
  price: number;
  duration: string;
  startDate: string;
  maxParticipants: number;
  location: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string;
  objectives: string;
  image: FileList;
  syllabus: FileList;
}

const AddTraining = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<TrainingForm>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TrainingForm) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Ajouter tous les champs au FormData
      Object.keys(data).forEach(key => {
        if (key === 'image' || key === 'syllabus') {
          const files = data[key as keyof TrainingForm];
          if (files instanceof FileList && files.length > 0) {
            formData.append(key, files[0]);
          }
        } else {
          formData.append(key, data[key as keyof TrainingForm].toString());
        }
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/seller/training`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Formation ajoutée avec succès');
        router.push('/seller/training');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la formation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle formation</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Titre de la formation</label>
            <input
              {...register('title', { required: true })}
              className="w-full p-2 border rounded"
            />
            {errors.title && <span className="text-red-500">Ce champ est requis</span>}
          </div>

          <div>
            <label className="block mb-2">Catégorie</label>
            <select
              {...register('category', { required: true })}
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="business">Business</option>
              <option value="technology">Technologie</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="personal">Développement personnel</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Prix (CFA)</label>
            <input
              type="number"
              {...register('price', { required: true, min: 0 })}
              className="w-full p-2 border rounded"
            />
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
                {...register('image', { required: true })}
                accept="image/*"
                className="hidden"
                id="image"
              />
              <label htmlFor="image" className="cursor-pointer">
                <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm text-gray-600">
                  Cliquez pour sélectionner une image
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-2">Programme détaillé (PDF)</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                {...register('syllabus')}
                accept=".pdf"
                className="hidden"
                id="syllabus"
              />
              <label htmlFor="syllabus" className="cursor-pointer">
                <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm text-gray-600">
                  Cliquez pour sélectionner un fichier PDF
                </span>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Création en cours...' : 'Créer la formation'}
        </button>
      </form>
    </div>
  );
};

export default AddTraining; 