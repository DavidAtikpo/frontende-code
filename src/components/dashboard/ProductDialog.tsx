"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ImagePlus, Link, X, Video } from "lucide-react";
import { API_CONFIG } from "@/utils/config";

const { BASE_URL } = API_CONFIG;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProductDialog({ open, onOpenChange, onSuccess }: ProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const { toast } = useToast();
  const [showDiscount, setShowDiscount] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    images: [],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Vérifier chaque fichier
      const validFiles = Array.from(files).filter(file => {
        // Vérifier la taille (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "Erreur",
            description: `Le fichier ${file.name} est trop volumineux. Maximum 10MB`,
            variant: "destructive",
          });
          return false;
        }
        // Vérifier le type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Erreur",
            description: `Le fichier ${file.name} n'est pas une image`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });

      // Traiter les fichiers valides
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleImageUrlAdd = () => {
    if (imageUrl) {
      setImages(prev => [...prev, imageUrl]);
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La vidéo ne doit pas dépasser 50MB",
          variant: "destructive",
        });
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Erreur",
          description: "Le fichier doit être une vidéo",
          variant: "destructive",
        });
        return;
      }

      setVideo(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Process images
      await Promise.all(images.map(async (image, index) => {
        if (image.startsWith('http')) {
          formDataToSend.append(`imageUrls[${index}]`, image);
        } else {
          const blob = await fetch(image).then(r => r.blob());
          formDataToSend.append(`images`, blob, `image-${index}.jpg`);
        }
      }));

      // Ajouter la vidéo si elle existe
      if (video) {
        formDataToSend.append('video', video);
      }

      // Ajouter les autres données
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount: showDiscount ? {
          percentage: Number(formData.discount?.percentage),
          startDate: formData.discount?.startDate,
          endDate: formData.discount?.endDate,
        } : undefined,
        metadata: showMetadata ? {
          keywords: formData.metadata?.keywords || [],
          brand: formData.metadata?.brand,
          weight: Number(formData.metadata?.weight),
          dimensions: {
            length: Number(formData.metadata?.dimensions?.length),
            width: Number(formData.metadata?.dimensions?.width),
            height: Number(formData.metadata?.dimensions?.height),
          },
        } : undefined,
      };

      formDataToSend.append('data', JSON.stringify(productData));

      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du produit');
      }

      toast({
        title: "Succès",
        description: "Le produit a été créé avec succès",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'keywords') {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          keywords: value.split(',').map(k => k.trim())
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
          <DialogTitle>Ajouter un produit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
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
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label>Images</Label>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Uploader des images
                  </Button>
                </div>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="URL de l'image"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button type="button" onClick={handleImageUrlAdd}>
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {images.map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-full h-48"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alimentaire">Alimentaire</SelectItem>
                  <SelectItem value="Électronique">Électronique</SelectItem>
                  <SelectItem value="Mode">Mode</SelectItem>
                  <SelectItem value="Maison">Maison</SelectItem>
                  <SelectItem value="Beauté">Beauté</SelectItem>
                  <SelectItem value="Sport">Sport</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subCategory">Sous-catégorie</Label>
              <Input
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Promotion</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDiscount(!showDiscount)}
                >
                  {showDiscount ? "Masquer" : "Ajouter une promotion"}
                </Button>
              </div>
              
              {showDiscount && (
                <div className="space-y-4 p-4 border rounded">
                  <div>
                    <Label htmlFor="discountPercentage">Pourcentage de réduction</Label>
                    <Input
                      id="discountPercentage"
                      name="discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount?.percentage}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discountStart">Date de début</Label>
                      <Input
                        id="discountStart"
                        name="discountStart"
                        type="date"
                        value={formData.discount?.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountEnd">Date de fin</Label>
                      <Input
                        id="discountEnd"
                        name="discountEnd"
                        type="date"
                        value={formData.discount?.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Métadonnées</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMetadata(!showMetadata)}
                >
                  {showMetadata ? "Masquer" : "Ajouter des métadonnées"}
                </Button>
              </div>
              
              {showMetadata && (
                <div className="space-y-4 p-4 border rounded">
                  <div>
                    <Label htmlFor="keywords">Mots-clés (séparés par des virgules)</Label>
                    <Input
                      id="keywords"
                      name="keywords"
                      value={formData.metadata?.keywords?.join(',') || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Marque</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.metadata?.brand}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Poids (kg)</Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        step="0.01"
                        value={formData.metadata?.weight}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>Dimensions (cm)</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="L"
                          name="length"
                          type="number"
                          value={formData.metadata?.dimensions?.length}
                          onChange={handleInputChange}
                        />
                        <Input
                          placeholder="l"
                          name="width"
                          type="number"
                          value={formData.metadata?.dimensions?.width}
                          onChange={handleInputChange}
                        />
                        <Input
                          placeholder="H"
                          name="height"
                          type="number"
                          value={formData.metadata?.dimensions?.height}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label>Vidéo du produit (max 50MB)</Label>
              <div className="flex gap-4">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('video-upload')?.click()}
                >
                  <Video className="mr-2 h-4 w-4" />
                  {video ? "Changer la vidéo" : "Ajouter une vidéo"}
                </Button>
              </div>

              {videoPreview && (
                <div className="relative">
                  <video
                    src={videoPreview}
                    className="w-full h-48 object-cover rounded"
                    controls
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeVideo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 sticky bottom-0 bg-white pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer le produit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 