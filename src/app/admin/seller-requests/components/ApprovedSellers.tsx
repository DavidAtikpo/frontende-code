"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/utils/config";
import { Eye, Store, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface ApprovedSeller {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  personalInfo: {
    fullName: string;
    companyName?: string;
    phone: string;
    address: string;
  };
  businessInfo: {
    category: string;
    description: string;
  };
  type: 'individual' | 'company';
  status: string;
  createdAt: string;
  profilePhoto?: string;
}

export function ApprovedSellers() {
  const [sellers, setSellers] = useState<ApprovedSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovedSellers = async () => {
      try {
      

        const response = await fetch(`${BASE_URL}/api/admin/approved-sellers`, {
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des vendeurs');
        }

        const data = await response.json();
        setSellers(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedSellers();
  }, []);

  if (loading) return <div>Chargement des vendeurs...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Vendeurs approuvés</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <Card key={seller._id} className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16">
                <Image
                  src={seller.profilePhoto || "/store-default.png"}
                  alt={seller.personalInfo.companyName || seller.personalInfo.fullName}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">
                  {seller.type === 'company' ? seller.personalInfo.companyName : seller.personalInfo.fullName}
                </h3>
                <p className="text-sm text-gray-500">{seller.businessInfo.category}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Store className="h-4 w-4 mr-2" />
                <span>{seller.type === 'company' ? 'Entreprise' : 'Individuel'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{seller.userId.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{seller.personalInfo.phone}</span>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Voir les détails
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 