"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import Link from "next/link";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const { BASE_URL } = API_CONFIG;

interface User {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
  sellerProfile?: {
    id: string;
    storeName: string;
    description: string;
    businessInfo: {
      type: string;
      address: string;
    };
    subscription?: {
      id: string;
      status: string;
      expiresAt: string;
    };
  };
}

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const adminToken = getCookie('token');
        if (!adminToken) {
          throw new Error("Token d'authentification manquant");
        }

        const response = await fetch(`${BASE_URL}/api/admin/users/${params.id}`, {
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
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600">Erreur : {error || "Utilisateur introuvable"}</p>
        <Link href="/admin/users">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/users">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Détails de l'utilisateur</h1>
        </div>
        <Badge className={getStatusColor(user.status || 'unknown')}>
          {user.status}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="seller" disabled={user.role !== 'seller'}>
            Info Vendeur
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex flex-col items-center">
                <UserAvatar
                  name={user.name || "Utilisateur"}
                  avatarUrl={user.avatar}
                  className="w-32 h-32"
                />
                <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                <Badge className="mt-2">{user.role}</Badge>
              </div>
            </Card>

            <Card className="md:col-span-2 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Téléphone</label>
                      <p className="text-gray-900">{user.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Inscription</label>
                      <p className="text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {user.lastLogin && (
                      <div>
                        <label className="text-sm text-gray-500">Dernière connexion</label>
                        <p className="text-gray-900">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seller" className="mt-6">
          {user.sellerProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Informations commerciales</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Nom commercial</label>
                    <p className="text-gray-900">{user.sellerProfile.storeName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Type d'activité</label>
                    <p className="text-gray-900">{user.sellerProfile.businessInfo?.type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Description</label>
                    <p className="text-gray-900">{user.sellerProfile.description}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Adresse</label>
                    <p className="text-gray-900">{user.sellerProfile.businessInfo?.address}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Abonnement</h3>
                <div className="space-y-4">
                  {user.sellerProfile.subscription ? (
                    <>
                      <div>
                        <label className="text-sm text-gray-500">Statut</label>
                        <Badge className={getStatusColor(user.sellerProfile.subscription.status)}>
                          {user.sellerProfile.subscription.status}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Expire le</label>
                        <p className="text-gray-900">
                          {new Date(user.sellerProfile.subscription.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">Aucun abonnement actif</p>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune information vendeur disponible</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 