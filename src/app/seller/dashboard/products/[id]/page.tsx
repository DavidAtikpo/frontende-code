"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import axios from 'axios';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

const { BASE_URL } = API_CONFIG;

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number;
  quantity: number;
  status: string;
  categoryId: string;
  subcategoryId: string;
  images: string[];
  featured: boolean;
  nutritionalInfo: {
    calories: number | null;
    proteins: number | null;
    carbohydrates: number | null;
    fats: number | null;
    fiber: number | null;
    sodium: number | null;
    servingSize: string | null;
  };
  productType: string;
  origin: string;
  certifications: string;
  preparationTime: string;
  cookingInstructions: string;
  ingredients: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  videoUrl: string;
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

// Fonction utilitaire pour construire l'URL de l'image
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return DEFAULT_IMAGE;
  
  try {
    // Si c'est déjà une URL complète (http ou https)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Nettoyer le chemin de l'image
    const cleanPath = imagePath.replace(/^\/+/, '').replace(/\\/g, '/');

    // Si nous sommes en développement (localhost)
    if (BASE_URL.includes('localhost')) {
      return `http://localhost:5000/${cleanPath}`;
    }

    // En production, s'assurer que le chemin commence par 'uploads'
    if (!cleanPath.startsWith('uploads/')) {
      return `${BASE_URL}/uploads/${cleanPath}`;
    }

    // Si le chemin commence déjà par 'uploads'
    return `${BASE_URL}/${cleanPath}`;

  } catch (error) {
    console.error('Erreur dans getImageUrl:', error, 'Path:', imagePath);
    return DEFAULT_IMAGE;
  }
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

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
          // Initialiser les valeurs par défaut pour éviter les null
          const productData = {
            ...response.data.data,
            shortDescription: response.data.data.shortDescription || '',
            compareAtPrice: response.data.data.compareAtPrice || 0,
            featured: response.data.data.featured || false,
            images: response.data.data.images || [],
            nutritionalInfo: {
              calories: response.data.data.nutritionalInfo?.calories || null,
              proteins: response.data.data.nutritionalInfo?.proteins || null,
              carbohydrates: response.data.data.nutritionalInfo?.carbohydrates || null,
              fats: response.data.data.nutritionalInfo?.fats || null,
              fiber: response.data.data.nutritionalInfo?.fiber || null,
              sodium: response.data.data.nutritionalInfo?.sodium || null,
              servingSize: response.data.data.nutritionalInfo?.servingSize || ''
            },
            productType: response.data.data.productType || '',
            origin: response.data.data.origin || '',
            certifications: response.data.data.certifications || '',
            preparationTime: response.data.data.preparationTime || '',
            cookingInstructions: response.data.data.cookingInstructions || '',
            ingredients: response.data.data.ingredients || '',
            seoTitle: response.data.data.seoTitle || '',
            seoDescription: response.data.data.seoDescription || '',
            seoKeywords: response.data.data.seoKeywords || '',
            videoUrl: response.data.data.videoUrl || ''
          };
          setProduct(productData);
          if (productData.images) {
            setImageUrls(productData.images);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSaving(true);
    const token = getCookie('token');
    if (!token) return;

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (key === 'nutritionalInfo') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Ajouter les nouvelles images
    selectedImages.forEach((file) => {
      formData.append('images', file);
    });

    // Ajouter la vidéo si elle existe
    if (videoFile) {
      formData.append('video', videoFile);
    }

    try {
      const response = await axios.put(
        API_CONFIG.getFullUrl(`/products/update-product/${id}`),
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedImages(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5242880 // 5MB
  });

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeImageUrl = (index: number) => {
    if (product) {
      const newImages = [...product.images];
      newImages.splice(index, 1);
      setProduct({ ...product, images: newImages });
    }
  };

  const handleNutritionalInfoChange = (field: string, value: number | string | null) => {
    if (!product) return;
    setProduct({
      ...product,
      nutritionalInfo: {
        ...product.nutritionalInfo,
        [field]: value
      }
    });
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
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Informations de base</TabsTrigger>
            <TabsTrigger value="media">Médias</TabsTrigger>
            <TabsTrigger value="food">Informations alimentaires</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du produit</Label>
                    <Input
                      id="name"
                      value={product.name}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={product.sku}
                      onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Prix</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compareAtPrice">Prix de comparaison</Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.compareAtPrice}
                      onChange={(e) => setProduct({ ...product, compareAtPrice: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité en stock</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={product.quantity}
                      onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select
                      value={product.status}
                      onValueChange={(value) => setProduct({ ...product, status: value })}
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

                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Catégorie</Label>
                    <Select
                      value={product.categoryId}
                      onValueChange={(value) => {
                        setProduct({ ...product, categoryId: value, subcategoryId: '' });
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

                  <div className="space-y-2">
                    <Label htmlFor="subcategoryId">Sous-catégorie</Label>
                    <Select
                      value={product.subcategoryId}
                      onValueChange={(value) => setProduct({ ...product, subcategoryId: value })}
                      disabled={!product.categoryId || subcategories.length === 0}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Description courte</Label>
                  <Textarea
                    id="shortDescription"
                    value={product.shortDescription}
                    onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={product.featured}
                    onCheckedChange={(checked) => setProduct({ ...product, featured: checked })}
                  />
                  <Label htmlFor="featured">Produit en vedette</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Images du produit</Label>
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
                  >
                    <input {...getInputProps()} />
                    <p>Glissez et déposez des images ici, ou cliquez pour sélectionner</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
                  </div>
                </div>

                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Image ${index + 1}`}
                          width={200}
                          height={200}
                          className="rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {product.images && product.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={getImageUrl(image)}
                          alt={`Image ${index + 1}`}
                          width={200}
                          height={200}
                          className="rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = DEFAULT_IMAGE;
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeImageUrl(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="video">Vidéo du produit</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                  />
                  <p className="text-sm text-gray-500">MP4, WebM jusqu'à 50MB</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">URL de la vidéo</Label>
                  <Input
                    type="url"
                    placeholder="https://"
                    value={product.videoUrl || ''}
                    onChange={(e) => setProduct({ ...product, videoUrl: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="food">
            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productType">Type de produit</Label>
                    <Select
                      value={product.productType}
                      onValueChange={(value) => setProduct({ ...product, productType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frais">Frais</SelectItem>
                        <SelectItem value="surgelé">Surgelé</SelectItem>
                        <SelectItem value="sec">Sec</SelectItem>
                        <SelectItem value="conserve">Conserve</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origin">Origine</Label>
                    <Input
                      value={product.origin}
                      onChange={(e) => setProduct({ ...product, origin: e.target.value })}
                      placeholder="Pays/Région d'origine"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Informations nutritionnelles</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Calories</Label>
                      <Input
                        type="number"
                        placeholder="kcal"
                        value={product.nutritionalInfo.calories || ''}
                        onChange={(e) => handleNutritionalInfoChange('calories', e.target.value ? Number(e.target.value) : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Protéines</Label>
                      <Input
                        type="number"
                        placeholder="g"
                        value={product.nutritionalInfo.proteins || ''}
                        onChange={(e) => handleNutritionalInfoChange('proteins', e.target.value ? Number(e.target.value) : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Glucides</Label>
                      <Input
                        type="number"
                        placeholder="g"
                        value={product.nutritionalInfo.carbohydrates || ''}
                        onChange={(e) => handleNutritionalInfoChange('carbohydrates', e.target.value ? Number(e.target.value) : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lipides</Label>
                      <Input
                        type="number"
                        placeholder="g"
                        value={product.nutritionalInfo.fats || ''}
                        onChange={(e) => handleNutritionalInfoChange('fats', e.target.value ? Number(e.target.value) : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fibres</Label>
                      <Input
                        type="number"
                        placeholder="g"
                        value={product.nutritionalInfo.fiber || ''}
                        onChange={(e) => handleNutritionalInfoChange('fiber', e.target.value ? Number(e.target.value) : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sodium</Label>
                      <Input
                        type="number"
                        placeholder="mg"
                        value={product.nutritionalInfo.sodium || ''}
                        onChange={(e) => handleNutritionalInfoChange('sodium', e.target.value ? Number(e.target.value) : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Portion</Label>
                      <Input
                        placeholder="Ex: 100g"
                        value={product.nutritionalInfo.servingSize || ''}
                        onChange={(e) => handleNutritionalInfoChange('servingSize', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Input
                    value={product.certifications}
                    onChange={(e) => setProduct({ ...product, certifications: e.target.value })}
                    placeholder="Séparées par des virgules"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preparationTime">Temps de préparation (minutes)</Label>
                  <Input
                    type="number"
                    value={product.preparationTime}
                    onChange={(e) => setProduct({ ...product, preparationTime: e.target.value })}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookingInstructions">Instructions de cuisson</Label>
                  <Textarea
                    value={product.cookingInstructions}
                    onChange={(e) => setProduct({ ...product, cookingInstructions: e.target.value })}
                    placeholder="Instructions de cuisson"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ingredients">Ingrédients</Label>
                  <Textarea
                    value={product.ingredients}
                    onChange={(e) => setProduct({ ...product, ingredients: e.target.value })}
                    placeholder="Liste des ingrédients"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">Titre SEO (pour le référencement Google)</Label>
                  <Input
                    value={product.seoTitle}
                    onChange={(e) => setProduct({ ...product, seoTitle: e.target.value })}
                    maxLength={70}
                    placeholder="Titre pour les moteurs de recherche"
                  />
                  <p className="text-sm text-gray-500">(Ce titre apparaîtra dans les résultats de recherche Google)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">Description SEO (résumé pour Google)</Label>
                  <Textarea
                    value={product.seoDescription}
                    onChange={(e) => setProduct({ ...product, seoDescription: e.target.value })}
                    maxLength={160}
                    placeholder="Description pour les moteurs de recherche"
                  />
                  <p className="text-sm text-gray-500">(Cette description apparaîtra sous le titre dans les résultats de recherche)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">Mots-clés SEO</Label>
                  <Input
                    value={product.seoKeywords}
                    onChange={(e) => setProduct({ ...product, seoKeywords: e.target.value })}
                    placeholder="Séparés par des virgules"
                  />
                  <p className="text-sm text-gray-500">(Mots-clés pour améliorer la visibilité dans les recherches)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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