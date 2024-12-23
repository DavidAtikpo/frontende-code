"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;


export default function AddProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({
    title: "",
    sku: "",
    vendor: "",
    price: "",
    oldPrice: "",
    discount: "",
    category: "",
    availability: "Disponible",
    description: "",
    features: "",
    shippingInfo: "",
    images: null as File | null, // Ajoutez ceci pour résoudre le problème
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProduct({ ...product, images: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      Object.keys(product).forEach((key) => {
        if (key === "features" || key === "shippingInfo") {
          formData.append(key, (product[key as keyof typeof product] as string)?.split(",").join(",") || "");
        } else if (key === "images" && product.images) {
          formData.append("images", product.images as File);
        } else {
          formData.append(key, product[key as keyof typeof product]?.toString() || "");
        }
      });
  
      const response = await fetch(`${BASE_URL}/product/new-product`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du produit");
      }
  
      setSuccessMessage("Produit ajouté avec succès !");
      setErrorMessage("");
      setProduct({
        title: "",
        sku: "",
        vendor: "",
        price: "",
        oldPrice: "",
        discount: "",
        category: "",
        availability: "Disponible",
        description: "",
        features: "",
        shippingInfo: "",
        images: null,
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de l'ajout du produit.");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Ajouter un produit</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="title"
            value={product.title}
            onChange={handleInputChange}
            placeholder="Titre"
            required
          />
          <Input
            type="text"
            name="sku"
            value={product.sku}
            onChange={handleInputChange}
            placeholder="SKU (Référence)"
            required
          />
          <Input
            type="text"
            name="vendor"
            value={product.vendor}
            onChange={handleInputChange}
            placeholder="Vendeur"
            required
          />
          <Input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            placeholder="Prix"
            required
          />
          <Input
            type="number"
            name="oldPrice"
            value={product.oldPrice}
            onChange={handleInputChange}
            placeholder="Ancien Prix"
          />
          <Input
            type="number"
            name="discount"
            value={product.discount}
            onChange={handleInputChange}
            placeholder="Remise (%)"
          />

          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select
              onValueChange={(value) => setProduct({ ...product, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Produits Congelés</SelectItem>
                <SelectItem value="clothing">Produits Frais</SelectItem>
                <SelectItem value="books">Épicerie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <select
  name="availability"
  value={product.availability}
  onChange={(e) => setProduct({ ...product, availability: e.target.value as "Disponible" | "Indisponible" })}
  className="border rounded px-4 py-2"
>
  <option value="Disponible">Disponible</option>
  <option value="Indisponible">Indisponible</option>
</select>

        </div>

        <Textarea
          name="description"
          value={product.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
          className="mt-4"
        />

        <Textarea
          name="features"
          value={product.features}
          onChange={handleInputChange}
          placeholder="Caractéristiques (séparées par une virgule)"
          className="mt-4"
        />

        <Textarea
          name="shippingInfo"
          value={product.shippingInfo}
          onChange={handleInputChange}
          placeholder="Informations de Livraison (type:details, séparées par une virgule)"
          className="mt-4"
        />

        <div className="mt-4">
          <Label htmlFor="images">Images</Label>
          <Input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Link href="/admin/products">
            <Button variant="outline">Annuler</Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="bg-[#1D4ED8]">
            {isLoading ? "Création en cours..." : "Créer le produit"}
          </Button>
        </div>
      </form>

      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
    </div>
  );
}
