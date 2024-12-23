"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { Paintbrush, Check, Upload, Trash2, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";

interface Theme {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  isActive: boolean;
  version: string;
  author: string;
  customization: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
}

export default function ThemeManager() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/themes`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setThemes(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateTheme = async (themeId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/themes/${themeId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        await fetchThemes();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteTheme = async (themeId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/themes/${themeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        await fetchThemes();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleThemeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('theme', file);

    try {
      const response = await fetch(`${BASE_URL}/api/admin/themes/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        await fetchThemes();
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
        <h1 className="text-2xl font-bold">Gestion des thèmes</h1>
        <div className="relative">
          <Input
            type="file"
            accept=".zip"
            className="hidden"
            id="theme-upload"
            onChange={handleThemeUpload}
          />
          <Button
            onClick={() => document.getElementById('theme-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Installer un thème
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card key={theme.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <Image
                src={theme.thumbnail}
                alt={theme.name}
                width={400}
                height={300}
                className="w-full h-auto rounded-lg"
              />
              {theme.isActive && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  Actif
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{theme.name}</h3>
                  <p className="text-sm text-gray-500">{theme.description}</p>
                </div>
                <p className="text-xs text-gray-500">v{theme.version}</p>
              </div>
              <p className="text-sm text-gray-500 mb-4">Par {theme.author}</p>
              <div className="flex gap-2">
                {!theme.isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => activateTheme(theme.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Activer
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTheme(theme)}
                >
                  <Paintbrush className="h-4 w-4 mr-2" />
                  Personnaliser
                </Button>
                {!theme.isActive && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTheme(theme.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Dialog de personnalisation */}
      <Dialog open={!!selectedTheme} onOpenChange={() => setSelectedTheme(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Personnaliser {selectedTheme?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedTheme && (
            <div className="grid gap-6">
              <div>
                <h3 className="font-semibold mb-2">Couleurs</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm">Primaire</label>
                    <input
                      type="color"
                      value={selectedTheme.customization.colors.primary}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Secondaire</label>
                    <input
                      type="color"
                      value={selectedTheme.customization.colors.secondary}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Accent</label>
                    <input
                      type="color"
                      value={selectedTheme.customization.colors.accent}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Typographie</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Police des titres</label>
                    <select
                      value={selectedTheme.customization.fonts.heading}
                      className="w-full"
                    >
                      <option>Arial</option>
                      <option>Roboto</option>
                      <option>Open Sans</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm">Police du texte</label>
                    <select
                      value={selectedTheme.customization.fonts.body}
                      className="w-full"
                    >
                      <option>Arial</option>
                      <option>Roboto</option>
                      <option>Open Sans</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {previewMode ? 'Masquer' : 'Aperçu'}
                </Button>
                <Button>
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 