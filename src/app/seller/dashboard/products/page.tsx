"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Filter, Download, Edit, Trash } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import axios from 'axios';

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

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  category: string;
  images: string[];
  description?: string;
  createdAt: string;
}

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filter, setFilter] = useState({ status: 'all', category: 'all' });

  const fetchProducts = useCallback(async () => {
    const token = getCookie('token');
    if (!token) {
      setIsLoading(false);
      console.log('No token found');
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Fetching products with token:', token?.slice(0, 20) + '...');
      console.log('Current filters:', filter);
      
      const response = await axios.get(API_CONFIG.getFullUrl('/seller/products'), {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          status: filter.status === 'all' ? undefined : filter.status,
          category: filter.category === 'all' ? undefined : filter.category
        }
      });

      console.log('Products API Response:', {
        status: response.status,
        success: response.data.success,
        productsCount: response.data.data?.products?.length || 0,
        data: response.data
      });

      if (response.data.success) {
        const productsData = response.data.data?.products || [];
        console.log('Setting products:', productsData);
        setProducts(productsData);
      } else {
        console.error('API returned success: false', response.data);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erreur détaillée lors du chargement des produits:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de charger les produits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, filter]);

  useEffect(() => {
    const token = getCookie('token');
    console.log('UseEffect triggered with token:', token);
    fetchProducts();
  }, [fetchProducts]);

  const fetchCategories = async () => {
    const token = getCookie('token');
    if (!token) return;

    try {
      const response = await axios.get(API_CONFIG.getFullUrl('/seller/categories'), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleStatusChange = async (productId: string, newStatus: string) => {
    const token = getCookie('token');
    if (!token) return;

    try {
      const response = await axios.put(
        API_CONFIG.getFullUrl(`/seller/products/${productId}`),
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
      toast({
        title: "Succès",
          description: "Statut du produit mis à jour",
      });
      fetchProducts();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    const token = getCookie('token');
    if (!token) return;

    try {
      const response = await axios.put(
        API_CONFIG.getFullUrl(`/seller/products/${productId}`),
        { stock: newStock },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast({
          title: "Succès",
          description: "Stock mis à jour",
        });
        fetchProducts();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du stock:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le stock",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const token = getCookie('token');
    if (!token) return;

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      const response = await axios.delete(
        API_CONFIG.getFullUrl(`/seller/products/${productId}`),
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast({
          title: "Succès",
          description: "Produit supprimé avec succès",
        });
        fetchProducts();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <Select
              value={filter.status}
              onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="outofstock">Rupture</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.category}
              onValueChange={(value) => setFilter(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {Array.isArray(categories) && categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Link href="/seller/dashboard/products/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau produit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock Faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.quantity <= 5).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produits Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">Produit</th>
                  <th className="p-4 text-left">Catégorie</th>
                  <th className="p-4 text-left">Prix</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Statut</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      Aucun produit trouvé
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] && (
                            <img
                              src={getImageUrl(product.images)}
                              alt={product.name}
                              className="w-[100px] h-[100px] object-cover rounded-md"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = DEFAULT_IMAGE;
                              }}
                            />
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.description?.slice(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{product.price.toLocaleString()} FCFA</td>
                      <td className="p-4">
                        <Input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                          className="w-20"
                          min="0"
                        />
                      </td>
                      <td className="p-4">
                        <Select
                          value={product.status}
                          onValueChange={(value) => handleStatusChange(product.id, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                            <SelectItem value="outofstock">Rupture</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link href={`/seller/dashboard/products/${product.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


