"use client";

import React, { useState, FC, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { PersonalInfoForm } from "./components/PersonalInfoForm";
import { DocumentUploadForm } from "./components/DocumentUploadForm";
import { ContractSigningForm } from "./components/ContractSigningForm";
import { VideoVerificationForm } from "./components/VideoVerificationForm";
import { BusinessInfoForm } from "./components/BusinessInfoForm";
import { ComplianceForm } from "./components/ComplianceForm";
import { ValidationStatusForm } from "./components/ValidationStatusForm";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface SellerFormData {
  _id?: string;
  type: 'individual' | 'company';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    companyName?: string;
    idNumber?: string;
    taxNumber: string;
    legalRepName?: string;
    rccmNumber?: string;
  };
  documents: {
    idCard: File | null;
    proofOfAddress: File | null;
    taxCertificate: File | null;
    photos: File[];
    rccm?: File | null;
    companyStatutes?: File | null;
  };
  contract: {
    signed: boolean;
    signedDocument: File | null;
  };
  videoVerification: {
    completed: boolean;
    recordingUrl?: string;
  };
  businessInfo: {
    category: string;
    description: string;
    products: Array<{
      name: string;
      description: string;
      price: number;
      images: File[];
    }>;
    bankDetails: {
      type: "bank" | "mobile";
      accountNumber: string;
      bankName?: string;
    };
    returnPolicy: string;
  };
  compliance: {
    termsAccepted: boolean;
    qualityStandardsAccepted: boolean;
    antiCounterfeitingAccepted: boolean;
  };
  validation?: {
    status?: string;
    message?: string;
  };
  subscription?: {
    plan: 'monthly' | 'yearly' | 'premium';
    price: number;
    startDate?: string;
    endDate?: string;
  };
  payment?: {
    method: 'mobile_money' | 'card' | 'bank_transfer';
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
    amount: number;
  };
}

// Type des étapes
interface Step {
  title: string;
  component: FC<{
    data: SellerFormData;
    onUpdate: (data: SellerFormData) => void;
    onNext: () => void;
    onBack: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
  }>;
}

// Tableau des étapes
const steps: Step[] = [
  {
    title: "Informations personnelles",
    component: PersonalInfoForm,
  },
  {
    title: "Documents requis",
    component: DocumentUploadForm,
  },
  {
    title: "Signature du contrat",
    component: ContractSigningForm,
  },
  {
    title: "Vérification vidéo",
    component: VideoVerificationForm,
  },
  {
    title: "Informations commerciales",
    component: BusinessInfoForm,
  },
  {
    title: "Conformité",
    component: ComplianceForm,
  },
  {
    title: "Validation administrative",
    component: ValidationStatusForm,
  }
];

export default function SellerOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('sellerCurrentStep') || '0');
    }
    return 0;
  });

  // Modifier l'état initial de formData
  const [formData, setFormData] = useState<SellerFormData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('sellerFormData');
      if (savedData) {
        return JSON.parse(savedData);
      }
    }
    return {
      type: "individual",
      personalInfo: {},
      documents: { photos: [] },
      videoVerification: { completed: false },
      contract: { signed: false },
      businessInfo: {
        products: [],
        bankDetails: {},
      },
      compliance: {},
      validation: { status: "not_started" }
    };
  });

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.replace('/login');
          return;
        }

        const response = await fetch(`${BASE_URL}/api/seller/validation-status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          if (data.status === 'approved') {
            router.replace('/seller/dashboard');
          } else if (data.status === 'pending') {
            setFormData(prev => ({
              ...prev,
              validation: { status: 'pending' }
            }));
            setCurrentStep(6);
            localStorage.setItem('sellerCurrentStep', '6');
          } else {
            // Si pas de demande ou nouvelle demande
            setFormData(prev => ({
              ...prev,
              validation: { status: 'not_started' }
            }));
            setCurrentStep(0);
            localStorage.setItem('sellerCurrentStep', '0');
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    loadSavedData();
  }, [router]);

  // Sauvegarder les données à chaque modification
  useEffect(() => {
    localStorage.setItem('sellerFormData', JSON.stringify(formData));
    localStorage.setItem('sellerCurrentStep', currentStep.toString());
  }, [formData, currentStep]);

  // Modifier la fonction handleStepChange
  const handleStepChange = (newStep: number) => {
    if (newStep >= 0 && newStep < steps.length) {
      // Vérifier le statut actuel
      const currentStatus = formData.validation?.status || 'not_started';

      if (currentStatus === 'not_started') {
        // Permettre la navigation normale pour une nouvelle demande
        if (currentStep > newStep) {
          setCurrentStep(newStep);
        } else if (newStep - currentStep === 1) {
          setCurrentStep(newStep);
        }
      }
      
      localStorage.setItem('sellerCurrentStep', newStep.toString());
    }
  };

  // Valider que l'étape actuelle existe
  const currentStepComponent = steps[currentStep]?.component;

  if (!currentStepComponent) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Card>
          <CardContent>
            <p className="text-red-600 font-bold">
              Une erreur s&apos;est produite. L&apos;étape sélectionnée est invalide.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-center text-gray-900">
                Devenir vendeur
              </h1>
              <p className="mt-2 text-center text-gray-600">
                Complétez les étapes suivantes pour commencer à vendre
              </p>
            </div>

            <div className="hidden sm:block mb-8">
              <Stepper 
                steps={steps.map((s) => s.title)}
                currentStep={currentStep}
                onStepClick={handleStepChange}
              />
            </div>

            <div className="sm:hidden mb-4">
              <p className="text-sm font-medium text-gray-700">
                Étape {currentStep + 1} sur {steps.length}:
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {steps[currentStep].title}
              </p>
            </div>

            <div className="mt-8">
              {React.createElement(currentStepComponent, {
                data: formData,
                onUpdate: setFormData,
                onNext: () => handleStepChange(currentStep + 1),
                onBack: () => handleStepChange(currentStep - 1),
                isFirstStep: currentStep === 0,
                isLastStep: currentStep === steps.length - 1,
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
