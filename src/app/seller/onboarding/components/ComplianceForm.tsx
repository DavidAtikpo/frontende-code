"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SellerFormData } from "../page";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface ComplianceError {
  message: string;
  field?: string;
  code?: string;
}

interface ComplianceFormProps {
  data: SellerFormData;
  onUpdate: (data: SellerFormData) => void;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

export function ComplianceForm({
  data,
  onUpdate,
  onNext,
  onBack,
  isLastStep,
}: ComplianceFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const complianceFields = [
    {
      id: "termsAccepted",
      label: "J'accepte les conditions générales de vente et d'utilisation de la plateforme",
      errorKey: "terms",
      errorMessage: "Vous devez accepter les conditions d'utilisation",
    },
    {
      id: "qualityStandardsAccepted",
      label: "Je m'engage à respecter les normes de qualité imposées par la plateforme",
      errorKey: "quality",
      errorMessage: "Vous devez accepter les normes de qualité",
    },
    {
      id: "antiCounterfeitingAccepted",
      label: "Je m'engage à respecter la politique anti-contrefaçon et anti-fraude",
      errorKey: "counterfeit",
      errorMessage: "Vous devez accepter la politique anti-contrefaçon",
    },
  ];

  const handleCheckboxChange = (field: keyof SellerFormData["compliance"]) => {
    onUpdate({
      ...data,
      compliance: {
        ...data.compliance,
        [field]: !data.compliance[field],
      },
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    complianceFields.forEach(({ id, errorKey, errorMessage }) => {
      if (!data.compliance[id as keyof SellerFormData["compliance"]]) {
        newErrors[errorKey] = errorMessage;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const formData = new FormData();
    const token = getCookie('token'); 

    if (!token) {
      setErrors((prev) => ({ ...prev, submit: "Veuillez vous connecter" }));
      setIsSubmitting(false);
      return;
    }

    try {
      // Convertir les données de base en JSON
      const baseData = {
        type: data.type,
        personalInfo: data.personalInfo,
        businessInfo: {
          ...data.businessInfo,
          products: data.businessInfo.products.map(product => ({
            ...product,
            images: [] // Les images seront gérées séparément
          }))
        },
        compliance: data.compliance
      };
      formData.append('data', JSON.stringify(baseData));

      // Ajouter les fichiers avec leurs noms d'origine
      if (data.documents.idCard?.file) {
        formData.append('idCard', data.documents.idCard.file);
      }
      if (data.documents.proofOfAddress?.file) {
        formData.append('proofOfAddress', data.documents.proofOfAddress.file);
      }
      if (data.documents.taxCertificate?.file) {
        formData.append('taxCertificate', data.documents.taxCertificate.file);
      }

      // Ajouter les photos
      data.documents.photos.forEach((photo) => {
        if (photo.file) {
          formData.append('photos', photo.file);
        }
      });

      // Ajouter le document signé
      if (data.contract.signedDocument?.file) {
        formData.append('signedDocument', data.contract.signedDocument.file);
      }

      // Ajouter la vidéo
      if (data.videoVerification.recordingBlob) {
        formData.append('verificationVideo', 
          new File([data.videoVerification.recordingBlob], 'verification.webm', 
          { type: 'video/webm' })
        );
      }

      const response = await fetch(`${BASE_URL}/api/seller/register`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }

      onNext();
    } catch (err) {
      const error = err as ComplianceError;
      console.error("Erreur de conformité:", error.message);
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-4">Engagements légaux et conformité</h3>

          <div className="space-y-4">
            {complianceFields.map(({ id, label, errorKey }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={data.compliance[id as keyof SellerFormData["compliance"]]}
                  onCheckedChange={() =>
                    handleCheckboxChange(id as keyof SellerFormData["compliance"])
                  }
                />
                <Label htmlFor={id} className="text-sm leading-none">
                  {label}
                </Label>
                {errors[errorKey] && (
                  <p className="text-sm text-red-500">{errors[errorKey]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {errors.submit && (
          <p className="text-sm text-red-500 text-center">{errors.submit}</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button
          type="submit"
          className="bg-[#1D4ED8] hover:bg-[#1e40af] disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isLastStep
            ? isSubmitting
              ? "En cours..."
              : "Terminer l'inscription"
            : "Suivant"}
        </Button>
      </div>
    </form>
  );
}
