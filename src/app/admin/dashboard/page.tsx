"use client";

import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bienvenue, Admin !</h1>
          <p className="text-gray-500">Bienvenue dans votre tableau de bord</p>
        </div>
        <button className="text-blue-600 hover:text-blue-800">
          Ajouter Carte →
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold"> </p>
              <p className="text-sm text-gray-500">Paiements totaux</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Ajoutez les autres cartes statistiques ici */}
      </div>

      {/* Section Informations du compte */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">INFO DU COMPTE</h2>
          {/* Contenu des informations du compte */}
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">ADRESSE DE LIVRAISON</h2>
          {/* Contenu de l'adresse de livraison */}
        </div>
      </div>
    </div>
  );
} 