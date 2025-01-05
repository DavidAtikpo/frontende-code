"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { SellerFormData } from "../page";
import Image from "next/image";

interface DocumentUploadFormProps {
  data: SellerFormData;
  onUpdate: (data: SellerFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

interface StoredDocument {
  name: string;
  url?: string;
  file?: File;
}

interface StoredDocuments {
  idCard: StoredDocument | null;
  proofOfAddress: StoredDocument | null;
  taxCertificate: StoredDocument | null;
  photos: StoredDocument[];
  rccm?: StoredDocument | null;
  companyStatutes?: StoredDocument | null;
}

export function DocumentUploadForm({ data, onUpdate, onNext, onBack }: DocumentUploadFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const requiredDocuments = {
    individual: {
      idCard: "Pièce d'identité",
      proofOfAddress: "Justificatif de domicile (facture SBE/SONABEL, certificat de résidence, contrat de bail ou de location)",
      photos: "Photo d'identité",
      taxCertificate: "Attestation fiscale (IFU)",
    },
    company: {
      idCard: "Pièce d'identité du représentant",
      rccm: "RCCM",
      companyStatutes: "Statuts de l'entreprise",
      taxCertificate: "Attestation fiscale (IFU)",
      proofOfAddress: "Justificatif de siège social",
    },
  };

  const saveToLocalStorage = (updatedData: SellerFormData) => {
    const storedDocuments: StoredDocuments = {
      idCard: updatedData.documents.idCard?.file ? {
        name: updatedData.documents.idCard.name,
        url: URL.createObjectURL(updatedData.documents.idCard.file)
      } : null,
      proofOfAddress: updatedData.documents.proofOfAddress?.file ? {
        name: updatedData.documents.proofOfAddress.name,
        url: URL.createObjectURL(updatedData.documents.proofOfAddress.file)
      } : null,
      taxCertificate: updatedData.documents.taxCertificate?.file ? {
        name: updatedData.documents.taxCertificate.name,
        url: URL.createObjectURL(updatedData.documents.taxCertificate.file)
      } : null,
      photos: updatedData.documents.photos.map(photo => ({
        name: photo.name,
        url: photo.file ? URL.createObjectURL(photo.file) : photo.url
      }))
    };

    localStorage.setItem('sellerFormData', JSON.stringify({
      ...updatedData,
      documents: storedDocuments
    }));
  };

  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files) return;

    const updatedData = {
      ...data,
      documents: {
        ...data.documents,
        [field]: field === "photos" 
          ? Array.from(files).map(file => ({
              name: file.name,
              file: file,
              url: URL.createObjectURL(file)
            }))
          : {
              name: files[0].name,
              file: files[0],
              url: URL.createObjectURL(files[0])
            },
      },
    };
    onUpdate(updatedData);
    saveToLocalStorage(updatedData);
  };

  const removeFile = (field: string, index?: number) => {
    if (field === "photos" && typeof index === "number") {
      const newPhotos = [...(data.documents.photos || [])];
      newPhotos.splice(index, 1);
      onUpdate({
        ...data,
        documents: {
          ...data.documents,
          photos: newPhotos,
        },
      });
    } else {
      onUpdate({
        ...data,
        documents: {
          ...data.documents,
          [field]: null,
        },
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const docs = data.documents;
    const required = data.type === "individual" ? requiredDocuments.individual : requiredDocuments.company;

    Object.entries(required).forEach(([key, label]) => {
      if (key === "photos") {
        if (!docs.photos || docs.photos.length !== 1) {
          newErrors[key] = `${label} est requise`;
        }
      } else if (!docs[key as keyof typeof docs]) {
        newErrors[key] = `${label} est requis`;
      }
    });

    if (docs.photos && docs.photos.some(photo => photo.file && photo.file.size > 5 * 1024 * 1024)) {
      newErrors.photos = "La photo doit être inférieure à 5 Mo";
    }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(data.type === "individual" ? requiredDocuments.individual : requiredDocuments.company)
          .map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>
                {label} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id={key}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(key, e.target.files)}
                  accept={
                    key === "photos" 
                      ? "image/*" 
                      : key === "proofOfAddress"
                      ? ".pdf,.jpg,.jpeg,.png"
                      : ".pdf,.jpg,.jpeg,.png"
                  }
                  multiple={key === "photos"}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById(key)?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {key === "photos" ? "Sélectionner une photo" : "Choisir un fichier"}
                </Button>
                {errors[key] && (
                  <p className="text-sm text-red-500 mt-1">{errors[key]}</p>
                )}
              </div>
              {/* Affichage des fichiers sélectionnés */}
              {key === "photos" ? (
                <div className="flex gap-2 mt-2">
                  {data.documents.photos?.map((photo: File | StoredDocument, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={
                          photo instanceof File 
                            ? URL.createObjectURL(photo) 
                            : (photo as StoredDocument).url || ''
                        }
                        alt={`Photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                        width={64}
                        height={64}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeFile("photos", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                data.documents[key as keyof typeof data.documents] && (
                  <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 rounded">
                    <span className="text-sm truncate">
                      {(data.documents[key as keyof typeof data.documents] as File).name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}
            </div>
          ))}
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