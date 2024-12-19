"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Heart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface FavoriteProductsProps {
  products: Product[];
  onRemove: (productId: string) => void;
}

export function FavoriteProducts({ products, onRemove }: FavoriteProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produits favoris</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-sm font-bold">{formatPrice(product.price)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => onRemove(product.id)}
              >
                <Heart className="h-4 w-4 fill-current text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 