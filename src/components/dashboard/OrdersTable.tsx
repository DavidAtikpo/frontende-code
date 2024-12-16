"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
}

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function OrdersTable({
  orders,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: OrdersTableProps) {
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

  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Commande</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
              <TableCell>{order.total.toLocaleString()} FCFA</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Détails
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-4">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
} 