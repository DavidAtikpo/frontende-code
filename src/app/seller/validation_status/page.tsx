"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";
const { BASE_URL } = API_CONFIG;

export default function ValidationStatus() {
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    const checkValidationStatus = async () => {
      const token = getCookie('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/seller/validation-status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Erreur de vérification du statut');
        }

        const data = await response.json();
        if (data.success) {
          setStatus(data.status);
          if (data.status === 'approved') {
            router.push('/seller/dashboard');
          }
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors de la vérification du statut");
      }
    };

    checkValidationStatus();
  }, [router]);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Statut de validation</h2>
            
            {status === 'pending' && (
              <>
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <p className="text-gray-600">
                    Votre demande est en cours d'examen. Nous vous notifierons dès que la vérification sera terminée.
                  </p>
                </div>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/user/dashboard')}
                  >
                    Retourner au tableau de bord utilisateur
                  </Button>
                </div>
              </>
            )}

            {status === 'rejected' && (
              <>
                <p className="text-red-600">
                  Votre demande a été rejetée. Veuillez vérifier vos informations dans vos emails box et réessayer.
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => router.push('/seller/onboarding')}
                  >
                    Soumettre une nouvelle demande
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 