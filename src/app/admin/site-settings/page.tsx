"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading";
import { Save, RefreshCcw } from 'lucide-react';
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";


interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    phoneNumber: string;
    address: string;
  };
  features: {
    enableRegistration: boolean;
    enableReviews: boolean;
    enableChat: boolean;
    maintenanceMode: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    senderEmail: string;
    senderName: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

export default function SiteSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refreshToken = async () => {
    try {
      const refreshTokenValue = getCookie('refreshToken');
      const response = await fetch(`${BASE_URL}/api/admin/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      const data = await response.json();
      if (data.success) {
        document.cookie = `token=${data.accessToken}; path=/`;
        return data.accessToken;
      } else {
        throw new Error('Échec du rafraîchissement du token');
      }
    } catch (error) {
      console.error('Erreur refresh token:', error);
      router.push('/adminLogin');
      return null;
    }
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const token = getCookie('token');
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (response.status === 401) {
        // Token expiré, essayer de le rafraîchir
        const newToken = await refreshToken();
        if (!newToken) return null;

        // Réessayer avec le nouveau token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          },
          credentials: 'include'
        });
      }

      return response;
    } catch (error) {
      console.error('Erreur fetchWithAuth:', error);
      return null;
    }
  };

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${BASE_URL}/api/admin/site-settings`);
      
      if (!response) {
        throw new Error('Erreur d\'authentification');
      }

      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des paramètres');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/api/admin/site-settings`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        }
      );

      if (!response) {
        throw new Error('Erreur d\'authentification');
      }

      if (response.ok) {
        await fetchSettings();
      } else {
        throw new Error('Erreur lors de la sauvegarde des paramètres');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuration du site</h1>
        <Button 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <RefreshCcw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Enregistrer
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nom du site</Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteName: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Description</Label>
                <Input
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteDescription: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de contact</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.general.contactEmail}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, contactEmail: e.target.value }
                  })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card className="p-6">
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Inscription utilisateurs</Label>
                  <p className="text-sm text-gray-500">
                    Autoriser les nouvelles inscriptions
                  </p>
                </div>
                <Switch
                  checked={settings.features.enableRegistration}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    features: { ...settings.features, enableRegistration: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Mode maintenance</Label>
                  <p className="text-sm text-gray-500">
                    Activer le mode maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.features.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    features: { ...settings.features, maintenanceMode: checked }
                  })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ... Autres onglets ... */}
      </Tabs>
    </div>
  );
} 