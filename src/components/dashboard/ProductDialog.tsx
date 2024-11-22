"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { X, Upload } from "lucide-react";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editProduct?: Product;
}

export function ProductDialog({ open, onOpenChange, onSuccess, editProduct }: ProductDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: editProduct?.name || "",
    description: editProduct?.description || "",
    price: editProduct?.price?.toString() || "",
    category: editProduct?.category || "",
    stock: editProduct?.stock?.toString() || "",
    images: [] as File[],
    status: editProduct?.status || "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "Électronique",
    "Mode",
    "Maison",
    "Beauté",
    "Alimentation",
    "Services",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProductData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index: number) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!productData.name) newErrors.name = "Le nom est requis";
    if (!productData.description) newErrors.description = "La description est requise";
    if (!productData.price) newErrors.price = "Le prix est requis";
    if (!productData.category) newErrors.category = "La catégorie est requise";
    if (!productData.stock) newErrors.stock = "Le stock est requis";
    if (!editProduct && productData.images.length === 0) {
      newErrors.images = "Au moins une image est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key === "images") {
        productData.images.forEach((image) => {
          formData.append("images", image);
        });
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch(
        editProduct ? `/api/seller/products/${editProduct.id}` : "/api/seller/products",
        {
          method: editProduct ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error();

      toast({
        title: "Succès",
        description: editProduct 
          ? "Produit mis à jour avec succès"
          : "Produit ajouté avec succès",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editProduct ? "Modifier le produit" : "Ajouter un produit"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champs du formulaire */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={productData.category}
                onValueChange={(value) => setProductData({ ...productData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={productData.stock}
                onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
              />
              {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex gap-4 flex-wrap">
              {productData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Product ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Upload className="h-6 w-6 text-gray-400" />
              </label>
            </div>
            {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#1D4ED8] hover:bg-[#1e40af]"
              disabled={isLoading}
            >
              {isLoading
                ? "Enregistrement..."
                : editProduct
                ? "Mettre à jour"
                : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 