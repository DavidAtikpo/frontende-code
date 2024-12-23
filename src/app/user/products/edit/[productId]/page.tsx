


"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;


interface ProductData {
  title: string;
  description: string;
  price: string;
  category: string;
  status: string;
  specifications: Record<string, string>;
  stock: string;
  images: string[];
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<ProductData>({
    title: "",
    description: "",
    price: "",
    category: "",
    status: "",
    specifications: {},
    stock: "",
    images: [],
  });

  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const productId = params?.productId;

  // Récupération des données du produit
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/product/product-detail/${productId}`);
        if (!response.ok) {
          throw new Error("Produit non trouvé");
        }
        const data: ProductData = await response.json();
        setFormData(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [newSpecKey]: newSpecValue,
        },
      });
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const handleRemoveSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const response = await fetch(`${BASE_URL}/product/update-product/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la modification");
      }

      setSuccess("Produit modifié avec succès !");
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/products")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold ml-4">Modifier le produit</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Nom du produit</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            {/* Spécifications */}
            <div className="space-y-4">
              <Label>Spécifications</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Clé"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                />
                <Input
                  placeholder="Valeur"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSpecification}
              >
                Ajouter une spécification
              </Button>

              <div className="mt-4 space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>
                      <strong>{key}:</strong> {value}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSpecification(key)}
                      className="text-red-600"
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-[#1D4ED8] hover:bg-[#1e40af]"
                disabled={isSaving}
              >
                {isSaving ? "Enregistrement..." : "Sauvegarder les modifications"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
