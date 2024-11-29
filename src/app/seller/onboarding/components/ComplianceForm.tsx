// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { SellerFormData } from "../page";
// // import { error } from "console";

// interface ComplianceFormProps {
//   data: SellerFormData;
//   onUpdate: (data: SellerFormData) => void;
//   onNext: () => void;
//   onBack: () => void;
//   isLastStep: boolean;
// }

// export function ComplianceForm({ 
//   data, 
//   onUpdate, 
//   onNext, 
//   onBack, 
//   isLastStep 
// }: ComplianceFormProps) {
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const handleCheckboxChange = (field: keyof SellerFormData["compliance"]) => {
//     onUpdate({
//       ...data,
//       compliance: {
//         ...data.compliance,
//         [field]: !data.compliance[field]
//       }
//     });
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
//     const { compliance } = data;

//     if (!compliance.termsAccepted) {
//       newErrors.terms = "Vous devez accepter les conditions d'utilisation";
//     }
//     if (!compliance.qualityStandardsAccepted) {
//       newErrors.quality = "Vous devez accepter les normes de qualité";
//     }
//     if (!compliance.antiCounterfeitingAccepted) {
//       newErrors.counterfeit = "Vous devez accepter la politique anti-contrefaçon";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       if (isLastStep) {
//         // Soumettre le formulaire complet
//         try {
//           const response = await fetch("/api/seller/register", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data),
//           });

//           if (!response.ok) {
//             throw new Error("Erreur lors de l'inscription");
//           }

//           // Redirection vers la page de succès
//           window.location.href = "/seller/registration-success";
//         } catch (error) {
//           setErrors({ submit: "Une erreur est survenue lors de l'inscription" });
//         }
//         console.log(error);
        
//       } else {
//         onNext();
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-4">
//         <div className="p-4 bg-gray-50 rounded-lg">
//           <h3 className="font-medium mb-4">Engagements légaux et conformité</h3>
          
//           <div className="space-y-4">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="terms"
//                 checked={data.compliance.termsAccepted}
//                 onCheckedChange={() => handleCheckboxChange("termsAccepted")}
//               />
//               <Label htmlFor="terms" className="text-sm leading-none">
//                 J&apos;accepte les conditions générales de vente et d&apos;utilisation de la plateforme
//               </Label>
//             </div>
//             {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="quality"
//                 checked={data.compliance.qualityStandardsAccepted}
//                 onCheckedChange={() => handleCheckboxChange("qualityStandardsAccepted")}
//               />
//               <Label htmlFor="quality" className="text-sm leading-none">
//                 Je m&apos;engage à respecter les normes de qualité imposées par la plateforme
//               </Label>
//             </div>
//             {errors.quality && <p className="text-sm text-red-500">{errors.quality}</p>}

//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="counterfeit"
//                 checked={data.compliance.antiCounterfeitingAccepted}
//                 onCheckedChange={() => handleCheckboxChange("antiCounterfeitingAccepted")}
//               />
//               <Label htmlFor="counterfeit" className="text-sm leading-none">
//                 Je m&apos;engage à respecter la politique anti-contrefaçon et anti-fraude
//               </Label>
//             </div>
//             {errors.counterfeit && <p className="text-sm text-red-500">{errors.counterfeit}</p>}
//           </div>
//         </div>

//         {errors.submit && (
//           <p className="text-sm text-red-500 text-center">{errors.submit}</p>
//         )}
//       </div>

//       <div className="flex justify-between">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onBack}
//         >
//           Retour
//         </Button>
//         <Button
//           type="submit"
//           className="bg-[#1D4ED8] hover:bg-[#1e40af]"
//         >
//           {isLastStep ? "Terminer l'inscription" : "Suivant"}
//         </Button>
//       </div>
//     </form>
//   );
// } 


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SellerFormData } from "../page";

const BASE_URL = "http://localhost:5000";

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
  
    if (isLastStep) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${BASE_URL}/api/seller/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error("Erreur lors de l'inscription");
        }
  
        // Affiche un message de succès et redirige
        setTimeout(() => {
          window.location.href = "/seller/registration-success";
        }, 1000);
      } catch {
        setErrors({ submit: "Une erreur est survenue lors de l'inscription" });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      onNext();
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
