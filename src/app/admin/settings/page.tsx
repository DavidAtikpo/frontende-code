"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Settings, Mail, Globe, Shield, Bell, Database,
  Save, RefreshCcw, Server, Users, CreditCard 
} from 'lucide-react';
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";

interface SettingsData {
  id: string;
  key: string;
  name: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'email' | 'password';
  category: string;
  description?: string;
  options?: { label: string; value: string }[];
}

interface GroupedSettings {
  [key: string]: SettingsData[];
}

const SETTING_CATEGORIES = {
  general: { icon: Settings, label: 'Général' },
  email: { icon: Mail, label: 'Email' },
  security: { icon: Shield, label: 'Sécurité' },
  notifications: { icon: Bell, label: 'Notifications' },
  system: { icon: Server, label: 'Système' },
  users: { icon: Users, label: 'Utilisateurs' },
  payment: { icon: CreditCard, label: 'Paiement' }
};

const defaultSettings: GroupedSettings = {
  general: [
    {
      id: '1',
      key: 'siteName',
      name: 'Nom du site',
      value: '',
      type: 'text',
      category: 'general',
      description: 'Le nom qui apparaîtra dans le titre du site'
    },
    {
      id: '2',
      key: 'siteDescription',
      name: 'Description du site',
      value: '',
      type: 'textarea',
      category: 'general',
      description: 'Description courte du site pour le SEO'
    },
    {
      id: '3',
      key: 'maintenanceMode',
      name: 'Mode maintenance',
      value: false,
      type: 'boolean',
      category: 'general',
      description: 'Activer le mode maintenance du site'
    }
  ],
  email: [
    {
      id: '4',
      key: 'smtpHost',
      name: 'Serveur SMTP',
      value: '',
      type: 'text',
      category: 'email',
      description: 'Adresse du serveur SMTP'
    },
    {
      id: '5',
      key: 'smtpPort',
      name: 'Port SMTP',
      value: 587,
      type: 'number',
      category: 'email'
    },
    {
      id: '6',
      key: 'smtpUser',
      name: 'Utilisateur SMTP',
      value: '',
      type: 'text',
      category: 'email'
    },
    {
      id: '7',
      key: 'smtpPassword',
      name: 'Mot de passe SMTP',
      value: '',
      type: 'password',
      category: 'email'
    }
  ],
  security: [
    {
      id: '8',
      key: 'maxLoginAttempts',
      name: 'Tentatives de connexion max',
      value: 5,
      type: 'number',
      category: 'security',
      description: 'Nombre maximum de tentatives de connexion avant blocage'
    },
    {
      id: '9',
      key: 'passwordPolicy',
      name: 'Politique de mot de passe',
      value: 'medium',
      type: 'select',
      category: 'security',
      options: [
        { label: 'Basique', value: 'basic' },
        { label: 'Moyen', value: 'medium' },
        { label: 'Fort', value: 'strong' }
      ]
    },
    {
      id: '10',
      key: 'twoFactorAuth',
      name: 'Authentification à deux facteurs',
      value: false,
      type: 'boolean',
      category: 'security',
      description: 'Activer l\'authentification à deux facteurs pour tous les utilisateurs'
    }
  ],
  notifications: [
    {
      id: '11',
      key: 'emailNotifications',
      name: 'Notifications par email',
      value: true,
      type: 'boolean',
      category: 'notifications'
    },
    {
      id: '12',
      key: 'adminEmail',
      name: 'Email administrateur',
      value: '',
      type: 'email',
      category: 'notifications',
      description: 'Email qui recevra les notifications administrateur'
    }
  ],
  system: [
    {
      id: '13',
      key: 'debugMode',
      name: 'Mode debug',
      value: false,
      type: 'boolean',
      category: 'system'
    },
    {
      id: '14',
      key: 'logLevel',
      name: 'Niveau de log',
      value: 'error',
      type: 'select',
      category: 'system',
      options: [
        { label: 'Error', value: 'error' },
        { label: 'Warning', value: 'warning' },
        { label: 'Info', value: 'info' },
        { label: 'Debug', value: 'debug' }
      ]
    }
  ]
};

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<GroupedSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/site-settings`);
      const data = await response.json();
      if (data.success) {
        const grouped = data.data.reduce((acc: GroupedSettings, setting: SettingsData) => {
          const category = setting.category || 'Général';
          if (!acc[category]) acc[category] = [];
          acc[category].push(setting);
          return acc;
        }, {});
        setSettings(grouped);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    setSaving(true);
    try {
      const flatSettings = Object.values(settings).flat();
      const response = await fetch(`${BASE_URL}/api/admin/site-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        body: JSON.stringify({ settings: flatSettings }),
        credentials: 'include'
      });

      if (response.ok) {
        // Recharger les paramètres pour confirmer les changements
        await fetchSettings();
        toast({
          title: "Succès",
          description: "Les paramètres ont été mis à jour"
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSettingValue = (category: string, key: string, value: string | number | boolean) => {
    setSettings((prev: GroupedSettings) => ({
      ...prev,
      [category]: prev[category].map(setting => 
        setting.key === key ? { ...setting, value } : setting
      )
    }));
  };

  const renderSettingInput = (setting: SettingsData, category: string) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            id={setting.key}
            checked={setting.value as boolean}
            onCheckedChange={(checked) => 
              updateSettingValue(category, setting.key, checked)
            }
          />
        );
      case 'number':
        return (
          <Input
            id={setting.key}
            type="number"
            value={setting.value as number}
            onChange={(e) => 
              updateSettingValue(category, setting.key, Number(e.target.value))
            }
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={setting.key}
            value={setting.value as string}
            onChange={(e) => 
              updateSettingValue(category, setting.key, e.target.value)
            }
            rows={4}
          />
        );
      case 'select':
        return (
          <Select
            value={setting.value as string}
            onValueChange={(value) => 
              updateSettingValue(category, setting.key, value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            id={setting.key}
            value={setting.value as string}
            onChange={(e) => 
              updateSettingValue(category, setting.key, e.target.value)
            }
          />
        );
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Paramètres du système</h1>
        <Button 
          onClick={handleUpdateSettings} 
          disabled={saving}
        >
          {saving ? (
            <RefreshCcw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Enregistrer les modifications
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 gap-4 mb-6">
          {Object.entries(SETTING_CATEGORIES).map(([key, { icon: Icon, label }]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(settings).map(([category, categorySettings]) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {SETTING_CATEGORIES[category as keyof typeof SETTING_CATEGORIES]?.icon && 
                    React.createElement(SETTING_CATEGORIES[category as keyof typeof SETTING_CATEGORIES].icon, { className: "h-5 w-5" })}
                  {SETTING_CATEGORIES[category as keyof typeof SETTING_CATEGORIES]?.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {categorySettings.map((setting) => (
                  <div key={setting.key} className="grid gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Label htmlFor={setting.key}>{setting.name}</Label>
                        {setting.description && (
                          <p className="text-sm text-gray-500">{setting.description}</p>
                        )}
                      </div>
                      {renderSettingInput(setting, category)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
