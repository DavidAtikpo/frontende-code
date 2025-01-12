"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
const { BASE_URL } = API_CONFIG;

interface UserSettings {
  name: string;
  email: string;
  address: string;
  phone: string;
  preferences: {
    language: string;
    currency: string;
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    newsletter: boolean;
  };
}

interface ApiResponse {
  success: boolean;
  data: {
    name: string;
    email: string;
    phoneNumber: string;
    preferences: UserSettings['preferences'];
  };
}

export default function UserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const { data } = await response.json() as ApiResponse;
        setSettings({
          name: data.name,
          email: data.email,
          address: '',
          phone: data.phoneNumber || '',
          preferences: data.preferences || {
            language: 'fr',
            currency: 'XOF',
            theme: 'light',
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            newsletter: true
          }
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceUpdate = async (key: string, value: any) => {
    if (!settings) return;

    try {
      const token = getCookie('token');
      let updateData;

      // Handle nested notifications object
      if (key.startsWith('notifications.')) {
        const notificationKey = key.split('.')[1];
        updateData = {
          notifications: {
            ...settings.preferences.notifications,
            [notificationKey]: value
          }
        };
      } else {
        updateData = { [key]: value };
      }

      const response = await fetch(`${BASE_URL}/api/user/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const { data } = await response.json();
        setSettings(prev => prev ? {
          ...prev,
          preferences: data
        } : null);
        toast({
          title: "Succès",
          description: "Préférences mises à jour"
        });
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
        variant: "destructive"
      });
    }
  };

  if (loading) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
  
      {/* Préférences */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Langue</Label>
              <Select
                value={settings?.preferences.language}
                onValueChange={(value) => handlePreferenceUpdate('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Devise</Label>
              <Select
                value={settings?.preferences.currency}
                onValueChange={(value) => handlePreferenceUpdate('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">FCFA (XOF)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Notifications par email</Label>
                <Switch
                  checked={settings?.preferences.notifications.email}
                  onCheckedChange={(checked) => 
                    handlePreferenceUpdate('notifications', {
                      ...settings?.preferences.notifications,
                      email: checked
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Notifications push</Label>
                <Switch
                  checked={settings?.preferences.notifications.push}
                  onCheckedChange={(checked) => 
                    handlePreferenceUpdate('notifications', {
                      ...settings?.preferences.notifications,
                      push: checked
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Notifications SMS</Label>
                <Switch
                  checked={settings?.preferences.notifications.sms}
                  onCheckedChange={(checked) => 
                    handlePreferenceUpdate('notifications', {
                      ...settings?.preferences.notifications,
                      sms: checked
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Newsletter</Label>
              <p className="text-sm text-muted-foreground">
                Recevez nos dernières actualités et offres
              </p>
            </div>
            <Switch
              checked={settings?.preferences.newsletter}
              onCheckedChange={(checked) => 
                handlePreferenceUpdate('newsletter', checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


