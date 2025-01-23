"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUpload, FaMapMarkerAlt } from 'react-icons/fa';
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
  location: string;
}

const AddRestaurant = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [formData, setFormData] = useState<RestaurantForm>({
    name: '',
    description: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    logo: undefined as unknown as FileList,
    coverImage: undefined as unknown as FileList,
    location: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          setLogoPreview(reader.result as string);
        } else {
          setCoverPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        [type]: e.target.files as FileList
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.address || !formData.city || !formData.phoneNumber) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      const submitData = new FormData();

      // Ajouter les fichiers
      if (formData.logo[0]) submitData.append('logo', formData.logo[0]);
      if (formData.coverImage[0]) submitData.append('coverImage', formData.coverImage[0]);

      // Ajouter les autres données
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'logo' && key !== 'coverImage' && value) {
          submitData.append(key, value);
        }
      });

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/restaurants/add`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Restaurant créé avec succès');
        router.push(`/seller/restaurant/dishes/add?restaurantId=${response.data.restaurantId}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer un nouveau restaurant</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Nom du restaurant <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">Logo</label>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'logo')}
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
                <Image src={logoPreview} alt="Logo preview" width={100} height={100} className="rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2">Image de couverture</label>
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 'coverImage')}
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
                <Image src={coverPreview} alt="Cover preview" width={100} height={100} className="w-full h-32 object-cover rounded" />
              </div>
            )}
          </div>
        </div>

        {/* Adresse et contact */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Adresse <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Ville <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Téléphone <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2">Lien Google Maps</label>
            <div className="flex gap-2">
              <input
                type="url"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="https://maps.google.com/..."
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://www.google.com/maps', '_blank');
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                title="Ouvrir Google Maps"
              >
                <FaMapMarkerAlt />
              </a>
            </div>
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