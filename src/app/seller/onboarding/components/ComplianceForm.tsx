"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SellerFormData } from "../page";
import { API_CONFIG } from "@/utils/config";

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
    const token = localStorage.getItem('token');

    if (!token) {
      setErrors((prev) => ({ ...prev, submit: "Veuillez vous connecter" }));
      setIsSubmitting(false);
      return;
    }

    // Log des données avant envoi
    console.log("=== DÉBUT SOUMISSION ===");
    console.log("Type:", data.type);
    console.log("Personal Info:", data.personalInfo);
    console.log("Documents:", data.documents);
    console.log("Contract:", data.contract);
    console.log("Video:", data.videoVerification);
    console.log("Business Info:", data.businessInfo);
    console.log("Compliance:", data.compliance);

    // Convertir les données de base en JSON
    const baseData = {
      type: data.type,
      personalInfo: data.personalInfo,
      businessInfo: data.businessInfo,
      compliance: data.compliance,
      validation: data.validation
    };
    formData.append('data', JSON.stringify(baseData));

    // Ajouter les fichiers
    if (data.documents.idCard) 
      formData.append('idCard', data.documents.idCard);
    if (data.documents.proofOfAddress) 
      formData.append('proofOfAddress', data.documents.proofOfAddress);
    if (data.documents.taxCertificate) 
      formData.append('taxCertificate', data.documents.taxCertificate);
    
    data.documents.photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    if (data.contract.signedDocument) {
      formData.append('signedDocument', data.contract.signedDocument);
    }

    // Convertir et ajouter la vidéo
    if (data.videoVerification.recordingUrl) {
      try {
        const videoBlob = await fetch(data.videoVerification.recordingUrl).then(r => r.blob());
        formData.append('verificationVideo', videoBlob, 'verification.webm');
      } catch (error) {
        console.error('Erreur lors de la conversion de la vidéo:', error);
      }
    }

    // Log du FormData
    console.log("=== CONTENU FORMDATA ===");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, ":", value.name, "(", value.size, "bytes )");
      } else {
        console.log(key, ":", value);
      }
    }

    try {
      const response = await fetch(`${BASE_URL}/api/seller/register`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Erreur lors de l'inscription");
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
