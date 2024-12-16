"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { getApiUrl } from '@/utils/api';
import { useState } from "react";
import { EditProductDialog } from "./EditProductDialog";

const BASE_URL = getApiUrl();

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    status: "active" | "inactive";
  };
  onUpdate: () => void;
}

export function ProductCard({ product, onUpdate }: ProductCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/seller/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");
      onUpdate();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <Card>
      <div className="relative h-48 w-full">
        <Image
          src={product.images[0] || '/default-product.jpg'}
          alt={product.name}
          width={500}
          height={300}
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.description}</p>
          </div>
          <span className="font-bold">{product.price.toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
          </span>
          <div className="space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <EditProductDialog
        product={product}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={onUpdate}
      />
    </Card>
  );
}
