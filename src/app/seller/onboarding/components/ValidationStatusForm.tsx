"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { SellerFormData } from "../page";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const ValidationStatusForm: React.FC<{
  data: SellerFormData;
  onUpdate: (data: SellerFormData) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/seller/validation-status/${data._id}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement du statut');
        }
        const result = await response.json();
        setStatus(result.status);
        setMessage(result.message || "");
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialStatus();
  }, [data._id]);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/seller/validation-status/${data._id}`);
        const result = await response.json();
        
        if (result.success) {
          setStatus(result.status);
          setMessage(result.message || "");
          
          if (result.status === 'approved') {
            onUpdate({
              ...data,
              validation: {
                status: 'approved',
                message: result.message
              }
            });
            onNext();
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut:", error);
        setMessage("Erreur lors de la vérification du statut");
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [data, data._id, onNext, onUpdate]);

  const getStatusDisplay = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-16 w-16 text-yellow-500" />,
          title: "En attente de validation",
          description: "Votre dossier est en cours d'examen par notre équipe."
        };
      case 'approved':
        return {
          icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
          title: "Dossier approuvé",
          description: "Félicitations ! Votre inscription a été validée."
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: "Dossier rejeté",
          description: message || "Votre dossier n'a pas été approuvé."
        };
      default:
        return {
          icon: <Clock className="h-16 w-16 text-gray-500" />,
          title: "Vérification en cours",
          description: "Veuillez patienter..."
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="space-y-6">
      <div className="p-8 bg-white rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          {statusInfo.icon}
          <h2 className="text-xl font-semibold text-gray-900">{statusInfo.title}</h2>
          <p className="text-gray-600 text-center max-w-md">{statusInfo.description}</p>
          
          {status === 'pending' && (
            <div className="animate-pulse mt-4">
              <div className="h-2 bg-gray-200 rounded w-48"></div>
            </div>
          )}
          
          {message && status === 'rejected' && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
        >
          Retour
        </Button>
        {status === 'approved' && (
          <Button
            onClick={onNext}
            className="bg-[#1D4ED8] hover:bg-[#1e40af]"
          >
            Continuer
          </Button>
        )}
      </div>
    </div>
  );
}; 