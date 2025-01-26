"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import axios from 'axios';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

const { BASE_URL } = API_CONFIG;

interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

// Constante pour l'image par défaut
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

// Fonction pour gérer les URLs des images


export default function EditShopPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Charger les données de la boutique
  useEffect(() => {
    const fetchShop = async () => {
      const token = getCookie('token');
      if (!token) return;

      try {
        const response = await axios.get(`${BASE_URL}/shops`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setShop(response.data.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la boutique:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de la boutique",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShop();
  }, [toast]);

  const onDropLogo = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setLogoFile(acceptedFiles[0]);
    }
  }, []);

  const onDropCover = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setCoverFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps } = useDropzone({
    onDrop: onDropLogo,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps } = useDropzone({
    onDrop: onDropCover,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;

    setIsSaving(true);
    const token = getCookie('token');
    if (!token) return;

    const formData = new FormData();
    Object.entries(shop).forEach(([key, value]) => {
      if (key === 'socialMedia') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    if (coverFile) {
      formData.append('coverImage', coverFile);
    }

    try {
      const response = await axios.put(`${BASE_URL}/seller/shop`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast({
          title: "Succès",
          description: "Boutique mise à jour avec succès",
        });
        router.push('/seller/dashboard/shop');
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la boutique",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="p-6">
        <div className="text-center">
          Boutique non trouvée
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Modifier la boutique</h1>
            <p className="text-muted-foreground">
              Modifiez les informations de votre boutique
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Logo de la boutique</Label>
                <div
                  {...getLogoRootProps()}
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary"
                >
                  <input {...getLogoInputProps()} />
                  {logoFile ? (
                    <Image
                      src={URL.createObjectURL(logoFile)}
                      alt="Logo preview"
                      width={200}
                      height={200}
                      className="mx-auto rounded-lg object-cover"
                    />
                  ) : shop.logo ? (
                    <Image
                      src={shop.logo}
                      alt="Current logo"
                      width={200}
                      height={200}
                      className="mx-auto rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="py-4">
                      <p>Glissez et déposez le logo ici, ou cliquez pour sélectionner</p>
                      <p className="text-sm text-gray-500">PNG, JPG jusqu'à 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image de couverture</Label>
                <div
                  {...getCoverRootProps()}
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary"
                >
                  <input {...getCoverInputProps()} />
                  {coverFile ? (
                    <Image
                      src={URL.createObjectURL(coverFile)}
                      alt="Cover preview"
                      width={800}
                      height={200}
                      className="mx-auto rounded-lg object-cover"
                    />
                  ) : shop.coverImage ? (
                    <Image
                      src={shop.coverImage}
                      alt="Current cover"
                      width={800}
                      height={200}
                      className="mx-auto rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="py-4">
                      <p>Glissez et déposez l'image de couverture ici, ou cliquez pour sélectionner</p>
                      <p className="text-sm text-gray-500">PNG, JPG jusqu'à 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom de la boutique</Label>
                <Input
                  id="name"
                  value={shop.name}
                  onChange={(e) => setShop({ ...shop, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={shop.description}
                  onChange={(e) => setShop({ ...shop, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={shop.address}
                  onChange={(e) => setShop({ ...shop, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={shop.phone}
                    onChange={(e) => setShop({ ...shop, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shop.email}
                    onChange={(e) => setShop({ ...shop, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingHours">Horaires d'ouverture</Label>
                <Textarea
                  id="openingHours"
                  value={shop.openingHours}
                  onChange={(e) => setShop({ ...shop, openingHours: e.target.value })}
                  placeholder="Ex: Lun-Ven: 9h-18h, Sam: 9h-13h"
                />
              </div>

              <div className="space-y-4">
                <Label>Réseaux sociaux</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={shop.socialMedia.facebook || ''}
                      onChange={(e) => setShop({
                        ...shop,
                        socialMedia: { ...shop.socialMedia, facebook: e.target.value }
                      })}
                      placeholder="URL Facebook"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={shop.socialMedia.instagram || ''}
                      onChange={(e) => setShop({
                        ...shop,
                        socialMedia: { ...shop.socialMedia, instagram: e.target.value }
                      })}
                      placeholder="URL Instagram"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={shop.socialMedia.twitter || ''}
                      onChange={(e) => setShop({
                        ...shop,
                        socialMedia: { ...shop.socialMedia, twitter: e.target.value }
                      })}
                      placeholder="URL Twitter"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
} 