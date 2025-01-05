"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { SellerFormData } from "../page";


interface ContractSigningFormProps {
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

export function ContractSigningForm({ data, onUpdate, onNext, onBack }: ContractSigningFormProps) {
  const [error, setError] = useState<string>("");


  const handleDownloadContract = () => {
    // Le fichier doit être dans le dossier public
    const contractUrl = "/contracts/fr/seller_contract.pdf";
    window.open(contractUrl, '_blank'); // Ouvre dans un nouvel onglet
    
    // Ou pour forcer le téléchargement :
    const link = document.createElement("a");
    link.href = contractUrl;
    link.download = "contrat-vendeur-dubon.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveToLocalStorage = (updatedData: SellerFormData) => {
    const dataToSave = {
      ...updatedData,
      contract: {
        signed: updatedData.contract.signed,
        signedDocument: updatedData.contract.signedDocument ? {
          name: updatedData.contract.signedDocument.name,
          url: updatedData.contract.signedDocument.file ? URL.createObjectURL(updatedData.contract.signedDocument.file) : undefined
        } : null
      }
    };
    localStorage.setItem('sellerFormData', JSON.stringify(dataToSave));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedData = {
        ...data,
        contract: {
          signed: true,
          signedDocument: {
            name: file.name,
            file: file,
            url: URL.createObjectURL(file)
          },
        },
      };
      onUpdate(updatedData);
      saveToLocalStorage(updatedData);
    }
  };

  const validateForm = () => {
    if (!data.contract.signedDocument) {
      setError("Veuillez téléverser le contrat signé");
      return false;
    }
    return true;
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
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Instructions de signature :</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Téléchargez le contrat de partenariat</li>
            <li>Lisez attentivement les termes et conditions</li>
            <li>Imprimez le document</li>
            <li>Signez physiquement aux endroits indiqués</li>
            <li>Scannez le document signé</li>
            <li>Téléversez le contrat signé au format PDF</li>
          </ol>
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadContract}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger le contrat
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contract">
            Contrat signé <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="contract"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById("contract")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {data.contract.signedDocument
                ? data.contract.signedDocument.name
                : "Téléverser le contrat signé"}
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
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