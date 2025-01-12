"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useDropzone } from 'react-dropzone';
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface NutritionalInfo {
  calories: number | null;
  proteins: number | null;
  carbohydrates: number | null;
  fats: number | null;
  fiber: number | null;
  sodium: number | null;
  allergens: string[];
  servingSize: string | null;
}

interface Temperature {
  min: number | null;
  max: number | null;
  unit: '°C' | '°F';
}

interface Packaging {
  type: string | null;
  material: string | null;
  weight: number | null;
  units: string | null;
}

interface ProductFormData {
  // Basic info
  name: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  quantity: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  featured: boolean;
  
  // Food info
  nutritionalInfo: NutritionalInfo;
  temperature: Temperature;
  packaging: Packaging;
  productType: string;
  storageConditions: string;
  expirationDate: string;
  shelfLife: string;
  origin: string;
  certifications: string;
  preparationTime: string;
  cookingInstructions: string;
  ingredients: string;
  
  // Shipping info
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  
  // SEO info
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

interface FormDataEntry {
  [key: string]: string | Blob | null | undefined;
}

const { BASE_URL } = API_CONFIG;

// Constante pour l'image par défaut
const DEFAULT_IMAGE = '/placeholder.jpg';

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string | string[]) => {
  if (!imagePath) return DEFAULT_IMAGE;
  
  try {
    // Si c'est un tableau, prendre la première image
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!path) return DEFAULT_IMAGE;
  
    // Si c'est déjà une URL complète
    if (path.startsWith('http')) {
      return path;
    }
  
    // Si le chemin commence par 'uploads'
    if (path.startsWith('uploads')) {
      return `${BASE_URL}/${path}`;
    }

    // Pour tout autre cas
    return `${BASE_URL}/uploads/products/${path.replace(/^\/+/, '')}`;
  } catch (error) {
    console.error('Erreur dans getImageUrl:', error);
    return DEFAULT_IMAGE;
  }
};

interface PageParams {
  productId: string;
}

