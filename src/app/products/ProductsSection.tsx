"use client";

import React, { useEffect, useState } from "react";
import { FaStar, FaHeart, FaShoppingCart, FaEye, FaFilter, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/CartContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from 'cookies-next';

const { BASE_URL } = API_CONFIG;

interface Product {
  _id: string;
  title: string;
  images: string[];
  category: string;
  price: number;
  rating: number;
  discount?: number;
  badge?: string;
  description?: string;
  stock?: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const router = useRouter();
  const { dispatch } = useCartContext();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesPriceRange = !priceRange || filterByPriceRange(product.price, priceRange);
        return matchesSearch && matchesCategory && matchesPriceRange;
      });
      setFilteredProducts(filtered);
    }
  }, [searchTerm, selectedCategory, priceRange, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/product/get-all`);
      if (!response.ok) throw new Error('Erreur lors du chargement des produits');
      const data = await response.json();
      const productsArray = Array.isArray(data) ? data : data.products || [];
      setProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive"
      });
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByPriceRange = (price: number, range: string) => {
    switch (range) {
      case "0-10000":
        return price <= 10000;
      case "10000-50000":
        return price > 10000 && price <= 50000;
      case "50000+":
        return price > 50000;
      default:
        return true;
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const token = getCookie('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/user/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Produit ajouté aux favoris"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris",
        variant: "destructive"
      });
    }
  };

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="electronics">Électronique</SelectItem>
                <SelectItem value="clothing">Vêtements</SelectItem>
                <SelectItem value="books">Livres</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="0-10000">0 - 10,000 FCFA</SelectItem>
                <SelectItem value="10000-50000">10,000 - 50,000 FCFA</SelectItem>
                <SelectItem value="50000-plus">50,000+ FCFA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <FaShoppingCart className="h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-semibold">Aucun produit trouvé</h3>
            <p className="text-muted-foreground">
              Nous n'avons pas trouvé de produits correspondant à vos critères.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group relative overflow-hidden">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => router.push(`/product/${product._id}`)}
                      >
                        <FaEye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddToWishlist(product._id)}
                      >
                        <FaHeart className="h-4 w-4 mr-2" />
                        Favoris
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{product.title}</h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < product.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {product.price.toLocaleString()} FCFA
                    </span>
                    <Button size="sm">
                      <FaShoppingCart className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
