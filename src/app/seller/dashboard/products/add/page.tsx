"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/components/ui/use-toast";
import { getApiUrl } from '@/utils/api';
import { ArrowLeft } from "lucide-react";

const BASE_URL = `${getApiUrl()}/api`;

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await fetch(`${BASE_URL}/seller/products`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout du produit");

      toast({
        title: "Succès",
        description: "Produit ajouté avec succès",
      });

      router.push('/seller/dashboard/products');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Ajouter un nouveau produit</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du produit</Label>
              <Input id="name" name="name" required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prix</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="100"
                  required 
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input 
                  id="stock" 
                  name="stock" 
                  type="number" 
                  min="0" 
                  required 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Électronique</SelectItem>
                  <SelectItem value="clothing">Vêtements</SelectItem>
                  <SelectItem value="food">Alimentation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Images du produit</Label>
              <ImageUpload
                value={images.map(file => URL.createObjectURL(file))}
                onChange={(files) => setImages(Array.from(files))}
                maxFiles={5}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Ajout en cours..." : "Ajouter le produit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 