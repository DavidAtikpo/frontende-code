"use client";

import { useState, useEffect } from "react";
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const { BASE_URL } = API_CONFIG;

interface Payment {
  id: string;
  orderNumber: string;
  status: "IN PROGRESS" | "COMPLETED" | "CANCELED";
  date: string;
  total: number;
  productsCount: number;
}

export default function PaymentsHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = getCookie('token');
        
        const response = await fetch(`${BASE_URL}/api/user/payments`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des paiements');
        }

        const data = await response.json();
        setPayments(data.payments);
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des paiements",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN PROGRESS": return "text-blue-600";
      case "COMPLETED": return "text-green-600";
      case "CANCELED": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Link href="/user/dashboard">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Historique des paiements</h1>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  NUMÉRO DE COMMANDE
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  STATUT
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  DATE
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  TOTAL
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{payment.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(payment.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${payment.total.toLocaleString()} ({payment.productsCount} Produits)
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link 
                      href={`/user/payments/${payment.id}`}
                      className="text-blue-600 hover:text-blue-900 font-medium inline-flex items-center"
                    >
                      Voir Détails
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
