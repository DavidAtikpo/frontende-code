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

interface Sale {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

interface RecentSalesTableProps {
  sales: Sale[];
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>
              <div>
                <div className="font-medium">{sale.customer.name}</div>
                <div className="text-sm text-gray-500">{sale.customer.email}</div>
              </div>
            </TableCell>
            <TableCell>{sale.amount.toLocaleString()} FCFA</TableCell>
            <TableCell>
              <Badge variant={sale.status === 'completed' ? 'success' : 'destructive'}>
                {sale.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(sale.date)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 