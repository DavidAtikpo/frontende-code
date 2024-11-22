"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
const BASE_URL = "http://localhost:5000/api";

export default function AddProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  // const [formData, setFormData] = useState({
  //   name: "",
  //   description: "",
  //   price: "",
  //   category: "",
  //   status: "En stock",
  //   image: null as File | null,
  // });

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setProduct({ ...product, [name]: value });
  // };
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   const formDataToSend = new FormData();
  //   Object.entries(formData).forEach(([key, value]) => {
  //     if (value !== null) {
  //       formDataToSend.append(key, value);
  //     }
  //   });

  //   try {
  //     const response = await fetch(`${BASE_URL}/api/product/new-product`, {
  //       method: "POST",
  //       body: formDataToSend,
  //     });

  //     if (response.ok) {
  //       window.location.href = "/admin/products";
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors de l'ajout du produit:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
    images: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formattedProduct = {
      ...product,
      price: parseFloat(product.price),
      oldPrice: parseFloat(product.oldPrice),
      discount: parseFloat(product.discount),
      features: product.features.split(","), // Convertir en tableau
      shippingInfo: product.shippingInfo.split(",").map((info) => ({
        type: info.split(":")[0].trim(),
        details: info.split(":")[1]?.trim(),
      })), // Convertir en tableau d'objets
      images: product.images.split(","), // Convertir en tableau
    };

    try {
      const response = await fetch(`${BASE_URL}/product/new-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedProduct),
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
        images: "",
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de l'ajout du produit.");
      setSuccessMessage("");
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

      {/* <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Prix (FCFA)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Produits Congeles</SelectItem>
                  <SelectItem value="clothing">Produits frais</SelectItem>
                  <SelectItem value="books">Epicerie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                defaultValue="En stock"
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En stock">En stock</SelectItem>
                  <SelectItem value="Rupture">Rupture</SelectItem>
                  <SelectItem value="En commande">En commande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                required
              />
            </div>
            <Label htmlFor="image">Image du produit</Label>
            <textarea
          name="images"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="URLs des images (séparées par une virgule)"
          required
          className="border rounded px-4 py-1 w-full mt-4"
        ></textarea>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="image">Image du produit</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({
                  ...formData,
                  image: e.target.files ? e.target.files[0] : null
                })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/admin/products">
              <Button variant="outline">Annuler</Button>
            </Link>
            <Button 
              type="submit" 
              className="bg-[#1D4ED8]"
              disabled={isLoading}
            >
              {isLoading ? "Création en cours..." : "Créer le produit"}
            </Button>
          </div>
        </Card>
      </form> */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleInputChange}
            placeholder="Titre"
            required
            className="border rounded px-4 py-2"
          />
          <input
            type="text"
            name="sku"
            value={product.sku}
            onChange={handleInputChange}
            placeholder="SKU (Référence)"
            required
            className="border rounded px-4 py-2"
          />
          <input
            type="text"
            name="vendor"
            value={product.vendor}
            onChange={handleInputChange}
            placeholder="Vendeur"
            required
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            placeholder="Prix"
            required
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            name="oldPrice"
            value={product.oldPrice}
            onChange={handleInputChange}
            placeholder="Ancien Prix"
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            name="discount"
            value={product.discount}
            onChange={handleInputChange}
            placeholder="Remise (%)"
            className="border rounded px-4 py-2"
          />
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            placeholder="Catégorie"
            required
            className="border rounded px-4 py-2"
          />
          
          <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Produits Congeles</SelectItem>
                  <SelectItem value="clothing">Produits frais</SelectItem>
                  <SelectItem value="books">Epicerie</SelectItem>
                </SelectContent>
              </Select>
            </div>

          <select
            name="availability"
            value={product.availability}
            onChange={handleInputChange}
            className="border rounded px-4 py-2"
          >
            <option value="Disponible">Disponible</option>
            <option value="Indisponible">Indisponible</option>
          </select>
        </div>

        <textarea
          name="description"
          value={product.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
          className="border rounded px-4 py-2 w-full mt-4"
        ></textarea>

        <textarea
          name="features"
          value={product.features}
          onChange={handleInputChange}
          placeholder="Caractéristiques (séparées par une virgule)"
          className="border rounded px-4 py-2 w-full mt-4"
        ></textarea>

        <textarea
          name="shippingInfo"
          value={product.shippingInfo}
          onChange={handleInputChange}
          placeholder="Informations de Livraison (type:details, séparées par une virgule)"
          className="border rounded px-4 py-2 w-full mt-4"
        ></textarea>

        <textarea
          name="images"
          value={product.images}
          onChange={handleInputChange}
          placeholder="URLs des images (séparées par une virgule)"
          required
          className="border rounded px-4 py-2 w-full mt-4"
        ></textarea>


          <div className="col-span-2 space-y-2">
              <Label htmlFor="image">Image du produit</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange({
                  ...product,
                  images: e.target.files ? e.target.files[0] : null
                })}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
            <Link href="/admin/products">
              <Button variant="outline">Annuler</Button>
            </Link>
            <Button 
              type="submit" 
              className="bg-[#1D4ED8]"
              disabled={isLoading}
            >
              {isLoading ? "Création en cours..." : "Créer le produit"}
            </Button>
          </div>

        {/* <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
        >
          Ajouter le produit
        </button> */}
      </form>

      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
    </div>
  );
} 