"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement des données (à remplacer par l'appel API)
    const fetchProduct = async () => {
      // Simuler un appel API
      setProduct({
        id: params.id,
        name: "TOZO T6 True Wireless",
        price: 50000,
        description: "Description détaillée du produit...",
        category: "Écouteurs",
        status: "En stock",
        image: "/products/tozo.jpg",
        specifications: {
          marque: "TOZO",
          modèle: "T6",
          couleur: "Noir",
          connectivité: "Bluetooth 5.0"
        },
        createdAt: "2024-03-20"
      });
      setLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div>Chargement...</div>;
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
        <Link href={`/admin/products/edit/${product.id}`}>
          <Button className="bg-[#1D4ED8]">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="space-y-6">
            <div className="flex space-x-6">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-40 h-40 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-500 mt-2">{product.description}</p>
                <div className="mt-4">
                  <span className="text-2xl font-bold">
                    {product.price.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Spécifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500">{key}</span>
                    <span>{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Informations</h3>
          <div className="space-y-4">
            <div>
              <span className="text-gray-500">Catégorie</span>
              <p>{product.category}</p>
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