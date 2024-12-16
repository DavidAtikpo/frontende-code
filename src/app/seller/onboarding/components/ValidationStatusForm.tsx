"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getApiUrl } from '@/utils/api';

const BASE_URL = getApiUrl();

interface ValidationStatusFormProps {
  onNext: () => void;
  onBack: () => void;
}

export const ValidationStatusForm = ({ onNext, onBack }: ValidationStatusFormProps) => {
  const [status, setStatus] = useState<string>("pending");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkValidationStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Token:', token);
      
      if (!token) {
        console.error("Token manquant");
        router.replace('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/seller/validation-status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Réponse du serveur:', data);
      
      if (data.success) {
        setStatus(data.status);
        setMessage(data.message || '');
        
        if (data.status === 'approved') {
          // Activer l'essai gratuit automatiquement
          const trialResponse = await fetch(`${BASE_URL}/api/seller/start-trial`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (trialResponse.ok) {
            router.replace('/seller/dashboard');
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkValidationStatus();
  }, [checkValidationStatus]);

  const getStatusDisplay = () => {
    console.log('Status actuel:', status);

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
      case 'not_found':
        return {
          icon: <Clock className="h-16 w-16 text-blue-500" />,
          title: "Aucune demande trouvée",
          description: "Vous n'avez pas encore soumis de demande de vendeur."
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

  // Fonction pour arrêter la caméra
  const stopCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      })
      .catch(err => console.log("Erreur lors de l'arrêt de la caméra:", err));
  };

  // Appeler stopCamera lors du démontage du composant
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Appeler stopCamera lors du retour ou de la continuation
  const handleBack = () => {
    stopCamera();
    onBack();
  };

  const handleNext = () => {
    stopCamera();
    onNext();
  };

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
          onClick={handleBack}
          disabled={isLoading}
        >
          Retour
        </Button>
        {status === 'approved' && (
          <Button
            onClick={handleNext}
            className="bg-[#1D4ED8] hover:bg-[#1e40af]"
          >
            Continuer
          </Button>
        )}
      </div>
    </div>
  );
}; 