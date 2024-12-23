"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Order {
  id: string;
  orderNumber: string;
  status: "IN PROGRESS" | "COMPLETED" | "CANCELED";
  date: string;
  total: number;
  productsCount: number;
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN PROGRESS": return "text-blue-600";
      case "COMPLETED": return "text-green-600";
      case "CANCELED": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">HISTORIQUE DES COMMANDES</h1>

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
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${order.total.toLocaleString()} ({order.productsCount} Produits)
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Voir Détails →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(page)}
            >
              {page.toString().padStart(2, '0')}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
} 