"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { getCookie } from "cookies-next";
import { API_CONFIG } from '@/utils/config';
import Image from 'next/image';
import { FaUpload, FaTrash } from 'react-icons/fa';

const { BASE_URL } = API_CONFIG;

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  images: string[];
  status: string;
}

interface EditServiceFormProps {
  params: { id: string };
}

export default function EditServiceForm({ params }: EditServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/services/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Service non trouvé');
      }

      const data = await response.json();
      setService(data.data);
      if (data.data.images) {
        setPreviewImages(data.data.images.map((img: string) => `${BASE_URL}/${img}`));
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du service');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
      
      // Créer des URLs pour la prévisualisation
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = getCookie('token');
      const formData = new FormData();

      // Ajouter les données du service
      if (service) {
        Object.entries(service).forEach(([key, value]) => {
          if (key !== 'images') {
            formData.append(key, value);
          }
        });
      }

      // Ajouter les nouvelles images
      newImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await fetch(`${BASE_URL}/api/services/update/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      toast.success('Service mis à jour avec succès');
      router.push('/seller/services');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!service) {
    return <div>Service non trouvé</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier le service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Titre</label>
              <Input
                value={service.title}
                onChange={(e) => setService({ ...service, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={service.description}
                onChange={(e) => setService({ ...service, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <Input
                  value={service.category}
                  onChange={(e) => setService({ ...service, category: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sous-catégorie</label>
                <Input
                  value={service.subCategory}
                  onChange={(e) => setService({ ...service, subCategory: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Images</label>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Preview ${index}`}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImages(prev => prev.filter((_, i) => i !== index));
                        setNewImages(prev => prev.filter((_, i) => i !== index));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500"
                >
                  <FaUpload />
                  <span>Ajouter des images</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/seller/services')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 