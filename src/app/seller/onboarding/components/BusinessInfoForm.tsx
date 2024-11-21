"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { SellerFormData } from "../page";

interface BusinessInfoFormProps {
  data: SellerFormData;
  onUpdate: (data: SellerFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BusinessInfoForm({ data, onUpdate, onNext, onBack }: BusinessInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [] as File[],
  });

  const categories = [
    "Électronique",
    "Mode",
    "Maison",
    "Beauté",
    "Alimentation",
    "Services",
  ];

  const handleChange = (field: string, value: string) => {
    onUpdate({
      ...data,
      businessInfo: {
        ...data.businessInfo,
        [field]: value,
      },
    });
  };

  const handleBankDetailsChange = (field: string, value: string) => {
    onUpdate({
      ...data,
      businessInfo: {
        ...data.businessInfo,
        bankDetails: {
          ...data.businessInfo.bankDetails,
          [field]: value,
        },
      },
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      setErrors({ product: "Tous les champs du produit sont requis" });
      return;
    }

    onUpdate({
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
    });

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
    onUpdate({
      ...data,
      businessInfo: {
        ...data.businessInfo,
        products: newProducts,
      },
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

        {/* Suite de l'implémentation... */}
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