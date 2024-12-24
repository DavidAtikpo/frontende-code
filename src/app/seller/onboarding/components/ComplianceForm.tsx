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
      // Log de vérification des documents
      console.log('Vérification des documents:', {
        idCard: data.documents.idCard,
        proofOfAddress: data.documents.proofOfAddress,
        taxCertificate: data.documents.taxCertificate,
        photos: data.documents.photos
      });

      // Vérification détaillée des documents
      const missingDocuments = [];
      
      if (!data.documents.idCard?.file) {
        missingDocuments.push("Pièce d'identité");
      }
      if (!data.documents.proofOfAddress?.file) {
        missingDocuments.push("Justificatif de domicile");
      }
      if (!data.documents.taxCertificate?.file) {
        missingDocuments.push("Attestation fiscale");
      }
      if (!data.documents.photos.length || !data.documents.photos.every(photo => photo.file)) {
        missingDocuments.push("Photos d'identité");
      }

      if (missingDocuments.length > 0) {
        throw new Error(`Documents manquants : ${missingDocuments.join(', ')}`);
      }

      // Vérifier les informations personnelles
      if (!data.personalInfo.fullName || 
          !data.personalInfo.address || 
          !data.personalInfo.phone || 
          !data.personalInfo.email || 
          !data.personalInfo.taxNumber) {
        throw new Error("Toutes les informations personnelles sont requises");
      }

      // Vérifier les informations commerciales
      if (!data.businessInfo.category || 
          !data.businessInfo.description || 
          !data.businessInfo.returnPolicy || 
          !data.businessInfo.bankDetails.accountNumber) {
        throw new Error("Toutes les informations commerciales sont requises");
      }

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
          category: data.businessInfo.category,
          description: data.businessInfo.description,
          returnPolicy: data.businessInfo.returnPolicy,
          bankDetails: {
            accountNumber: data.businessInfo.bankDetails.accountNumber
          },
          products: data.businessInfo.products.map(product => ({
            name: product.name,
            description: product.description,
            price: product.price
          }))
        },
        compliance: {
          termsAccepted: data.compliance.termsAccepted,
          qualityStandardsAccepted: data.compliance.qualityStandardsAccepted,
          antiCounterfeitingAccepted: data.compliance.antiCounterfeitingAccepted
        }
      };

      formData.append('data', JSON.stringify(baseData));

      // Ajouter les fichiers
      formData.append('idCard', data.documents.idCard.file);
      formData.append('proofOfAddress', data.documents.proofOfAddress.file);
      formData.append('taxCertificate', data.documents.taxCertificate.file);
      
      data.documents.photos.forEach((photo, index) => {
        if (photo.file) {
          formData.append('photos', photo.file);
        }
      });

      // Log avant l'envoi
      console.log('FormData contenu:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, ':', value.name, '(', value.size, 'bytes )');
        } else {
          console.log(key, ':', value);
        }
      }

      const response = await fetch(`${BASE_URL}/api/seller/register`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erreur détaillée:', responseData);
        throw new Error(responseData.message || responseData.error || "Erreur lors de l'inscription");
      }

      onNext();
    } catch (err) {
      const error = err as Error;
      console.error("Erreur complète:", error);
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
