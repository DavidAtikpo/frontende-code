"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Trash2, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface FavoriteProduct {
  _id: string;
  title: string;
  price: number;
  images: string[] | string;
  description: string;
  stock: number;
  seller: {
    businessName: string;
    _id: string;
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = getCookie('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/user/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos favoris",
        variant: "destructive"
      });
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/user/favorites/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav._id !== productId));
        toast({
          title: "Succès",
          description: "Produit retiré des favoris"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          Mes Favoris
        </h1>
        <p className="text-sm text-muted-foreground">
          {favorites.length} produit{favorites.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Heart className="h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-semibold">Aucun favori</h3>
            <p className="text-muted-foreground">
              Vous n'avez pas encore ajouté de produits à vos favoris
            </p>
            <Button 
              variant="outline"
              onClick={() => router.push('/products')}
            >
              Découvrir des produits
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((product) => (
            <Card key={product._id} className="overflow-hidden group">
              <div className="relative aspect-square">
                <Image
                  src={Array.isArray(product.images) ? product.images[0] : product.images}
                  alt={product.title}
                  width={500}
                  height={500}
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => router.push(`/products/${product._id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFavorite(product._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Retirer
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{product.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.seller.businessName}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 