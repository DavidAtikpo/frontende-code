'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface NutritionalInfo {
  calories: number | null;
  proteins: number | null;
  carbohydrates: number | null;
  fats: number | null;
  fiber: number | null;
  sodium: number | null;
  servingSize: string | null;
}

interface ProductFormData {
  // Basic info
  name: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  quantity: string;
  categoryId: string;
  subcategoryId: string;
  description: string;
  shortDescription: string;
  featured: boolean;
  
  // Food info
  nutritionalInfo: NutritionalInfo;
  productType: string;
  origin: string;
  certifications: string;
  preparationTime: string;
  cookingInstructions: string;
  ingredients: string;
  
  // SEO info
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export default function AddProduct() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
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
    subcategoryId: '',
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
      servingSize: null
    },
    productType: '',
    origin: '',
    certifications: '',
    preparationTime: '',
    cookingInstructions: '',
    ingredients: '',
    
    // SEO info
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  // Ajout du chargement des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/seller/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des catégories');
        }

        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les catégories",
          variant: "destructive"
        });
      }
    };

    fetchCategories();
  }, [toast]);

  // Chargement des sous-catégories quand une catégorie est sélectionnée
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!formData.categoryId) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/seller/subcategories/${formData.categoryId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des sous-catégories');
        }

        const data = await response.json();
        setSubcategories(data.data);
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les sous-catégories",
          variant: "destructive"
        });
      }
    };

    fetchSubcategories();
  }, [formData.categoryId, toast]);

  // Génération automatique du SKU basé sur le nom du produit
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => {
      // Générer un SKU basé sur le nom (3 premières lettres en majuscules + timestamp)
      const skuPrefix = name.slice(0, 3).toUpperCase();
      const timestamp = Date.now().toString().slice(-4);
      const newSku = `${skuPrefix}-${timestamp}`;
      
      return {
        ...prev,
        name,
        sku: newSku,
        // Générer automatiquement les champs SEO
        seoTitle: name,
        seoDescription: `Découvrez ${name} - Un produit de qualité disponible dans notre boutique.`,
        seoKeywords: name.toLowerCase().split(' ').join(',')
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNutritionalInfoChange = (field: keyof NutritionalInfo, value: any) => {
    if (field === 'calories' || field === 'proteins' || field === 'carbohydrates' || 
        field === 'fats' || field === 'fiber' || field === 'sodium' || field === 'servingSize') {
      setFormData(prev => ({
        ...prev,
        nutritionalInfo: {
          ...prev.nutritionalInfo,
          [field]: value
        }
      }));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter un produit",
          variant: "destructive"
        });
        return;
      }

      const submitData = new FormData();
      
      // Ajouter les données de base
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString());
      });

      // Ajouter les images sélectionnées
      selectedImages.forEach((image) => {
        submitData.append('images', image);
      });

      // Ajouter les URLs d'images
      if (imageUrls.length > 0) {
        submitData.append('imageUrls', JSON.stringify(imageUrls));
      }

      // Ajouter la vidéo
      if (videoFile) {
        submitData.append('video', videoFile);
      } else if (videoUrl) {
        submitData.append('videoUrl', videoUrl);
      }

      // Ajouter les informations nutritionnelles
      submitData.append('nutritionalInfo', JSON.stringify(formData.nutritionalInfo));



      const response = await fetch(`${BASE_URL}/api/products/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      toast({
        title: "Succès",
        description: "Produit ajouté avec succès",
      });

      router.push('/seller/dashboard/products');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'ajout du produit",
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
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ajouter un produit</h1>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Publier le produit
          </Button>
        </div>

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
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="Nom du produit"
                    required
                  />
                  <p className="text-sm text-gray-500">(Le SKU sera généré automatiquement à partir du nom)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Identifiant unique du produit)</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    readOnly
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500">(Généré automatiquement: 3 premières lettres du nom + numéro unique)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Prix</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Prix de comparaison</Label>
                  <Input
                    id="compareAtPrice"
                    name="compareAtPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantité en stock</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Catégorie</Label>
                  <Select 
                    name="categoryId" 
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value, subcategoryId: '' }))}
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
                    name="subcategoryId" 
                    value={formData.subcategoryId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, subcategoryId: value }))}
                    disabled={!formData.categoryId || subcategories.length === 0}
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
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description du produit"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Description courte</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Description courte du produit"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="featured" 
                  name="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
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

              <div className="space-y-2">
                <Label htmlFor="imageUrls">URLs d'images</Label>
                <div className="flex space-x-2">
                  <Input
                    type="url"
                    placeholder="https://"
                    value={imageUrls.join('\n')}
                    onChange={(e) => setImageUrls(e.target.value.split('\n').filter(url => url.trim()))}
                  />
                </div>
              </div>

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
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
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
                  <Select name="productType" defaultValue="frais">
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
                    name="origin"
                    placeholder="Pays/Région d'origine"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Informations nutritionnelles</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Calories</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.nutritionalInfo.calories || ''}
                      onChange={(e) => handleNutritionalInfoChange('calories', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Protéines (g)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.nutritionalInfo.proteins || ''}
                      onChange={(e) => handleNutritionalInfoChange('proteins', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Glucides (g)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.nutritionalInfo.carbohydrates || ''}
                      onChange={(e) => handleNutritionalInfoChange('carbohydrates', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lipides (g)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.nutritionalInfo.fats || ''}
                      onChange={(e) => handleNutritionalInfoChange('fats', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fibres (g)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.nutritionalInfo.fiber || ''}
                      onChange={(e) => handleNutritionalInfoChange('fiber', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sodium (mg)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.nutritionalInfo.sodium || ''}
                      onChange={(e) => handleNutritionalInfoChange('sodium', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Portion</Label>
                  <Input
                    placeholder="Ex: 100g"
                    value={formData.nutritionalInfo.servingSize || ''}
                    onChange={(e) => handleNutritionalInfoChange('servingSize', e.target.value || null)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Input
                  name="certifications"
                  placeholder="Séparées par des virgules"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preparationTime">Temps de préparation (minutes)</Label>
                <Input
                  type="number"
                  name="preparationTime"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cookingInstructions">Instructions de cuisson</Label>
                <Textarea
                  name="cookingInstructions"
                  placeholder="Instructions de cuisson"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingrédients</Label>
                <Textarea
                  name="ingredients"
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
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  maxLength={70}
                  placeholder="Titre pour les moteurs de recherche"
                />
                <p className="text-sm text-gray-500">(Ce titre apparaîtra dans les résultats de recherche Google)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">Description SEO (résumé pour Google)</Label>
                <Textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  maxLength={160}
                  placeholder="Description pour les moteurs de recherche"
                />
                <p className="text-sm text-gray-500">(Cette description apparaîtra sous le titre dans les résultats de recherche)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">Mots-clés SEO</Label>
                <Input
                  name="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={handleInputChange}
                  placeholder="Séparés par des virgules"
                />
                <p className="text-sm text-gray-500">(Mots-clés pour améliorer la visibilité dans les recherches)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
} 