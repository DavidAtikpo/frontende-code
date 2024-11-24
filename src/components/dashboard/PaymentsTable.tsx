"use client";

import { useState } from "react";
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
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaymentsTableProps {
  status: "all" | "pending" | "completed" | "failed";
  dateRange: { from: Date | undefined; to: Date | undefined };
  showFilters: boolean;
}

export function PaymentsTable({ }: PaymentsTableProps) {
  const [payments] = useState([
    {
      id: "PAY-001",
      date: "2024-03-15",
      customer: "John Doe",
      amount: "150,000",
      method: "Mobile Money",
      status: "completed",
    },
    {
      id: "PAY-002",
      date: "2024-03-14",
      customer: "Jane Smith",
      amount: "75,000",
      method: "Carte bancaire",
      status: "pending",
    },
    // ... autres paiements
  ]);

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Transaction</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Méthode</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.customer}</TableCell>
              <TableCell>{payment.amount} FCFA</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell>
                <Badge className={getStatusBadge(payment.status)}>
                  {payment.status === "completed" && "Complété"}
                  {payment.status === "pending" && "En attente"}
                  {payment.status === "failed" && "Échoué"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir les détails
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}