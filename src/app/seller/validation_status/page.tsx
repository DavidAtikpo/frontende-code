"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ValidationStatus() {
  const router = useRouter();

  useEffect(() => {
    // Fetch or determine the validation status
    const status = localStorage.getItem('validationStatus');
    console.log("Validation Status:", status);

    if (status === 'approved') {
      // Redirect to the seller dashboard if approved
      router.push('/seller/dashboard');
    }
  }, [router]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Statut de validation</h2>
      <p className="text-gray-600 mb-4">
        Votre demande est en cours d'examen. Nous vous notifierons dès que la vérification sera terminée.
      </p>
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
} 