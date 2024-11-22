"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "in_progress" | "completed" | "canceled";
  products: number;
  customer: string;
}

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function OrdersTable({ orders, isLoading, currentPage, totalPages, onPageChange }: OrdersTableProps) {
  const getStatusVariant = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "warning";
      case "canceled":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "Terminée";
      case "in_progress":
        return "En cours";
      case "canceled":
        return "Annulée";
      default:
        return status;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des commandes...</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Commande</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Produits</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell>{formatDate(order.date)}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.total}€</TableCell>
              <TableCell>{order.products} produit(s)</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-100"
                  onClick={() => window.location.href = `/seller/dashboard/orders/${order.id}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-4">
        <div className="text-sm text-gray-500">
          Page {currentPage} sur {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 