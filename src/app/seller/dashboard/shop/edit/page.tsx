"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '@/utils/config';
import Image from 'next/image';
import { FaCamera, FaStore } from 'react-icons/fa';
import { getCookie } from '@/utils/cookies';

const { BASE_URL } = API_CONFIG;

interface ShopFormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: File | null;
  coverImage: File | null;
}

interface PageProps {
  params: {
    shopId: string;
  };
}

const EditShopPage = ({ params }: PageProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    logo: null,
    coverImage: null
  });

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/seller/shop`);
        if (response.data.success) {
          const shop = response.data.data;
          setFormData({
            name: shop.name,
            description: shop.description,
            address: shop.address,
            phone: shop.phone,
            email: shop.email,
            logo: null,
            coverImage: null
          });
          setLogoPreview(shop.logo);
          setCoverPreview(shop.coverImage);
        }
      } catch (error) {
        console.error('Erreur chargement boutique:', error);
        toast.error('Erreur lors du chargement de la boutique');
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Le fichier est trop volumineux. Maximum 5MB.');
        return;
      }

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
        [type]: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = getCookie('token');
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.put(
        `${BASE_URL}/api/shops/${params.shopId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.data.success) {
        toast.success('Boutique mise à jour avec succès');
        router.push('/seller/dashboard/shop');
      }
    } catch (error) {
      console.error('Erreur mise à jour boutique:', error);
      toast.error('Erreur lors de la mise à jour de la boutique');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Modifier ma boutique</h1>
        <p className="text-gray-600 mt-2">Personnalisez les informations de votre boutique</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images de la boutique */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de la boutique
            </label>
            <div className="relative h-48 w-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={1000}
                  height={1000}
                  style={{ objectFit: 'cover' }}
                  className="w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FaStore className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'logo')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2">
                <FaCamera className="inline-block mr-2" />
                Changer
              </div>
            </div>
          </div>

          {/* Image de couverture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture
            </label>
            <div className="relative h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  width={1000}
                  height={1000}
                  style={{ objectFit: 'cover' }}
                  className="w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FaStore className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'coverImage')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2">
                <FaCamera className="inline-block mr-2" />
                Changer
              </div>
            </div>
          </div>
        </div>

        {/* Informations de la boutique */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la boutique
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditShopPage; 