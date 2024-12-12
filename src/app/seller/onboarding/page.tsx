"use client";

import React, { useState, FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { PersonalInfoForm } from "./components/PersonalInfoForm";
import { DocumentUploadForm } from "./components/DocumentUploadForm";
import { ContractSigningForm } from "./components/ContractSigningForm";
import { VideoVerificationForm } from "./components/VideoVerificationForm";
import { BusinessInfoForm } from "./components/BusinessInfoForm";
import { ComplianceForm } from "./components/ComplianceForm";
import { ValidationStatusForm } from "./components/ValidationStatusForm";
import { SubscriptionPlanForm } from "./components/SubscriptionPlanForm";
import { PaymentForm } from "./components/PaymentForm";

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
  },
  {
    title: "Choix de l'abonnement",
    component: SubscriptionPlanForm,
  },
  {
    title: "Paiement",
    component: PaymentForm,
  }
];

export default function SellerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SellerFormData>({
    type: "individual",
    personalInfo: {
      fullName: "",
      companyName: "",
      address: "",
      phone: "",
      email: "",
      idNumber: "",
      taxNumber: "",
      legalRepName: "",
      rccmNumber: "",
    },
    documents: {
      idCard: null,
      proofOfAddress: null,
      photos: [],
      taxCertificate: null,
      rccm: null,
      companyStatutes: null,
    },
    contract: {
      signed: false,
      signedDocument: null,
    },
    videoVerification: {
      completed: false,
      recordingUrl: "",
    },
    businessInfo: {
      category: "",
      description: "",
      products: [],
      bankDetails: {
        type: "bank",
        accountNumber: "",
        bankName: "",
      },
      returnPolicy: "",
    },
    compliance: {
      termsAccepted: false,
      qualityStandardsAccepted: false,
      antiCounterfeitingAccepted: false,
    },
    validation: {
      status: 'pending',
    },
  });

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
    <div className="container max-w-4xl mx-auto p-2">
      <Card>
        <CardContent className="pt-6">
          {/* Stepper */}
          <Stepper 
            steps={steps.map((s) => s.title)}
            currentStep={currentStep}
            onStepClick={(stepIndex) => {
              if (stepIndex >= 0 && stepIndex < steps.length) {
                setCurrentStep(stepIndex);
              }
            }}
          />

          {/* Composant de l'étape actuelle */}
          <div className="mt-8">
            {React.createElement(currentStepComponent, {
              data: formData,
              onUpdate: setFormData,
              onNext: () => setCurrentStep((prev) => prev + 1),
              onBack: () => setCurrentStep((prev) => prev - 1),
              isFirstStep: currentStep === 0,
              isLastStep: currentStep === steps.length - 1,
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
