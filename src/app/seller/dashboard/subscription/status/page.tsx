"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function SubscriptionStatus() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStatus(params.get('status'));
  }, []);

  useEffect(() => {
    if (status === 'approved') {
      // Redirect to the dashboard after 5 seconds
      const timer = setTimeout(() => {
        router.push('/seller/dashboard');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="p-6 text-center">
        {status === 'approved' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Paiement réussi !
            </h2>
            <p className="text-gray-600 mb-4">
              Votre abonnement a été activé avec succès. Vous allez être redirigé...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">
              Échec du paiement
            </h2>
            <p className="text-gray-600 mb-4">
              Une erreur s'est produite lors du traitement de votre paiement.
            </p>
            <Button onClick={() => router.push('/seller/dashboard/subscription')}>
              Réessayer
            </Button>
          </>
        )}

        {status === 'pending' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              Traitement en cours
            </h2>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous traitons votre paiement...
            </p>
          </>
        )}
      </Card>
    </div>
  );
} 