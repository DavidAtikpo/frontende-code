
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;

interface Product {
  _id: number;
  title: string;
  sku?: string;
  vendor?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  category: string;
  availability: string;
  description?: string;
  specifications?: Record<string, string | undefined>;
  images?: string[];
  createdAt: string;
  status: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  console.log("Params :", params);
  const productId = params?.productId; // Récupération du paramètre d'URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) {
      setError("ID produit non fourni.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/product-detail/${productId}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Erreur lors de la récupération du produit :", errorMessage);
        setError("Impossible de charger les détails du produit.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement des détails du produit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Aucun produit trouvé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Détails du produit</h1>
        </div>
        <Link href={`/admin/products/edit/${product._id}`}>
          <Button className="bg-[#1D4ED8] hover:bg-[#1e40af]">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Détails principaux du produit */}
        <Card className="col-span-2 p-6">
          <div className="space-y-6">
            <div className="flex space-x-6">
              <Image
                src={product.images?.[0] || "/default-product.png"} // Image principale ou défaut
                alt={product.title}
                width={160} // équivalent à 40 * 4
                height={160} // équivalent à 40 * 4
                className="w-40 h-40 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="text-gray-500 mt-2">{product.description || "Aucune description disponible."}</p>
                <div className="mt-4">
                  <span className="text-2xl font-bold">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  {product.oldPrice && (
                    <span className="text-gray-500 line-through ml-4">
                      {product.oldPrice.toLocaleString()} FCFA
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Spécifications */}
            {product.specifications && (
              <div>
                <h3 className="font-semibold mb-3">Spécifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500">{key}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Informations supplémentaires */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Informations</h3>
          <div className="space-y-4">
            <div>
              <span className="text-gray-500">Catégorie</span>
              <p>{product.category}</p>
            </div>
            <div>
              <span className="text-gray-500">Disponibilité</span>
              <p>{product.availability}</p>
            </div>
            <div>
              <span className="text-gray-500">Status</span>
              <p>{product.status}</p>
            </div>
            <div>
              <span className="text-gray-500">Date de création</span>
              <p>{new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
