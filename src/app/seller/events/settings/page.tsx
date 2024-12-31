"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaCog, FaMoneyBillWave, FaUserClock, FaExclamationTriangle } from 'react-icons/fa';

interface EventSettings {
  bookingDeadline: number; // heures avant l'événement
  minGuests: number;
  maxGuests: number;
  cancellationPolicy: {
    deadline: number; // heures avant l'événement
    refundPercentage: number;
  };
  paymentSettings: {
    depositRequired: boolean;
    depositPercentage: number;
    paymentDeadline: number; // heures avant l'événement
  };
  notificationSettings: {
    emailReminders: boolean;
    reminderHours: number[];
    smsNotifications: boolean;
  };
}

const EventSettings = () => {
  const [settings, setSettings] = useState<EventSettings>({
    bookingDeadline: 24,
    minGuests: 1,
    maxGuests: 100,
    cancellationPolicy: {
      deadline: 48,
      refundPercentage: 50
    },
    paymentSettings: {
      depositRequired: true,
      depositPercentage: 30,
      paymentDeadline: 72
    },
    notificationSettings: {
      emailReminders: true,
      reminderHours: [24, 48],
      smsNotifications: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/settings`
      );
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des paramètres');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/settings`,
        settings
      );
      if (response.data.success) {
        toast.success('Paramètres mis à jour avec succès');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des paramètres');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Paramètres des événements</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paramètres de réservation */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaUserClock className="text-blue-500 text-xl mr-2" />
            <h2 className="text-xl font-semibold">Paramètres de réservation</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Délai limite de réservation (heures)
              </label>
              <input
                type="number"
                value={settings.bookingDeadline}
                onChange={(e) => setSettings({
                  ...settings,
                  bookingDeadline: parseInt(e.target.value)
                })}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre minimum d'invités
              </label>
              <input
                type="number"
                value={settings.minGuests}
                onChange={(e) => setSettings({
                  ...settings,
                  minGuests: parseInt(e.target.value)
                })}
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre maximum d'invités
              </label>
              <input
                type="number"
                value={settings.maxGuests}
                onChange={(e) => setSettings({
                  ...settings,
                  maxGuests: parseInt(e.target.value)
                })}
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Politique d'annulation */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-yellow-500 text-xl mr-2" />
            <h2 className="text-xl font-semibold">Politique d'annulation</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Délai d'annulation (heures)
              </label>
              <input
                type="number"
                value={settings.cancellationPolicy.deadline}
                onChange={(e) => setSettings({
                  ...settings,
                  cancellationPolicy: {
                    ...settings.cancellationPolicy,
                    deadline: parseInt(e.target.value)
                  }
                })}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Pourcentage de remboursement
              </label>
              <input
                type="number"
                value={settings.cancellationPolicy.refundPercentage}
                onChange={(e) => setSettings({
                  ...settings,
                  cancellationPolicy: {
                    ...settings.cancellationPolicy,
                    refundPercentage: parseInt(e.target.value)
                  }
                })}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Paramètres de paiement */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaMoneyBillWave className="text-green-500 text-xl mr-2" />
            <h2 className="text-xl font-semibold">Paramètres de paiement</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.paymentSettings.depositRequired}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentSettings: {
                    ...settings.paymentSettings,
                    depositRequired: e.target.checked
                  }
                })}
                className="mr-2"
              />
              <label>Acompte requis</label>
            </div>

            {settings.paymentSettings.depositRequired && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pourcentage d'acompte
                  </label>
                  <input
                    type="number"
                    value={settings.paymentSettings.depositPercentage}
                    onChange={(e) => setSettings({
                      ...settings,
                      paymentSettings: {
                        ...settings.paymentSettings,
                        depositPercentage: parseInt(e.target.value)
                      }
                    })}
                    min="0"
                    max="100"
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Délai de paiement (heures)
                  </label>
                  <input
                    type="number"
                    value={settings.paymentSettings.paymentDeadline}
                    onChange={(e) => setSettings({
                      ...settings,
                      paymentSettings: {
                        ...settings.paymentSettings,
                        paymentDeadline: parseInt(e.target.value)
                      }
                    })}
                    min="0"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Paramètres de notification */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FaCog className="text-purple-500 text-xl mr-2" />
            <h2 className="text-xl font-semibold">Paramètres de notification</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notificationSettings.emailReminders}
                onChange={(e) => setSettings({
                  ...settings,
                  notificationSettings: {
                    ...settings.notificationSettings,
                    emailReminders: e.target.checked
                  }
                })}
                className="mr-2"
              />
              <label>Rappels par email</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notificationSettings.smsNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  notificationSettings: {
                    ...settings.notificationSettings,
                    smsNotifications: e.target.checked
                  }
                })}
                className="mr-2"
              />
              <label>Notifications SMS</label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventSettings; 