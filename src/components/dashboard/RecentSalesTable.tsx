"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Sale {
  id: string;
  product: string;
  customer: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
}

export function RecentSalesTable() {
  const recentSales: Sale[] = [
    {
      id: "1",
      product: "iPhone 13 Pro",
      customer: "Jean Dupont",
      date: "2024-03-15",
      amount: 1299,
      status: "completed",
    },
    // Ajoutez d'autres ventes ici
  ];

  const getStatusVariant = (status: Sale["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produit</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentSales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{sale.product}</TableCell>
            <TableCell>{sale.customer}</TableCell>
            <TableCell>{formatDate(sale.date)}</TableCell>
            <TableCell>{sale.amount}€</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(sale.status)}>
                {sale.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 