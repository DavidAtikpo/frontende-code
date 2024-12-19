"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "inactive";
  lastOrder?: string;
}

interface CustomersTableProps {
  data: CustomerData[];
  isLoading: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function CustomersTable({ 
  data, 
  isLoading, 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}: CustomersTableProps) {
  const getStatusVariant = (status: CustomerData["status"]) => {
    return status === "active" ? "success" : "secondary";
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des clients...</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Commandes</TableHead>
            <TableHead>Total dépensé</TableHead>
            <TableHead>Dernière commande</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm">{customer.email}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </div>
              </TableCell>
              <TableCell>{customer.totalOrders}</TableCell>
              <TableCell>{customer.totalSpent}€</TableCell>
              <TableCell>{formatDate(customer.lastOrderDate)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(customer.status)}>
                  {customer.status === "active" ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = `/seller/dashboard/customers/${customer.id}`}
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
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1 || !onPageChange}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages || !onPageChange}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 