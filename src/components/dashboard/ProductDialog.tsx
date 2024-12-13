"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ImagePlus, Link, X } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProductDialog({ open, onOpenChange, onSuccess }: ProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append('images', JSON.stringify(images));

      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/seller/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Erreur lors de la création du produit');

      toast({
        title: "Succès",
        description: "Produit ajouté avec succès",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              <Input id="name" name="name" required />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>

            <div>
              <Label htmlFor="price">Prix</Label>
              <Input id="price" name="price" type="number" min="0" step="0.01" required />
            </div>

            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" min="0" required />
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

              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
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