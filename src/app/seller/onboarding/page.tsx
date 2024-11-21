"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BASE_URL = "http://localhost:5000/api";

interface SellerFormData {
  businessName: string;
  registrationNumber: string;
  taxNumber: string;
  address: string;
  phone: string;
  description: string;
  documents: {
    businessRegistration: File | null;
    taxCertificate: File | null;
    idDocument: File | null;
    bankDetails: File | null;
  };
}

export default function SellerOnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SellerFormData>({
    businessName: "",
    registrationNumber: "",
    taxNumber: "",
    address: "",
    phone: "",
    description: "",
    documents: {
      businessRegistration: null,
      taxCertificate: null,
      idDocument: null,
      bankDetails: null,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: keyof SellerFormData["documents"]) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        documents: {
          ...formData.documents,
          [docType]: e.target.files[0],
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "documents") {
        formDataToSend.append(key, value);
      }
    });

    Object.entries(formData.documents).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(`documents.${key}`, file);
      }
    });

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/seller/onboarding`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Une erreur est survenue.");
      }

      setSuccess("Votre demande a été soumise avec succès et est en cours d'examen.");
      setTimeout(() => {
        router.push("/user/dashboard");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto p-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Devenir vendeur</h1>
            <p className="text-sm text-gray-500 mt-2">
              Veuillez fournir les informations et documents requis pour votre vérification
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Champs similaires au formulaire d'inscription (références : startLine: 79, endLine: 99) */}
              </div>
            </div>

            {/* Documents requis */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Documents requis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.documents).map(([key, file]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>
                      {key.replace(/([A-Z])/g, " $1").trim()}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id={key}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, key as keyof SellerFormData["documents"])}
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById(key)?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {file ? file.name : "Choisir un fichier"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-600">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]"
              disabled={isLoading}
            >
              {isLoading ? "Soumission en cours..." : "SOUMETTRE LA DEMANDE"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 