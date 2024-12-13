"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { SellerFormData } from "../page";
import { API_CONFIG } from '@/utils/config';

interface BusinessInfoFormProps {
  data: SellerFormData;
  onUpdate: (data: SellerFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BusinessInfoForm({
  data,
  onUpdate,
  onNext,
  onBack,
}: BusinessInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [] as File[],
  });

  const categories = ["Électronique", "Mode", "Maison", "Beauté", "Alimentation", "Services"];

  // Fonction pour sauvegarder dans localStorage
  const saveToLocalStorage = (updatedData: SellerFormData) => {
    localStorage.setItem('sellerFormData', JSON.stringify(updatedData));
  };

  const handleChange = (field: string, value: string) => {
    const updatedData = {
      ...data,
      businessInfo: {
        ...data.businessInfo,
        [field]: value,
      },
    };
    onUpdate(updatedData);
    saveToLocalStorage(updatedData);
  };

  const handleBankDetailsChange = (field: string, value: string) => {
    const updatedData = {
      ...data,
      businessInfo: {
        ...data.businessInfo,
        bankDetails: {
          ...data.businessInfo.bankDetails,
          [field]: value,
        },
      },
    };
    onUpdate(updatedData);
    saveToLocalStorage(updatedData);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      setErrors({ product: "Tous les champs du produit sont requis" });
      return;
    }

    const updatedData = {
      ...data,
      businessInfo: {
        ...data.businessInfo,
        products: [
          ...data.businessInfo.products,
          {
            name: newProduct.name,
            description: newProduct.description,
            price: parseFloat(newProduct.price),
            images: newProduct.images,
          },
        ],
      },
    };
    onUpdate(updatedData);
    saveToLocalStorage(updatedData);

    setNewProduct({
      name: "",
      description: "",
      price: "",
      images: [],
    });
    setErrors({});
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...data.businessInfo.products];
    newProducts.splice(index, 1);
    const updatedData = {
      ...data,
      businessInfo: {
        ...data.businessInfo,
        products: newProducts,
      },
    };
    onUpdate(updatedData);
    saveToLocalStorage(updatedData);
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    setNewProduct({
      ...newProduct,
      images: Array.from(files),
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const info = data.businessInfo;

    if (!info.category) newErrors.category = "La catégorie est requise";
    if (!info.description) newErrors.description = "La description est requise";
    if (!info.products.length) newErrors.products = "Ajoutez au moins un produit";
    if (!info.bankDetails.accountNumber) 
      newErrors.accountNumber = "Le numéro de compte est requis";
    if (!info.returnPolicy) 
      newErrors.returnPolicy = "La politique de retour est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      saveToLocalStorage(data); // Sauvegarde finale avant de passer à l'étape suivante
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Catégorie et Description */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">
            Catégorie <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.businessInfo.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={data.businessInfo.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Produits */}
      <div className="space-y-4">
        <h3 className="font-medium">Produits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.businessInfo.products.map((product, index) => (
            <div key={index} className="relative p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="font-bold text-blue-600">{product.price} FCFA</p>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => handleRemoveProduct(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Label>Ajouter un produit</Label>
          <Input
            placeholder="Nom du produit"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <Textarea
            placeholder="Description du produit"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Prix"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <Input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddProduct}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le produit
          </Button>
          {errors.products && (
            <p className="text-sm text-red-500">{errors.products}</p>
          )}
        </div>
      </div>

      {/* Détails bancaires */}
      <div className="space-y-4">
        <Label htmlFor="accountNumber">
          Numéro de compte <span className="text-red-500">*</span>
        </Label>
        <Input
          id="accountNumber"
          value={data.businessInfo.bankDetails.accountNumber}
          onChange={(e) => handleBankDetailsChange("accountNumber", e.target.value)}
        />
        {errors.accountNumber && (
          <p className="text-sm text-red-500">{errors.accountNumber}</p>
        )}
      </div>

      {/* Politique de retour */}
      <div className="space-y-4">
        <Label htmlFor="returnPolicy">
          Politique de retour <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="returnPolicy"
          value={data.businessInfo.returnPolicy}
          onChange={(e) => handleChange("returnPolicy", e.target.value)}
        />
        {errors.returnPolicy && (
          <p className="text-sm text-red-500">{errors.returnPolicy}</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Retour
        </Button>
        <Button
          type="submit"
          className="bg-[#1D4ED8] hover:bg-[#1e40af]"
        >
          Suivant
        </Button>
      </div>
    </form>
  );
}