"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Clock, MapPin, Settings, LogOut } from "lucide-react";

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
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "Kevin Gilbert",
    email: "kevin.gilbert@gmail.com",
    address: "East Tejturi Bazar, Word No: 04, Road No: 50...",
    phone: "+1-202-555-0118"
  });

  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    total: 154,
    pending: 5,
    completed: 149
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

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