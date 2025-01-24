"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

interface DishForm {
  name: string;
  description: string;
  price: number;
  image: FileList;
  isAvailable: boolean;
  preparationTime: string;
  ingredients: string;
  specialDiet?: string[];
  isSpicy: boolean;
  isVegetarian: boolean;
  isPromoted: boolean;
  promotionalPrice?: number;
  restaurantId: string;
}

const AddDish = () => {
  const router = useRouter();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DishForm>();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const isPromoted = watch('isPromoted');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('restaurantId');
    setRestaurantId(id);

    if (!id) {
      toast.error('Veuillez d\'abord créer un restaurant');
      router.push('/seller/restaurant/add');
    }
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: DishForm) => {
    if (!restaurantId) {
      toast.error('ID du restaurant manquant');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('restaurantId', restaurantId);

      Object.keys(data).forEach(key => {
        if (key === 'image') {
          if (data.image[0]) {
            formData.append('image', data.image[0]);
          }
        } else if (key === 'specialDiet') {
          formData.append('specialDiet', JSON.stringify(data.specialDiet));
        } else {
          const value = data[key as keyof DishForm];
          if (value !== undefined) {
            formData.append(key, value.toString());
          }
        }
      });
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/restaurants/${restaurantId}/dishes`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Plat ajouté avec succès');
        router.push(`/seller/restaurant?restaurantId=${restaurantId}`);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du plat');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau plat</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nom du plat */}
          <div>
            <label className="block mb-2">Nom du plat</label>
            <input
              {...register('name', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <span className="text-red-500">Ce champ est requis</span>}
          </div>

          {/* Prix */}
          <div>
            <label className="block mb-2">Prix (CFA)</label>
            <input
              type="number"
              {...register('price', { required: true, min: 0 })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && <span className="text-red-500">Prix invalide</span>}
          </div>

          {/* Temps de préparation */}
          <div>
            <label className="block mb-2">Temps de préparation (minutes)</label>
            <input
              type="number"
              {...register('preparationTime', { required: true, min: 1 })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2">Description</label>
          <textarea
            {...register('description', { required: true })}
            rows={3}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && <span className="text-red-500">Ce champ est requis</span>}
        </div>

        {/* Ingrédients */}
        <div>
          <label className="block mb-2">Ingrédients</label>
          <textarea
            {...register('ingredients', { required: true })}
            rows={3}
            placeholder="Listez les ingrédients, séparés par des virgules"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2">Image du plat</label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                {...register('image', { required: true })}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
              >
                <FaUpload className="mr-2" />
                Choisir une image
              </label>
            </div>
            {imagePreview && (
              <div className="w-24 h-24 relative">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
          </div>
          {errors.image && <span className="text-red-500">Une image est requise</span>}
        </div>

        {/* Options supplémentaires */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isAvailable')}
                className="form-checkbox"
              />
              <span>Disponible</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isSpicy')}
                className="form-checkbox"
              />
              <span>Épicé</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isVegetarian')}
                className="form-checkbox"
              />
              <span>Végétarien</span>
            </label>
          </div>

          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isPromoted')}
                className="form-checkbox"
              />
              <span>En promotion</span>
            </label>

            {isPromoted && (
              <div>
                <label className="block mb-2">Prix promotionnel (CFA)</label>
                <input
                  type="number"
                  {...register('promotionalPrice', { min: 0 })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Ajout en cours...' : 'Ajouter le plat'}
        </button>
      </form>
    </div>
  );
};

export default AddDish; 