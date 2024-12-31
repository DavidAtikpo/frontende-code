"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { API_CONFIG } from '@/utils/config';
import axios from 'axios';

const { BASE_URL } = API_CONFIG;

interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

interface SettingsForm {
  businessName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingHours: OpeningHours;
  notifications: {
    email: boolean;
    sms: boolean;
    orderUpdates: boolean;
    marketing: boolean;
  };
  paymentMethods: {
    mobileMoney: boolean;
    bankTransfer: boolean;
    cash: boolean;
  };
}

export default function SellerSettings() {
  const { register, handleSubmit, setValue, watch } = useForm<SettingsForm>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/seller/settings`);
        if (response.data.success) {
          const settings = response.data.data;
          Object.keys(settings).forEach(key => {
            setValue(key as keyof SettingsForm, settings[key]);
          });
        }
      } catch (error) {
        console.error('Erreur chargement paramètres:', error);
        toast.error('Erreur lors du chargement des paramètres');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data: SettingsForm) => {
    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}/api/seller/settings`, data);
      
      if (response.data.success) {
        toast.success('Paramètres mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'entreprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-2">Nom de l'entreprise</label>
              <input
                {...register('businessName')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Description</label>
              <textarea
                {...register('description')}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>
            <div>
              <label className="block mb-2">Adresse</label>
              <input
                {...register('address')}
                className="w-full p-2 border rounded"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horaires d'ouverture</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(watch('openingHours') || {}).map((day) => (
              <div key={day} className="flex items-center space-x-4 mb-4">
                <Switch
                  checked={watch(`openingHours.${day}.isOpen` as any)}
                  onCheckedChange={(checked) => 
                    setValue(`openingHours.${day}.isOpen` as any, checked)
                  }
                />
                <span className="w-24 capitalize">{day}</span>
                <input
                  type="time"
                  {...register(`openingHours.${day}.open`)}
                  className="p-2 border rounded"
                />
                <span>à</span>
                <input
                  type="time"
                  {...register(`openingHours.${day}.close`)}
                  className="p-2 border rounded"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Notifications par email</span>
                <Switch {...register('notifications.email')} />
              </div>
              <div className="flex items-center justify-between">
                <span>Notifications par SMS</span>
                <Switch {...register('notifications.sms')} />
              </div>
              <div className="flex items-center justify-between">
                <span>Mises à jour des commandes</span>
                <Switch {...register('notifications.orderUpdates')} />
              </div>
              <div className="flex items-center justify-between">
                <span>Communications marketing</span>
                <Switch {...register('notifications.marketing')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Méthodes de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Mobile Money</span>
                <Switch {...register('paymentMethods.mobileMoney')} />
              </div>
              <div className="flex items-center justify-between">
                <span>Virement bancaire</span>
                <Switch {...register('paymentMethods.bankTransfer')} />
              </div>
              <div className="flex items-center justify-between">
                <span>Paiement en espèces</span>
                <Switch {...register('paymentMethods.cash')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </div>
  );
} 