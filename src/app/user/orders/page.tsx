"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface Order {
  id: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/user/orders`, {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`
          }
        });
        
        if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
        
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          setOrders([]);
        }
      } catch (err: unknown) {
        setError((err as Error).message || "Une erreur est survenue");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Mes Commandes</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Vous n'avez pas encore de commandes</p>
            <Link href="/products">
              <Button className="mt-4">
                Découvrir nos produits
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "EN ATTENTE";
      case "processing":
        return "EN COURS";
      case "completed":
        return "TERMINÉE";
      case "cancelled":
        return "ANNULÉE";
      default:
        return String(status).toUpperCase();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes Commandes</h1>
        <p className="text-gray-500">Consultez et suivez vos commandes</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    COMMANDE
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    STATUT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    DATE
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    TOTAL
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.total.toLocaleString()} FCFA
                      <span className="text-gray-500 ml-2">
                        ({order.items?.length || 0} articles)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/user/orders/${order.id}`}>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                          Voir les détails <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
