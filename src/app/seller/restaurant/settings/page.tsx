"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa';
import Image from 'next/image';
import { getCookie } from 'cookies-next';

interface OpeningHours {
  open: string;
  close: string;
  closed: boolean;
}

interface RestaurantSettings {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  cuisine: string[];
  image: string;
  openingHours: {
    monday: OpeningHours;
    tuesday: OpeningHours;
    wednesday: OpeningHours;
    thursday: OpeningHours;
    friday: OpeningHours;
    saturday: OpeningHours;
    sunday: OpeningHours;
  };
  deliveryZones: Array<{
    zone: string;
    fee: number;
  }>;
  minimumOrder: number;
  averagePreparationTime: number;
  specialInstructions?: string;
}

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const DAYS = [
  { id: 'monday' as DayOfWeek, label: 'Lundi' },
  { id: 'tuesday' as DayOfWeek, label: 'Mardi' },
  { id: 'wednesday' as DayOfWeek, label: 'Mercredi' },
  { id: 'thursday' as DayOfWeek, label: 'Jeudi' },
  { id: 'friday' as DayOfWeek, label: 'Vendredi' },
  { id: 'saturday' as DayOfWeek, label: 'Samedi' },
  { id: 'sunday' as DayOfWeek, label: 'Dimanche' }
];

const CUISINE_TYPES = [
  'Africaine',
  'Sénégalaise',
  'Fast Food',
  'Pizza',
  'Burger',
  'Poulet',
  'Poisson',
  'Végétarien',
  'Desserts',
  'Boissons'
];

const SettingsPage = () => {
  const router = useRouter();
  const restaurantId = getCookie('restaurantId');
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!restaurantId) {
      router.push('/seller/restaurant/setup');
      return;
    }
    fetchSettings();
  }, [restaurantId, router]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/settings`
      );
      if (response.data.success) {
        setSettings(response.data.data);
        setImagePreview(response.data.data.image);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des paramètres');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Traiter les horaires d'ouverture
      const openingHours: any = {};
      DAYS.forEach(day => {
        openingHours[day.id] = {
          open: formData.get(`${day.id}_open`),
          close: formData.get(`${day.id}_close`),
          closed: formData.get(`${day.id}_closed`) === 'true'
        };
      });

      // Traiter les zones de livraison
      const deliveryZones = Array.from(formData.getAll('zone')).map((zone, index) => ({
        zone,
        fee: Number(formData.getAll('fee')[index])
      }));

      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        cuisine: formData.getAll('cuisine'),
        openingHours,
        deliveryZones,
        minimumOrder: Number(formData.get('minimumOrder')),
        averagePreparationTime: Number(formData.get('averagePreparationTime')),
        specialInstructions: formData.get('specialInstructions')
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Paramètres mis à jour avec succès');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des paramètres');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Paramètres du Restaurant</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Nom du restaurant</label>
              <input
                type="text"
                name="name"
                defaultValue={settings.name}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                defaultValue={settings.phone}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                defaultValue={settings.description}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2">Adresse</label>
              <input
                type="text"
                name="address"
                defaultValue={settings.address}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Image du restaurant */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Image du restaurant</h2>
          <div className="flex items-center space-x-6">
            {imagePreview && (
              <div className="relative w-32 h-32">
                <Image
                  src={imagePreview}
                  alt="Restaurant"
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image"
              />
              <label
                htmlFor="image"
                className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
              >
                <FaUpload className="mr-2" />
                Changer l'image
              </label>
            </div>
          </div>
        </div>

        {/* Horaires d'ouverture */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Horaires d'ouverture</h2>
          <div className="space-y-4">
            {DAYS.map(day => (
              <div key={day.id} className="grid grid-cols-4 gap-4 items-center">
                <span className="font-medium">{day.label}</span>
                <input
                  type="time"
                  name={`${day.id}_open`}
                  defaultValue={settings.openingHours[day.id].open}
                  className="p-2 border rounded"
                  disabled={settings.openingHours[day.id].closed}
                />
                <input
                  type="time"
                  name={`${day.id}_close`}
                  defaultValue={settings.openingHours[day.id].close}
                  className="p-2 border rounded"
                  disabled={settings.openingHours[day.id].closed}
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name={`${day.id}_closed`}
                    defaultChecked={settings.openingHours[day.id].closed}
                    className="mr-2"
                  />
                  Fermé
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Zones de livraison */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Zones de livraison</h2>
          <div className="space-y-4">
            {settings.deliveryZones.map((zone, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="zone"
                  defaultValue={zone.zone}
                  placeholder="Zone"
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  name="fee"
                  defaultValue={zone.fee}
                  placeholder="Frais de livraison"
                  className="p-2 border rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newZones = [...settings.deliveryZones, { zone: '', fee: 0 }];
                setSettings({ ...settings, deliveryZones: newZones });
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              + Ajouter une zone
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage; 