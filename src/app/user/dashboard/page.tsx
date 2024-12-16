"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface PaymentStats {
  total: number;
  pending: number;
  completed: number;
}

export default function UserDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        const [userResponse, statsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/info`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/payment-stats`, { headers })
        ]);

        if (!userResponse.ok || !statsResponse.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const userData = await userResponse.json();
        const statsData = await statsResponse.json();

        setUserInfo(userData.user);
        setPaymentStats(statsData);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="container mx-auto p-6">Chargement...</div>;
  if (error) return <div className="container mx-auto p-6 text-red-500">{error}</div>;
  if (!userInfo || !paymentStats) return <div className="container mx-auto p-6">Aucune donnée disponible</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info du compte */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">INFO DU COMPTE</h2>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="flex-1">
              <h3 className="font-bold">{userInfo.name}</h3>
              <p className="text-sm text-gray-500">{userInfo.address}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p>Email: {userInfo.email}</p>
                <p>Téléphone: {userInfo.phone}</p>
              </div>
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
          </div>
        </Card>
      </div>
    </div>
  );
} 