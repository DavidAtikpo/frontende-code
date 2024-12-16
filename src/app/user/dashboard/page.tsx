"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { API_CONFIG } from '@/utils/config';
import { Skeleton } from "@/components/ui/skeleton";

const { BASE_URL } = API_CONFIG;

interface UserInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
  avatar: string;
}

interface PaymentStats {
  total: number;
  pending: number;
  completed: number;
}

const DEFAULT_AVATAR = '/user-profile-svgrepo-com (1).svg';
const DEFAULT_USER: UserInfo = {
  name: "Utilisateur",
  email: "utilisateur@example.com",
  address: "Adresse non renseignée",
  phone: "Numéro non renseigné",
  avatar: DEFAULT_AVATAR
};

const DEFAULT_STATS: PaymentStats = {
  total: 0,
  pending: 0,
  completed: 0
};

export default function UserDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo>(DEFAULT_USER);
  const [paymentStats, setPaymentStats] = useState<PaymentStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split(';')
          .find(c => c.trim().startsWith('token='))
          ?.split('=')[1];

        if (!token) {
          console.error('Token non trouvé');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${decodeURIComponent(token)}`,
          'Content-Type': 'application/json'
        };
        
        const options = {
          method: 'GET',
          headers,
          credentials: 'include' as RequestCredentials
        };
        
        const [userResponse, statsResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/user/info`, options),
          fetch(`${BASE_URL}/api/user/payment-stats`, options)
        ]);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserInfo(userData.user);
        } else {
          console.error('Erreur réponse user:', await userResponse.json());
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setPaymentStats(statsData);
        } else {
          console.error('Erreur réponse stats:', await statsResponse.json());
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info du compte */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">INFO DU COMPTE</h2>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200">
              {loading ? (
                <Skeleton className="w-full h-full rounded-full" />
              ) : (
                <Image 
                  src={userInfo.avatar || DEFAULT_AVATAR}
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                  width={100}
                  height={100}
                />
              )}
            </div>
            <div className="flex-1">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              ) : (
                <>
                  <h3 className="font-bold">{userInfo.name}</h3>
                  <p className="text-sm text-gray-500">{userInfo.address}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Email: {userInfo.email}</p>
                    <p>Téléphone: {userInfo.phone}</p>
                  </div>
                </>
              )}
              <Link href="/user/settings">
                <Button variant="outline" size="sm" className="mt-3">
                  MODIFIER LE COMPTE
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Statistiques */}
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              Array(3).fill(null).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              ))
            ) : (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {paymentStats.total}
                  </div>
                  <p className="text-sm text-gray-500">Paiements totaux</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {paymentStats.pending}
                  </div>
                  <p className="text-sm text-gray-500">En attente</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {paymentStats.completed}
                  </div>
                  <p className="text-sm text-gray-500">Achevées</p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 