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
import { Switch } from "@/components/ui/switch";

const BASE_URL = `${getApiUrl()}/api`;

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDigital, setIsDigital] = useState(false);
  const [digitalFiles, setDigitalFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Ajouter les images
    images.forEach((image) => {
      formData.append('images', image);
    });

    // Ajouter les fichiers numériques si produit digital
    if (isDigital) {
      digitalFiles.forEach((file) => {
        formData.append('digitalFiles', file);
      });
    }

    // Convertir les dimensions en JSON
    const dimensions = {
      length: formData.get('length'),
      width: formData.get('width'),
      height: formData.get('height'),
      unit: 'cm'
    };
    formData.append('dimensions', JSON.stringify(dimensions));

    // Convertir les attributs en JSON
    const attributes = {
      color: formData.get('color'),
      size: formData.get('size'),
      material: formData.get('material')
    };
    formData.append('attributes', JSON.stringify(attributes));

    // Ajouter isDigital explicitement
    formData.append('isDigital', isDigital.toString());

    try {
      const response = await fetch(`${BASE_URL}/products/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'ajout du produit");
      }

      toast({
        title: "Succès",
        description: "Produit ajouté avec succès",
      });

      router.push('/seller/dashboard/products');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Impossible d'ajouter le produit";
      
      toast({
        title: "Erreur",
        description: errorMessage,
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
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Ajouter un nouveau produit</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {/* Informations de base */}
            <div>
              <Label htmlFor="name">Nom du produit</Label>
              <Input id="name" name="name" required />
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" required />
            </div>

            <div>
              <Label htmlFor="barcode">Code-barres</Label>
              <Input id="barcode" name="barcode" />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description complète</Label>
              <Textarea id="description" name="description" required />
            </div>

            <div>
              <Label htmlFor="shortDescription">Description courte</Label>
              <Textarea id="shortDescription" name="shortDescription" required />
            </div>

            {/* Prix */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Prix</Label>
                <Input id="price" name="price" type="number" min="0" step="100" required />
              </div>

              <div>
                <Label htmlFor="compareAtPrice">Prix comparé</Label>
                <Input id="compareAtPrice" name="compareAtPrice" type="number" min="0" step="100" />
              </div>

              <div>
                <Label htmlFor="costPrice">Prix de revient</Label>
                <Input id="costPrice" name="costPrice" type="number" min="0" step="100" />
              </div>
            </div>

            {/* Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantité en stock</Label>
                <Input id="quantity" name="quantity" type="number" min="0" required />
              </div>

              <div>
                <Label htmlFor="lowStockThreshold">Seuil d'alerte stock bas</Label>
                <Input id="lowStockThreshold" name="lowStockThreshold" type="number" min="0" defaultValue="5" />
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length">Longueur (cm)</Label>
                <Input id="length" name="length" type="number" min="0" step="0.1" />
              </div>
              <div>
                <Label htmlFor="width">Largeur (cm)</Label>
                <Input id="width" name="width" type="number" min="0" step="0.1" />
              </div>
              <div>
                <Label htmlFor="height">Hauteur (cm)</Label>
                <Input id="height" name="height" type="number" min="0" step="0.1" />
              </div>
            </div>

            <div>
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input id="weight" name="weight" type="number" min="0" step="0.1" />
            </div>

            {/* Catégorie */}
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select name="categoryId">
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

            {/* Produit digital */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isDigital"
                name="isDigital"
                checked={isDigital}
                onCheckedChange={setIsDigital}
              />
              <Label htmlFor="isDigital">Produit digital</Label>
            </div>

            {isDigital && (
              <div>
                <Label>Fichiers numériques</Label>
                <Input
                  type="file"
                  onChange={(e) => setDigitalFiles(Array.from(e.target.files || []))}
                  multiple
                />
              </div>
            )}

            {/* Images */}
            <div>
              <Label>Images du produit</Label>
              <ImageUpload
                value={images.map(file => URL.createObjectURL(file))}
                onChange={(files) => setImages(Array.from(files))}
                maxFiles={10}
              />
            </div>

            {/* SEO */}
            <div>
              <Label htmlFor="seoTitle">Titre SEO</Label>
              <Input id="seoTitle" name="seoTitle" />
            </div>

            <div>
              <Label htmlFor="seoDescription">Description SEO</Label>
              <Textarea id="seoDescription" name="seoDescription" />
            </div>

            <div>
              <Label htmlFor="seoKeywords">Mots-clés SEO (séparés par des virgules)</Label>
              <Input id="seoKeywords" name="seoKeywords" />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
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