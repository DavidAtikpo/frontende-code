"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { PersonalInfoForm } from "./components/PersonalInfoForm";
import { DocumentUploadForm } from "./components/DocumentUploadForm";
import { ContractSigningForm } from "./components/ContractSigningForm";
import { VideoVerificationForm } from "./components/VideoVerificationForm";
import { BusinessInfoForm } from "./components/BusinessInfoForm";
import { ComplianceForm } from "./components/ComplianceForm";

interface SellerFormData {
  type: "individual" | "company";
  personalInfo: {
    fullName?: string;
    companyName?: string;
    address: string;
    phone: string;
    email: string;
    idNumber?: string;
    taxNumber: string;
    legalRepName?: string;
    rccmNumber?: string;
  };
  documents: {
    idCard: File | null;
    proofOfAddress: File | null;
    photos: File[];
    taxCertificate: File | null;
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
}

export default function SellerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SellerFormData>({
    // ... initialisation des données
  });

  const steps = [
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
  ];

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card>
        <CardContent className="pt-6">
          <Stepper
            steps={steps.map(s => s.title)}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
          
          <div className="mt-8">
            {React.createElement(steps[currentStep].component, {
              data: formData,
              onUpdate: setFormData,
              onNext: () => setCurrentStep(prev => prev + 1),
              onBack: () => setCurrentStep(prev => prev - 1),
              isFirstStep: currentStep === 0,
              isLastStep: currentStep === steps.length - 1,
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 