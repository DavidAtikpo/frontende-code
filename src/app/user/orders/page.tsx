"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

interface Order {
  id: string;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  date: string;
  total: number;
  productsCount: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/user/orders`);
        if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
        const data = await response.json();
        setOrders(data);
      } catch (err: unknown) {
        setError((err as Error).message || "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [error]);

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

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "IN_PROGRESS":
        return "EN COURS";
      case "COMPLETED":
        return "TERMINÉE";
      case "CANCELED":
        return "ANNULÉE";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historique des commandes</h1>
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
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${order.total} ({order.productsCount} Produits)
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

          <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
            <Button variant="outline" className="w-8 h-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? "default" : "ghost"}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button variant="outline" className="w-8 h-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
