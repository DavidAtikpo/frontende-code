"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface ServiceFormData {
  category: string;
  subCategory: string;
  images: FileList | null;
}

export default function CreateService() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    category: '',
    subCategory: '',
    images: null
  });

  const categories = {
    cleaning: {
      label: "Nettoyage et Entretien",
      subcategories: [
        "Nettoyage de bureaux",
        "Nettoyage industriel",
        "Entretien d'espaces verts",
        "Nettoyage après construction",
        "Désinfection",
        "Nettoyage de vitres"
      ]
    },
    distribution: {
      label: "Partenariat de Distribution",
      subcategories: [
        "Distribution locale",
        "Distribution régionale",
        "Logistique",
        "Stockage",
        "Transport",
        "Livraison express"
      ]
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getCookie('token');
      const formDataToSend = new FormData();

      // Ajouter les champs du formulaire
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subCategory', formData.subCategory);

      // Ajouter les images
      if (formData.images) {
        Array.from(formData.images).forEach((image) => {
          formDataToSend.append('images', image);
        });
      }

      const response = await fetch(`${BASE_URL}/api/services/create`, {
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Catégorie principale
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    category: e.target.value,
                    subCategory: ''
                  }))}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {Object.entries(categories).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Sous-catégorie
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.subCategory}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      subCategory: e.target.value
                    }))}
                  >
                    <option value="">Sélectionnez une sous-catégorie</option>
                    {categories[formData.category as keyof typeof categories].subcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Images du service
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ajoutez des photos représentatives de votre service
                </p>
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