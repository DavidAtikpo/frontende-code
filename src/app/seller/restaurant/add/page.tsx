"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';
import Image from 'next/image';

const { BASE_URL } = API_CONFIG;

interface RestaurantForm {
  name: string;
  description: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
  logo: FileList;
  coverImage: FileList;
  cuisine: string[];
  openingHours: {
    [key: string]: { open: string; close: string };
  };
  priceRange: string;
  deliveryOptions: {
    delivery: boolean;
    takeaway: boolean;
    dineIn: boolean;
  };
  minOrderAmount: number;
  deliveryFee: number;
  preparationTime: number;
}

const AddRestaurant = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<RestaurantForm>();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RestaurantForm) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Ajouter les fichiers
      if (data.logo[0]) formData.append('logo', data.logo[0]);
      if (data.coverImage[0]) formData.append('coverImage', data.coverImage[0]);

      // Ajouter les autres données
      Object.keys(data).forEach(key => {
        if (key !== 'logo' && key !== 'coverImage') {
          const value = data[key as keyof RestaurantForm];
          if (value !== undefined) {
            formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
          }
        }
      });

      const response = await axios.post(
        `${BASE_URL}/api/seller/restaurant/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Restaurant créé avec succès');
        // Rediriger vers la page d'ajout de plats avec l'ID du restaurant
        router.push(`/seller/restaurant/dishes/add?restaurantId=${response.data.restaurantId}`);
      }
    } catch (error) {
      toast.error('Erreur lors de la création du restaurant');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer un nouveau restaurant</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Nom du restaurant</label>
            <input
              {...register('name', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <span className="text-red-500">Ce champ est requis</span>}
          </div>

          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
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
        </div>

        {/* Images */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Logo */}
          <div>
            <label className="block mb-2">Logo</label>
            <input
              type="file"
              {...register('logo')}
              onChange={(e) => handleImageChange(e, setLogoPreview)}
              accept="image/*"
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
            >
              <FaUpload className="mr-2" />
              Choisir un logo
            </label>
            {logoPreview && (
              <div className="mt-2">
                <Image src={logoPreview} alt="Logo preview" width={100} height={100}  className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Image de couverture */}
          <div>
            <label className="block mb-2">Image de couverture</label>
            <input
              type="file"
              {...register('coverImage')}
              onChange={(e) => handleImageChange(e, setCoverPreview)}
              accept="image/*"
              className="hidden"
              id="cover-upload"
            />
            <label
              htmlFor="cover-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
            >
              <FaUpload className="mr-2" />
              Choisir une image de couverture
            </label>
            {coverPreview && (
              <div className="mt-2">
                <Image src={coverPreview} alt="Cover preview" width={100} height={100}  className="w-full h-32 object-cover rounded" />
              </div>
            )}
          </div>
        </div>

        {/* Adresse et contact */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Adresse</label>
            <input
              {...register('address', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2">Ville</label>
            <input
              {...register('city', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2">Téléphone</label>
            <input
              {...register('phoneNumber', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Création en cours...' : 'Créer le restaurant'}
        </button>
      </form>
    </div>
  );
};

export default AddRestaurant; 