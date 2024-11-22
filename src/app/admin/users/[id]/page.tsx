"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  if (isLoading) return <div>Chargement...</div>;
  if (!user) return <div>Utilisateur non trouvé</div>;

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
            <img 
              src={user.avatar} 
              alt={user.name}
              className="h-32 w-32 rounded-full object-cover"
            />
            <h2 className="mt-4 text-xl font-semibold">{user.displayName}</h2>
            <p className="text-gray-500">{user.name}</p>
          </div>
        </Card>

        <Card className="col-span-2 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Nom affiché</label>
                  <p className="text-gray-900">{user.displayName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Nom complet</label>
                  <p className="text-gray-900">{user.name}</p>
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
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <label className="text-sm text-gray-500">Téléphone</label>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Localisation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Région</label>
                  <p className="text-gray-900">{user.region}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Code postal</label>
                  <p className="text-gray-900">{user.zipCode}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 