"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";
import { 
  Settings, 
  Power, 
  Upload, 
  AlertTriangle,
  RefreshCw,
  Shield
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  isActive: boolean;
  hasUpdate: boolean;
  latestVersion?: string;
  settings?: PluginSettings;
  permissions: string[];
  dependencies: string[];
  status: 'active' | 'inactive' | 'error';
  errorMessage?: string;
}

interface PluginSettings {
  [key: string]: string | number | boolean;
}

export default function PluginManager() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/plugins`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setPlugins(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlugin = async (pluginId: string, active: boolean) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/plugins/${pluginId}/${active ? 'activate' : 'deactivate'}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`,
          },
          credentials: 'include'
        }
      );

      if (response.ok) {
        await fetchPlugins();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const updatePlugin = async (pluginId: string) => {
    setUpdating(pluginId);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/plugins/${pluginId}/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        await fetchPlugins();
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handlePluginUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('plugin', file);

    try {
      const response = await fetch(`${BASE_URL}/api/admin/plugins/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        await fetchPlugins();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des plugins</h1>
        <div className="relative">
          <Input
            type="file"
            accept=".zip"
            className="hidden"
            id="plugin-upload"
            onChange={handlePluginUpload}
          />
          <Button
            onClick={() => document.getElementById('plugin-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Installer un plugin
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {plugins.map((plugin) => (
          <Card key={plugin.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  plugin.status === 'active' ? 'bg-green-500' :
                  plugin.status === 'error' ? 'bg-red-500' :
                  'bg-gray-500'
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{plugin.name}</h3>
                    <span className="text-xs text-gray-500">v{plugin.version}</span>
                    {plugin.hasUpdate && (
                      <span className="text-xs text-orange-500">
                        Mise à jour disponible (v{plugin.latestVersion})
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{plugin.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {plugin.hasUpdate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePlugin(plugin.id)}
                    disabled={updating === plugin.id}
                  >
                    {updating === plugin.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPlugin(plugin)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant={plugin.isActive ? "ghost" : "outline"}
                  size="sm"
                  onClick={() => togglePlugin(plugin.id, !plugin.isActive)}
                >
                  <Power className={`h-4 w-4 ${plugin.isActive ? 'text-green-500' : ''}`} />
                </Button>
              </div>
            </div>
            {plugin.status === 'error' && (
              <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm">{plugin.errorMessage}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Dialog des paramètres du plugin */}
      <Dialog open={!!selectedPlugin} onOpenChange={() => setSelectedPlugin(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configuration de {selectedPlugin?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedPlugin && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Informations</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Version</p>
                    <p>{selectedPlugin.version}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Auteur</p>
                    <p>{selectedPlugin.author}</p>
                  </div>
                </div>
              </div>

              {selectedPlugin.permissions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Permissions requises
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedPlugin.permissions.map((perm, index) => (
                      <li key={index}>{perm}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPlugin.settings && Object.keys(selectedPlugin.settings).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Paramètres</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedPlugin.settings).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-sm font-medium">{key}</label>
                        <Input
                          value={String(value)}
                          onChange={(_e) => {
                            // Gérer les modifications des paramètres
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button>
                  Enregistrer les paramètres
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 