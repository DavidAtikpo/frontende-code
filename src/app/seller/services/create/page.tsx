"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  maxBookingsPerDay: number;
  location: string;
  requirements: string;
  images: FileList | null;
}

export default function CreateService() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    category: '',
    price: 0,
    duration: 60, // durée en minutes
    maxBookingsPerDay: 5,
    location: '',
    requirements: '',
    images: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getCookie('token');
      const formDataToSend = new FormData();

      // Ajouter les champs du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          formDataToSend.append(key, value.toString());
        }
      });

      // Ajouter les images
      if (formData.images) {
        Array.from(formData.images).forEach((image) => {
          formDataToSend.append(`images`, image);
        });
      }

      const response = await fetch(`${BASE_URL}/api/seller/services`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du service');
      }

      toast.success('Service créé avec succès');
      router.push('/seller/services');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création du service');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: e.target.files
      }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer un nouveau service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Titre du service
                  </label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    placeholder="Ex: Consultation juridique"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Catégorie
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      category: value
                    }))}
                  >
                    <option value="legal">Services juridiques</option>
                    <option value="health">Santé et bien-être</option>
                    <option value="education">Éducation</option>
                    <option value="tech">Services techniques</option>
                    <option value="business">Services aux entreprises</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Prix (FCFA)
                  </label>
                  <Input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      price: Number(e.target.value)
                    }))}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Durée (minutes)
                  </label>
                  <Input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      duration: Number(e.target.value)
                    }))}
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    rows={4}
                    placeholder="Décrivez votre service en détail"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lieu
                  </label>
                  <Input
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: e.target.value
                    }))}
                    placeholder="Adresse ou en ligne"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Prérequis
                  </label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      requirements: e.target.value
                    }))}
                    rows={3}
                    placeholder="Conditions ou documents nécessaires"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Images
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Vous pouvez sélectionner plusieurs images
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Création...' : 'Créer le service'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 