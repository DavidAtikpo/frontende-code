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
// import Image from 'next/image';
import Link from 'next/link';
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import axios from 'axios';

const { BASE_URL } = API_CONFIG;

// Constante pour l'image par défaut (utiliser une URL statique)
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string | string[]) => {
  if (!imagePath) return DEFAULT_IMAGE;
  
  try {
    // Si c'est un tableau, prendre la première image
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!path) return DEFAULT_IMAGE;

    // Si c'est déjà une URL complète (http ou https)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Nettoyer le chemin de l'image
    const cleanPath = path.replace(/^\/+/, '').replace(/\\/g, '/');

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

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  categoryId: string;
  subcategoryId: string;
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
  images: string[];
  description?: string;
  createdAt: string;
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

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filter, setFilter] = useState({ status: 'all', category: 'all', subcategory: 'all' });

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
      console.log('Fetching products with filters:', filter);
      
      const response = await axios.get(API_CONFIG.getFullUrl('/seller/products'), {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          status: filter.status === 'all' ? undefined : filter.status,
          categoryId: filter.category === 'all' ? undefined : filter.category,
          subcategoryId: filter.subcategory === 'all' ? undefined : filter.subcategory
        }
      });

      console.log('Products API Response:', {
        status: response.status,
        success: response.data.success,
        productsCount: response.data.data?.products?.length || 0,
        filters: filter
      });

      if (response.data.success) {
        const productsData = response.data.data?.products || [];
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

  const fetchSubcategories = async (categoryId?: string) => {
    const token = getCookie('token');
    if (!token) return;

    try {
      if (!categoryId || categoryId === 'all') {
        setSubcategories([]);
        return;
      }

      const url = API_CONFIG.getFullUrl(`/seller/subcategories/${categoryId}`);
      console.log('Fetching subcategories for category:', categoryId);
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        console.log('Subcategories loaded:', response.data.data);
        setSubcategories(response.data.data);
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des sous-catégories:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les sous-catégories",
        variant: "destructive",
      });
    }
  };

  // Charger les sous-catégories quand la catégorie change
  useEffect(() => {
    if (filter.category !== 'all') {
      fetchSubcategories(filter.category);
    } else {
      setSubcategories([]); // Vider les sous-catégories quand aucune catégorie n'est sélectionnée
    }
  }, [filter.category]);

  // Dans la partie du rendu, ajoutons un log pour voir les sous-catégories disponibles
  useEffect(() => {
    console.log('Current subcategories:', subcategories);
  }, [subcategories]);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col md:flex-row gap-2">
            <Select
              value={filter.status}
              onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-full md:w-[150px]">
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
              onValueChange={(value) => {
                setFilter(prev => ({ ...prev, category: value, subcategory: 'all' }));
              }}
            >
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {filter.category !== 'all' && (
              <Select
                value={filter.subcategory}
                onValueChange={(value) => setFilter(prev => ({ ...prev, subcategory: value }))}
              >
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Sous-catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {subcategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Link href="/seller/dashboard/products/add" className="w-full md:w-auto">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau produit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-1 px-2">
            <CardTitle className="text-xs text-muted-foreground">
              Total Produits
            </CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-2">
            <div className="text-base font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-1 px-2">
            <CardTitle className="text-xs text-muted-foreground">
              Stock Faible
            </CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-2">
            <div className="text-base font-bold text-yellow-600">
              {products.filter(p => p.quantity <= 5).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-1 px-2">
            <CardTitle className="text-xs text-muted-foreground">
              Produits Actifs
            </CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-2">
            <div className="text-base font-bold text-green-600">
              {products.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">Produit</th>
                  <th className="p-4 text-left hidden md:table-cell">Catégorie</th>
                  <th className="p-4 text-left hidden md:table-cell">Sous-catégorie</th>
                  <th className="p-4 text-left">Prix</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Statut</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      Aucun produit trouvé
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] && (
                            <div className="relative w-[60px] md:w-[100px] h-[60px] md:h-[100px]">
                              <img
                                src={getImageUrl(product.images)}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  console.error(`Erreur de chargement de l'image: ${target.src}`);
                                  if (target.src !== DEFAULT_IMAGE) {
                                    target.src = DEFAULT_IMAGE;
                                  }
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground hidden md:block">
                              {/* {product.description?.slice(0, 50)}... */}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {categories.find(cat => cat.id === product.categoryId)?.name || 'Non catégorisé'}
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {subcategories.find(sub => sub.id === product.subcategoryId)?.name || 'Non spécifié'}
                      </td>
                      <td className="p-4">{product.price.toLocaleString()} FCFA</td>
                      <td className="p-4">
                        <Input
                          type="number"
                          defaultValue={product.quantity}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value);
                            if (!isNaN(newValue) && newValue >= 0) {
                              handleStockUpdate(product.id, newValue);
                            }
                          }}
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


