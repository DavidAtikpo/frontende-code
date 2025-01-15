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
import { ArrowLeft, Loader2 } from "lucide-react";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  categoryId: string;
  subcategoryId: string;
  images: string[];
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

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

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
          setProduct(response.data.data);
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

    try {
      const response = await axios.put(
        API_CONFIG.getFullUrl(`/seller/products/${id}`),
        product,
        {
          headers: { Authorization: `Bearer ${token}` }
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
                  <label className="text-sm font-medium">Nom du produit</label>
                  <Input
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Prix (FCFA)</label>
                  <Input
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Quantité en stock</label>
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Catégorie</label>
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

                {product.categoryId && (
                  <div>
                    <label className="text-sm font-medium">Sous-catégorie</label>
                    <Select
                      value={product.subcategoryId}
                      onValueChange={(value) => setProduct({ ...product, subcategoryId: value })}
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
                  <label className="text-sm font-medium">Statut</label>
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