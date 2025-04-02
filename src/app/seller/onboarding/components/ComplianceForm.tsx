"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SellerFormData } from "../page";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";

// const { BASE_URL } = API_CONFIG;
const BASE_URL = "http://localhost:5000";

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
    console.log("Début de la soumission...");

    try {
      const formData = new FormData();
      const token = getCookie('token');

      if (!token) {
        throw new Error("Veuillez vous connecter");
      }

      // Vérification des documents
      const missingDocuments = [];
      if (!data.documents.idCard?.file) missingDocuments.push("Pièce d'identité");
      if (!data.documents.proofOfAddress?.file) missingDocuments.push("Justificatif de domicile");
      if (!data.documents.taxCertificate?.file) missingDocuments.push("Attestation fiscale");
      if (!data.documents.photos?.[0]?.file) missingDocuments.push("Photo d'identité");

      if (missingDocuments.length > 0) {
        throw new Error(`Documents manquants : ${missingDocuments.join(', ')}`);
      }

      // Préparation des données de base
      const baseData = {
        type: data.type,
        personalInfo: {
          fullName: data.personalInfo.fullName,
          address: data.personalInfo.address,
          phone: data.personalInfo.phone,
          email: data.personalInfo.email,
          taxNumber: data.personalInfo.taxNumber,
          idNumber: data.personalInfo.idNumber,
          idType: data.personalInfo.idType
        },
        businessInfo: {
          shopName: data.businessInfo.shopName,
          category: data.businessInfo.category,
          description: data.businessInfo.description,
          paymentType: data.businessInfo.paymentType,
          paymentDetails: data.businessInfo.paymentDetails,
          country: data.businessInfo.country,
          shopVideo: data.businessInfo.shopVideo,
          shopImage: data.businessInfo.shopImage
        },
        compliance: {
          termsAccepted: data.compliance.termsAccepted,
          qualityStandardsAccepted: data.compliance.qualityStandardsAccepted,
          antiCounterfeitingAccepted: data.compliance.antiCounterfeitingAccepted
        }
      };

      // Ajout des données JSON
      formData.append('data', JSON.stringify(baseData));

      // Ajout des fichiers
      if (data.documents.idCard?.file instanceof File) {
        formData.append('idCard', data.documents.idCard.file);
      }
      if (data.documents.proofOfAddress?.file instanceof File) {
        formData.append('proofOfAddress', data.documents.proofOfAddress.file);
      }
      if (data.documents.taxCertificate?.file instanceof File) {
        formData.append('taxCertificate', data.documents.taxCertificate.file);
      }
      if (data.documents.photos?.[0]?.file instanceof File) {
        formData.append('photos', data.documents.photos[0].file);
      }
      if (data.businessInfo.shopImage instanceof File) {
        formData.append('shopImage', data.businessInfo.shopImage);
      }
      if (data.contract.signedDocument?.file instanceof File) {
        formData.append('signedDocument', data.contract.signedDocument.file);
      }
      if (data.businessInfo.shopVideo instanceof File) {
        formData.append('shopVideo', data.businessInfo.shopVideo);
      }

      // Log pour debug
      const dataToSend = JSON.parse(formData.get('data') as string);
      console.log('Données envoyées:', dataToSend);
      console.log('Catégorie envoyée:', dataToSend.businessInfo.category);
      console.log('Type de la catégorie:', typeof dataToSend.businessInfo.category);
      console.log('Structure complète de businessInfo:', dataToSend.businessInfo);
      console.log('Documents à envoyer:', {
        idCard: data.documents.idCard?.file,
        proofOfAddress: data.documents.proofOfAddress?.file,
        taxCertificate: data.documents.taxCertificate?.file,
        photos: data.documents.photos?.[0]?.file,
        shopImage: data.businessInfo.shopImage,
        signedDocument: data.contract.signedDocument?.file,
        shopVideo: data.businessInfo.shopVideo
      });

      console.log("Envoi de la requête...");
      const response = await fetch(`${BASE_URL}/api/seller/post/register`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log("Réponse reçue, status:", response.status);
      const responseData = await response.json();
      console.log("Données de réponse:", responseData);

      if (!response.ok) {
        console.error('Erreur détaillée:', responseData);
        throw new Error(responseData.message || responseData.error || "Erreur lors de l'inscription");
      }

      console.log("Inscription réussie!");
      onNext();
    } catch (err) {
      const error = err as Error;
      console.error("Erreur complète:", error);
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setIsSubmitting(false);
      console.log("Fin de la soumission");
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