export default function EditProductPage({ params }: { params: PageParams }) {
  const productId = params.productId;
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  
  const [formData, setFormData] = useState<ProductFormData>({
    // Basic info
    name: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    quantity: '',
    categoryId: '',
    description: '',
    shortDescription: '',
    featured: false,

    // Food info
    nutritionalInfo: {
      calories: null,
      proteins: null,
      carbohydrates: null,
      fats: null,
      fiber: null,
      sodium: null,
      allergens: [],
      servingSize: null
    },
    temperature: {
      min: null,
      max: null,
      unit: '°C'
    },
    packaging: {
      type: null,
      material: null,
      weight: null,
      units: null
    },
    productType: '',
    storageConditions: '',
    expirationDate: '',
    shelfLife: '',
    origin: '',
    certifications: '',
    preparationTime: '',
    cookingInstructions: '',
    ingredients: '',
    
    // Shipping info
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    
    // SEO info
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getCookie('token');
        const response = await axios.get(`${API_CONFIG.BASE_URL}/api/seller/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };

    const fetchProduct = async () => {
      try {
        const token = getCookie('token');
        console.log("Fetching product with ID:", productId);
        const response = await axios.get(`${API_CONFIG.BASE_URL}/api/seller/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const productData = response.data.data;
          console.log("Product data received:", productData); // Debug log
          setFormData({
            name: productData.name || '',
            sku: productData.sku || '',
            price: productData.price?.toString() || '',
            compareAtPrice: productData.compareAtPrice?.toString() || '',
            quantity: productData.stock?.toString() || '',
            categoryId: productData.categoryId || '',
            description: productData.description || '',
            shortDescription: productData.shortDescription || '',
            featured: productData.featured || false,
            nutritionalInfo: productData.nutritionalInfo || {
              calories: null,
              proteins: null,
              carbohydrates: null,
              fats: null,
              fiber: null,
              sodium: null,
              allergens: [],
              servingSize: null
            },
            temperature: productData.temperature || {
              min: null,
              max: null,
              unit: '°C'
            },
            packaging: productData.packaging || {
              type: null,
              material: null,
              weight: null,
              units: null
            },
            productType: productData.productType || '',
            storageConditions: productData.storageConditions || '',
            expirationDate: productData.expirationDate || '',
            shelfLife: productData.shelfLife || '',
            origin: productData.origin || '',
            certifications: productData.certifications || '',
            preparationTime: productData.preparationTime || '',
            cookingInstructions: productData.cookingInstructions || '',
            ingredients: productData.ingredients || '',
            weight: productData.weight?.toString() || '',
            dimensions: {
              length: productData.dimensions?.length?.toString() || '',
              width: productData.dimensions?.width?.toString() || '',
              height: productData.dimensions?.height?.toString() || ''
            },
            seoTitle: productData.seoTitle || '',
            seoDescription: productData.seoDescription || '',
            seoKeywords: productData.seoKeywords || ''
          });

          // Debug log pour les images
          console.log("Images from API:", productData.images);

          if (productData.images && Array.isArray(productData.images)) {
            const urls = productData.images.map((image: string) => {
              console.log("Processing image:", image); // Debug log
              return getImageUrl(image);
            });
            console.log("Processed image URLs:", urls); // Debug log
            setImageUrls(urls);
          }

          if (productData.video) {
            setVideoUrl(productData.video.startsWith('http') 
              ? productData.video 
              : `${API_CONFIG.BASE_URL}/uploads/products/${productData.video}`
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du produit:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du produit",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
    fetchProduct();
  }, [productId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNutritionalInfoChange = (field: keyof NutritionalInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        [field]: value
      }
    }));
  };

  const handleTemperatureChange = (field: keyof Temperature, value: any) => {
    setFormData(prev => ({
      ...prev,
      temperature: {
        ...prev.temperature,
        [field]: value
      }
    }));
  };

  const handlePackagingChange = (field: keyof Packaging, value: any) => {
    setFormData(prev => ({
      ...prev,
      packaging: {
        ...prev.packaging,
        [field]: value
      }
    }));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour modifier un produit",
          variant: "destructive"
        });
        return;
      }

      const formDataToSend = new FormData();

      // Ajouter les données de base
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'dimensions') {
          const dimensions = {
            length: Number(value.length) || null,
            width: Number(value.width) || null,
            height: Number(value.height) || null,
            unit: 'cm'
          };
          formDataToSend.append('dimensions', JSON.stringify(dimensions));
        } else if (key === 'temperature') {
          const temperature = {
            min: Number(value.min) || 0,
            max: Number(value.max) || 25,
            unit: '°C'
          };
          formDataToSend.append('temperature', JSON.stringify(temperature));
        } else if (key === 'nutritionalInfo') {
          // Ensure allergens is always an array
          const allergens = Array.isArray(value.allergens) 
            ? value.allergens 
            : typeof value.allergens === 'string'
              ? value.allergens.split(',').map(function(a: string) { return a.trim(); }).filter(Boolean)
              : [];

          const nutritionalInfo = {
            calories: Number(value.calories) || null,
            proteins: Number(value.proteins) || null,
            carbohydrates: Number(value.carbohydrates) || null,
            fats: Number(value.fats) || null,
            fiber: Number(value.fiber) || null,
            sodium: Number(value.sodium) || null,
            allergens: allergens,
            servingSize: value.servingSize || '100g'
          };
          formDataToSend.append('nutritionalInfo', JSON.stringify(nutritionalInfo));
        } else {
          formDataToSend.append(key, value?.toString() || '');
        }
      });

      // Ajouter les images sélectionnées
      selectedImages.forEach((image) => {
        formDataToSend.append('images', image);
      });

      // Ajouter la vidéo si elle existe
      if (videoFile) {
        formDataToSend.append('video', videoFile);
      }

      console.log('Données envoyées:', {
        nutritionalInfo: JSON.parse(formDataToSend.get('nutritionalInfo') as string),
        dimensions: JSON.parse(formDataToSend.get('dimensions') as string),
        temperature: JSON.parse(formDataToSend.get('temperature') as string)
      });

      const response = await fetch(`${BASE_URL}/api/products/update-product/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      toast({
        title: "Succès",
        description: "Produit modifié avec succès",
      });

      router.push('/seller/dashboard/products');
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la modification du produit",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Modifier le produit</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/seller/dashboard/products')}
        >
          Retour
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList>
            <TabsTrigger value="basic">Informations de base</TabsTrigger>
            <TabsTrigger value="food">Informations alimentaires</TabsTrigger>
            <TabsTrigger value="shipping">Expédition</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="media">Médias</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Nom du produit</Label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label>SKU</Label>
                      <Input
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Prix (FCFA)</Label>
                      <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label>Prix comparé (FCFA)</Label>
                      <Input
                        name="compareAtPrice"
                        type="number"
                        value={formData.compareAtPrice}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Quantité en stock</Label>
                      <Input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label>Catégorie</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
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

                    <div>
                      <Label>Description courte</Label>
                      <Textarea
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Description complète</Label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                      />
                      <Label>Produit en vedette</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="food">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations nutritionnelles */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations nutritionnelles</h3>
                    
                    <div>
                      <Label>Calories</Label>
                      <Input
                        type="number"
                        value={formData.nutritionalInfo.calories || ''}
                        onChange={(e) => handleNutritionalInfoChange('calories', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Protéines (g)</Label>
                      <Input
                        type="number"
                        value={formData.nutritionalInfo.proteins || ''}
                        onChange={(e) => handleNutritionalInfoChange('proteins', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Glucides (g)</Label>
                      <Input
                        type="number"
                        value={formData.nutritionalInfo.carbohydrates || ''}
                        onChange={(e) => handleNutritionalInfoChange('carbohydrates', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Lipides (g)</Label>
                      <Input
                        type="number"
                        value={formData.nutritionalInfo.fats || ''}
                        onChange={(e) => handleNutritionalInfoChange('fats', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Fibres (g)</Label>
                      <Input
                        type="number"
                        value={formData.nutritionalInfo.fiber || ''}
                        onChange={(e) => handleNutritionalInfoChange('fiber', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Sodium (mg)</Label>
                      <Input
                        type="number"
                        value={formData.nutritionalInfo.sodium || ''}
                        onChange={(e) => handleNutritionalInfoChange('sodium', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Portion (g)</Label>
                      <Input
                        type="text"
                        value={formData.nutritionalInfo.servingSize || ''}
                        onChange={(e) => handleNutritionalInfoChange('servingSize', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Allergènes</Label>
                      <Input
                        type="text"
                        value={formData.nutritionalInfo.allergens.join(', ')}
                        onChange={(e) => handleNutritionalInfoChange('allergens', e.target.value.split(',').map(item => item.trim()))}
                        placeholder="Séparez les allergènes par des virgules"
                      />
                    </div>
                  </div>

                  {/* Autres informations alimentaires */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Autres informations</h3>
                    
                    <div>
                      <Label>Température de conservation</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Min (°C)</Label>
                          <Input
                            type="number"
                            value={formData.temperature.min || ''}
                            onChange={(e) => handleTemperatureChange('min', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Max (°C)</Label>
                          <Input
                            type="number"
                            value={formData.temperature.max || ''}
                            onChange={(e) => handleTemperatureChange('max', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Type de produit</Label>
                      <Input
                        name="productType"
                        value={formData.productType}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Conditions de stockage</Label>
                      <Textarea
                        name="storageConditions"
                        value={formData.storageConditions}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Date d'expiration</Label>
                      <Input
                        type="date"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Durée de conservation (jours)</Label>
                      <Input
                        type="number"
                        name="shelfLife"
                        value={formData.shelfLife}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Origine</Label>
                      <Input
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Certifications</Label>
                      <Input
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleInputChange}
                        placeholder="Séparez les certifications par des virgules"
                      />
                    </div>

                    <div>
                      <Label>Temps de préparation (minutes)</Label>
                      <Input
                        type="number"
                        name="preparationTime"
                        value={formData.preparationTime}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Instructions de cuisson</Label>
                      <Textarea
                        name="cookingInstructions"
                        value={formData.cookingInstructions}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Ingrédients</Label>
                      <Textarea
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleInputChange}
                        placeholder="Séparez les ingrédients par des virgules"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Poids (kg)</Label>
                      <Input
                        name="weight"
                        type="number"
                        value={formData.weight}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label>Dimensions</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Longueur"
                          value={formData.dimensions.length}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dimensions: { ...prev.dimensions, length: e.target.value }
                          }))}
                        />
                        <Input
                          placeholder="Largeur"
                          value={formData.dimensions.width}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dimensions: { ...prev.dimensions, width: e.target.value }
                          }))}
                        />
                        <Input
                          placeholder="Hauteur"
                          value={formData.dimensions.height}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            dimensions: { ...prev.dimensions, height: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label>Titre SEO</Label>
                    <Input
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label>Description SEO</Label>
                    <Textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label>Mots-clés SEO</Label>
                    <Input
                      name="seoKeywords"
                      value={formData.seoKeywords}
                      onChange={handleInputChange}
                      placeholder="Séparez les mots-clés par des virgules"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label>Images du produit</Label>
                    <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 mt-2 text-center cursor-pointer">
                      <input {...getInputProps()} />
                      <p>Glissez et déposez des images ici, ou cliquez pour sélectionner</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                            <img
                            src={url}
                            alt={`Image ${index + 1}`}
                              className="w-[100px] h-[100px] object-cover rounded-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = DEFAULT_IMAGE;
                              console.log("Image error, using default:", DEFAULT_IMAGE); // Debug log
                              }}
                            />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImageUrl(index)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      ))}
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                            <img
                            src={URL.createObjectURL(file)}
                            alt={`Nouvelle image ${index + 1}`}
                              className="w-[100px] h-[100px] object-cover rounded-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = DEFAULT_IMAGE;
                              console.log("New image error, using default:", DEFAULT_IMAGE); // Debug log
                              }}
                            />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Vidéo du produit</Label>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="mt-2"
                    />
                    {videoUrl && (
                      <video
                        src={videoUrl}
                        controls
                        className="mt-4 rounded-lg"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/seller/dashboard/products')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              'Mettre à jour le produit'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 