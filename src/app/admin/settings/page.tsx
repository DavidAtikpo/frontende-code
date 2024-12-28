"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, RefreshCcw } from 'lucide-react';
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";

interface SettingsData {
  id: string;
  key: string;
  name: string;
  value: string | number | boolean;
  type: string;
  category: string;
  description?: string;
}

interface _SettingValue {
  key: string;
  value: string | number | boolean;
}

interface GroupedSettings {
  [key: string]: SettingsData[];
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<GroupedSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      }
    } catch (error) {
      console.error('Erreur:', error);
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

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Paramètres système</h1>
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

      <Tabs defaultValue={Object.keys(settings)[0]}>
        <TabsList className="mb-4">
          {Object.keys(settings).map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(settings).map(([category, categorySettings]) => (
          <TabsContent key={category} value={category}>
            <Card className="p-6">
              <div className="grid gap-6">
                {categorySettings.map(setting => (
                  <div key={setting.key} className="space-y-2">
                    <Label htmlFor={setting.key}>
                      {setting.key}
                      {setting.description && (
                        <span className="text-sm text-gray-500 ml-2">
                          {setting.description}
                        </span>
                      )}
                    </Label>
                    
                    {typeof setting.value === 'boolean' ? (
                      <Switch
                        id={setting.key}
                        checked={setting.value}
                        onCheckedChange={(checked) => 
                          updateSettingValue(category, setting.key, checked)
                        }
                      />
                    ) : typeof setting.value === 'number' ? (
                      <Input
                        id={setting.key}
                        type="number"
                        value={setting.value}
                        onChange={(e) => 
                          updateSettingValue(category, setting.key, Number(e.target.value))
                        }
                      />
                    ) : (
                      <Input
                        id={setting.key}
                        value={setting.value}
                        onChange={(e) => 
                          updateSettingValue(category, setting.key, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
