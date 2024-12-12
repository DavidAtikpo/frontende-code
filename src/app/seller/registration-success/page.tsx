"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegistrationSuccess() {
  useEffect(() => {
    // Mettre à jour le statut du vendeur dans le contexte global
    // et/ou déclencher d'autres actions nécessaires
  }, []);

  return (
    <div className="container max-w-2xl mx-auto p-8">
      <div className="text-center space-y-6">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
        
        <h1 className="text-2xl font-bold text-gray-900">
          Félicitations ! Vous êtes maintenant un vendeur Dubon
        </h1>
        
        <p className="text-gray-600">
          Votre compte vendeur a été activé avec succès. Vous pouvez maintenant
          accéder à votre tableau de bord et commencer à vendre vos produits.
        </p>

        <div className="space-y-4 pt-6">
          <Link href="/seller/dashboard">
            <Button className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]">
              Accéder à mon tableau de bord
            </Button>
          </Link>
          
          <Link href="/seller/guide">
            <Button variant="outline" className="w-full">
              Consulter le guide du vendeur
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 