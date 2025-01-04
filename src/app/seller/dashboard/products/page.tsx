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
import { getApiUrl } from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';

const BASE_URL = `${getApiUrl()}/api`;

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  category: string;
  images: string[];
}

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [_categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [_selectedProducts, _setSelectedProducts] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/seller/products`);
      if (!response.ok) throw new Error("Erreur lors du chargement des produits");
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const _fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/seller/products/categories`);
      if (!response.ok) throw new Error("Erreur lors du chargement des catégories");
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkUpdate = async (updates: Partial<Product>[]) => {
    try {
      const response = await fetch(`${BASE_URL}/seller/products/bulk-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updates })
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      toast({
        title: "Succès",
        description: "Produits mis à jour avec succès",
      });

      fetchProducts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les produits",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    await handleBulkUpdate([{ id: productId, status: newStatus }]);
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    await handleBulkUpdate([{ id: productId, stock: newStock }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Link href="/seller/dashboard/products/new">
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
              {products.filter(p => p.stock <= 5).length}
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
                      Chargement...
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
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="object-cover"
                          />
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{product.price} FCFA</td>
                      <td className="p-4">
                        <Input
                          type="number"
                          value={product.stock}
                          onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                          className="w-20"
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
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
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


