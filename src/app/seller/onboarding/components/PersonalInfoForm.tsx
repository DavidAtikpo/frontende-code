"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SellerFormData } from "../page";

interface PersonalInfoFormProps {
  data: SellerFormData;
  onUpdate: (data: SellerFormData) => void;
  onNext: () => void;
  isFirstStep: boolean;
}

export function PersonalInfoForm({ data, onUpdate, onNext, isFirstStep }: PersonalInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    onUpdate({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const info = data.personalInfo;

    if (data.type === "individual") {
      if (!info.fullName) newErrors.fullName = "Le nom complet est requis";
      if (!info.idNumber) newErrors.idNumber = "Le numéro d'identification est requis";
    } else {
      if (!info.companyName) newErrors.companyName = "La raison sociale est requise";
      if (!info.rccmNumber) newErrors.rccmNumber = "Le numéro RCCM est requis";
      if (!info.legalRepName) newErrors.legalRepName = "Le nom du représentant légal est requis";
    }

    if (!info.address) newErrors.address = "L'adresse est requise";
    if (!info.phone) newErrors.phone = "Le numéro de téléphone est requis";
    if (!info.email) newErrors.email = "L'email est requis";
    if (!info.taxNumber) newErrors.taxNumber = "Le numéro IFU est requis";

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
      <div className="space-y-4">
        <RadioGroup
          value={data.type}
          onValueChange={(value: "individual" | "company") => 
            onUpdate({ ...data, type: value })}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual">Personne physique</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="company" id="company" />
            <Label htmlFor="company">Entreprise</Label>
          </div>
        </RadioGroup>

        {data.type === "individual" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Nom complet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                value={data.personalInfo.fullName || ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
                error={errors.fullName}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>
            {/* Autres champs pour personne physique */}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Raison sociale <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                value={data.personalInfo.companyName || ""}
                onChange={(e) => handleChange("companyName", e.target.value)}
                error={errors.companyName}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName}</p>
              )}
            </div>
            {/* Autres champs pour entreprise */}
          </div>
        )}

        {/* Champs communs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ... autres champs communs ... */}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
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