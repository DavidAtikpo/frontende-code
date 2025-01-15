"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  quantity: number;
  lowStockThreshold?: number;
  status: string;
  categoryId: string;
  subcategoryId: string;
  sku: string;
  barcode?: string;
  weight?: number;
  images: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    servingSize?: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

const DEFAULT_IMAGE = '/placeholder.jpg';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Charger les données du produit
  useEffect(() => {
    const fetchProduct = async () => {
      const token = getCookie('token');
      if (!token) return;

      try {
        const response = await axios.get(
          API_CONFIG.getFullUrl(`/seller/products/${id}`),
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          const productData = response.data.data;
          setProduct(productData);
          // Initialiser les prévisualisations avec les images existantes
          if (productData.images && productData.images.length > 0) {
            const urls = productData.images.map((img: string) => {
              // Si l'image est une URL complète, la retourner telle quelle
              if (img.startsWith('http')) return img;
              // Sinon, construire l'URL complète en utilisant le chemin de base de l'API
              return `${API_CONFIG.BASE_URL.replace(/\/$/, '')}/uploads/${img}`;
            });
            setPreviewUrls(urls);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du produit:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le produit",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      const token = getCookie('token');
      if (!token) return;

      try {
        const response = await axios.get(
          API_CONFIG.getFullUrl('/seller/categories'),
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Charger les sous-catégories quand une catégorie est sélectionnée
  const fetchSubcategories = async (categoryId: string) => {
    const token = getCookie('token');
    if (!token) return;

    try {
      const response = await axios.get(
        API_CONFIG.getFullUrl(`/seller/subcategories/${categoryId}`),
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSubcategories(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des sous-catégories:", error);
    }
  };

  // Charger les sous-catégories initiales si le produit a une catégorie
  useEffect(() => {
    if (product?.categoryId) {
      fetchSubcategories(product.categoryId);
    }
  }, [product?.categoryId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    if (product?.images) {
      setProduct({
        ...product,
        images: product.images.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSaving(true);
    const token = getCookie('token');
    if (!token) return;

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      // Ajouter toutes les données du produit
      Object.entries(product).forEach(([key, value]) => {
        if (key !== 'images') {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await axios.put(
        API_CONFIG.getFullUrl(`/seller/products/${id}`),
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
          description: "Produit mis à jour avec succès",
        });
        router.push('/seller/dashboard/products');
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
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

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center">
          Produit non trouvé
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
            <h1 className="text-3xl font-bold">Modifier le produit</h1>
            <p className="text-muted-foreground">
              Modifiez les informations du produit
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Images du produit</label>
                  <div className="mt-2 grid grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            console.error("Erreur de chargement de l'image:", target.src);
                            target.src = DEFAULT_IMAGE;
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Ajouter une image</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Nom du produit</label>
                  <Input
                    value={product?.name}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description courte</label>
                  <Input
                    value={product?.shortDescription}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, shortDescription: e.target.value } : null)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description complète</label>
                  <Textarea
                    value={product?.description}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Prix de vente (FCFA)</label>
                  <Input
                    type="number"
                    value={product?.price}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Prix comparé (FCFA)</label>
                  <Input
                    type="number"
                    value={product?.compareAtPrice}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, compareAtPrice: Number(e.target.value) } : null)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Prix de revient (FCFA)</label>
                  <Input
                    type="number"
                    value={product?.costPrice}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, costPrice: Number(e.target.value) } : null)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Quantité en stock</label>
                  <Input
                    type="number"
                    value={product?.quantity}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, quantity: Number(e.target.value) } : null)}
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Seuil d'alerte stock bas</label>
                  <Input
                    type="number"
                    value={product?.lowStockThreshold}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, lowStockThreshold: Number(e.target.value) } : null)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select
                    value={product?.categoryId}
                    onValueChange={(value) => {
                      setProduct(prev => prev ? { ...prev, categoryId: value, subcategoryId: '' } : null);
                      fetchSubcategories(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {product?.categoryId && (
                  <div>
                    <label className="text-sm font-medium">Sous-catégorie</label>
                    <Select
                      value={product?.subcategoryId}
                      onValueChange={(value) => setProduct(prev => prev ? { ...prev, subcategoryId: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une sous-catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">SKU (Code produit)</label>
                  <Input
                    value={product?.sku}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, sku: e.target.value } : null)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Code-barres (optionnel)</label>
                  <Input
                    value={product?.barcode}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, barcode: e.target.value } : null)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Poids (kg)</label>
                  <Input
                    type="number"
                    value={product?.weight}
                    onChange={(e) => setProduct(prev => prev ? { ...prev, weight: Number(e.target.value) } : null)}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Statut</label>
                  <Select
                    value={product?.status}
                    onValueChange={(value) => setProduct(prev => prev ? { ...prev, status: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="outofstock">Rupture de stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Informations nutritionnelles</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Calories</label>
                  <Input
                    type="number"
                    value={product?.nutritionalInfo?.calories}
                    onChange={(e) => setProduct(prev => prev ? {
                      ...prev,
                      nutritionalInfo: {
                        ...prev.nutritionalInfo,
                        calories: Number(e.target.value)
                      }
                    } : null)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Protéines (g)</label>
                  <Input
                    type="number"
                    value={product?.nutritionalInfo?.protein}
                    onChange={(e) => setProduct(prev => prev ? {
                      ...prev,
                      nutritionalInfo: {
                        ...prev.nutritionalInfo,
                        protein: Number(e.target.value)
                      }
                    } : null)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Glucides (g)</label>
                  <Input
                    type="number"
                    value={product?.nutritionalInfo?.carbohydrates}
                    onChange={(e) => setProduct(prev => prev ? {
                      ...prev,
                      nutritionalInfo: {
                        ...prev.nutritionalInfo,
                        carbohydrates: Number(e.target.value)
                      }
                    } : null)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Lipides (g)</label>
                  <Input
                    type="number"
                    value={product?.nutritionalInfo?.fat}
                    onChange={(e) => setProduct(prev => prev ? {
                      ...prev,
                      nutritionalInfo: {
                        ...prev.nutritionalInfo,
                        fat: Number(e.target.value)
                      }
                    } : null)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Fibres (g)</label>
                  <Input
                    type="number"
                    value={product?.nutritionalInfo?.fiber}
                    onChange={(e) => setProduct(prev => prev ? {
                      ...prev,
                      nutritionalInfo: {
                        ...prev.nutritionalInfo,
                        fiber: Number(e.target.value)
                      }
                    } : null)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Sucres (g)</label>
                  <Input
                    type="number"
                    value={product?.nutritionalInfo?.sugar}
                    onChange={(e) => setProduct(prev => prev ? {
                      ...prev,
                      nutritionalInfo: {
                        ...prev.nutritionalInfo,
                        sugar: Number(e.target.value)
                      }
                    } : null)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Sodium (mg)</label>
                  <Input
                    type="number"
                    value={product?.nutritionalInfo?.sodium}
                    onChange={(e) => setProduct(prev => prev ? {
                      ...prev,
                      nutritionalInfo: {
                        ...prev.nutritionalInfo,
                        sodium: Number(e.target.value)
                      }
                    } : null)}
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Portion</label>
                  <Input
                    value={product?.nutritionalInfo?.servingSize}
                    onChange={(e) => setProduct(prev => prev ? {
                      ...prev,
                      nutritionalInfo: {
                        ...prev.nutritionalInfo,
                        servingSize: e.target.value
                      }
                    } : null)}
                  />
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