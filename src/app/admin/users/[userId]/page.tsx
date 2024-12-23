"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";

interface User {
  avatar?: string;
  displayName?: string;
  name?: string;
  email?: string;
  mobile?: string;
  region?: string;
  zipCode?: string;
  role?: string;
  status?: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const adminToken = getCookie('token');

        const response = await fetch(`${BASE_URL}/api/admin/users/${params.userId}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des détails utilisateur");
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        } else {
          throw new Error(data.message || "Erreur lors du chargement des détails utilisateur");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.userId) {
      fetchUser();
    }
  }, [params.userId]);

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
              src={user.avatar || "/user-profile-svgrepo-com.svg"}
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
                  <label className="text-sm text-gray-500">Nom</label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Statut</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Rôle</label>
                  <p className="text-gray-900">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">État</label>
                  <p className="text-gray-900">{user.status}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
