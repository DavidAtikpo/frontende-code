"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";
import { 
  X, 
  AlertTriangle,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import Image from "next/image";
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'pending' | 'active' | 'rejected';
  images: string[];
  category: string;
  seller: {
    id: string;
    businessName: string;
  };
  createdAt: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedProducts.length === 0) return;

    try {
      const response = await fetch(`${BASE_URL}/api/admin/products/manage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        body: JSON.stringify({
          action,
          productIds: selectedProducts
        }),
        credentials: 'include'
      });

      if (response.ok) {
        fetchProducts();
        setSelectedProducts([]);
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des produits</h1>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="rejected">Rejetés</SelectItem>
            </SelectContent>
          </Select>

          {selectedProducts.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkAction('approve')}
              >
                <Check className="h-4 w-4 mr-2" />
                Approuver ({selectedProducts.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction('reject')}
              >
                <X className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === products.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedProducts(products.map(p => p.id));
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Vendeur</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'ajout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedProducts([...selectedProducts, product.id]);
                      } else {
                        setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  {product.images[0] ? (
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {product.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{product.seller.businessName}</TableCell>
                <TableCell>{product.price.toLocaleString()} FCFA</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(product.status)}
                    {product.status}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer {selectedProducts.length} produit(s) ?</p>
            <p className="text-sm text-gray-500 mt-2">Cette action est irréversible.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={() => handleBulkAction('delete')}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
