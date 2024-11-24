"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Correct pour Next.js 13+
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const BASE_URL = "http://localhost:5000/api";

interface User {
  avatar?: string;
  displayName?: string;
  name?: string;
  email?: string;
  mobile?: string;
  region?: string;
  zipCode?: string;
}

export default function UserDetailPage() {
  const params = useParams(); // Récupère l'ID depuis l'URL
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/info${params.id}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement des informations utilisateur...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">Erreur : {error || "Utilisateur introuvable"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/users">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Paramètres de compte</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-1 p-6">
          <div className="flex flex-col items-center">
            <Image
              src={user.avatar || "/user-profile-svgrepo-com.svg"} // Image par défaut
              alt={user.name || "Utilisateur"}
              className="h-32 w-32 rounded-full object-cover"
            />
            <h2 className="mt-4 text-xl font-semibold">{user.displayName || "Nom inconnu"}</h2>
            <p className="text-gray-500">{user.name || "Non renseigné"}</p>
          </div>
        </Card>

        <Card className="col-span-2 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Nom affiché</label>
                  <p className="text-gray-900">{user.displayName || "Non renseigné"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Nom complet</label>
                  <p className="text-gray-900">{user.name || "Non renseigné"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-gray-900">{user.email || "Non renseigné"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <label className="text-sm text-gray-500">Téléphone</label>
                    <p className="text-gray-900">{user.mobile || "Non renseigné"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Localisation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Région</label>
                  <p className="text-gray-900">{user.region || "Non renseigné"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Code postal</label>
                  <p className="text-gray-900">{user.zipCode || "Non renseigné"}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
