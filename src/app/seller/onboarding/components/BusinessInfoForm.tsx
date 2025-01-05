"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { SellerFormData } from "../page";
import Image from "next/image";

interface BusinessInfoFormProps {
  data: SellerFormData;
  onUpdate: (data: SellerFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

const businessTypes = ["Retail", "Wholesale", "Service", "Manufacturing"];

export function BusinessInfoForm({
  data,
  onUpdate,
  onNext,
  onBack,
}: BusinessInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = ["Électromenage", "Mode", "Beauté", "Alimentation"];
  const paymentTypes = ["Compte bancaire", "Mobile Money"];

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

  const handleBusinessTypeChange = (value: string) => {
    const updatedData = {
      ...data,
      businessType: value,
    };
    onUpdate(updatedData);
    saveToLocalStorage(updatedData);
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files || !files[0]) return;
    
    const file = files[0];
    setImagePreview(URL.createObjectURL(file));
    
    const updatedData = {
      ...data,
      businessInfo: {
        ...data.businessInfo,
        shopImage: file
      },
    };
    onUpdate(updatedData);
    saveToLocalStorage(updatedData);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    
    const updatedData = {
      ...data,
      businessInfo: {
        ...data.businessInfo,
        shopImage: null
      },
    };
    onUpdate(updatedData);
    saveToLocalStorage(updatedData);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const info = data.businessInfo;

    if (!info.shopName) newErrors.shopName = "Le nom de la boutique est requis";
    if (!info.category) newErrors.category = "La catégorie est requise";
    if (!info.description) newErrors.description = "La description est requise";
    if (!info.shopImage) newErrors.shopImage = "L'image de la boutique est requise";
    if (!info.paymentType) newErrors.paymentType = "Le type de paiement est requis";
    if (!info.paymentDetails) newErrors.paymentDetails = "Les détails de paiement sont requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      saveToLocalStorage(data);
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Nom de la boutique */}
        <div className="space-y-2">
          <Label htmlFor="shopName">
            Nom de la boutique/entreprise <span className="text-red-500">*</span>
          </Label>
          <Input
            id="shopName"
            value={data.businessInfo.shopName}
            onChange={(e) => handleChange("shopName", e.target.value)}
          />
          {errors.shopName && (
            <p className="text-sm text-red-500">{errors.shopName}</p>
          )}
        </div>

        {/* Catégorie */}
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

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description de votre activité <span className="text-red-500">*</span>
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

        {/* Image de la boutique */}
        <div className="space-y-2">
          <Label htmlFor="shopImage">
            Image de la boutique/entreprise <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="shopImage"
              type="file"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
              accept="image/*"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('shopImage')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choisir une image
            </Button>
            {errors.shopImage && (
              <p className="text-sm text-red-500">{errors.shopImage}</p>
            )}
          </div>
          {imagePreview && (
            <div className="relative w-full h-40 mt-2">
              <Image
                src={imagePreview}
                alt="Aperçu de la boutique"
                className="w-full h-full object-cover rounded-lg"
                width={100}
                height={100}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Type de paiement */}
        <div className="space-y-2">
          <Label htmlFor="paymentType">
            Type de paiement <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.businessInfo.paymentType}
            onValueChange={(value) => handleChange("paymentType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type de paiement" />
            </SelectTrigger>
            <SelectContent>
              {paymentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.paymentType && (
            <p className="text-sm text-red-500">{errors.paymentType}</p>
          )}
        </div>

        {/* Détails de paiement */}
        <div className="space-y-2">
          <Label htmlFor="paymentDetails">
            {data.businessInfo.paymentType === "Compte bancaire" 
              ? "Numéro de compte bancaire" 
              : "Numéro Mobile Money"} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="paymentDetails"
            value={data.businessInfo.paymentDetails}
            onChange={(e) => handleChange("paymentDetails", e.target.value)}
            placeholder={data.businessInfo.paymentType === "Compte bancaire" 
              ? "Ex: BF123 01001 00000000000 01" 
              : "Ex: 76000000"}
          />
          {errors.paymentDetails && (
            <p className="text-sm text-red-500">{errors.paymentDetails}</p>
          )}
        </div>

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