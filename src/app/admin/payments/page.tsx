"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading";

import { CreditCard, DollarSign, AlertCircle } from 'lucide-react';
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  transactionId: string;
  createdAt: string;
  order: {
    orderNumber: string;
    user: {
      name: string;
    }
  };
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/payments`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'mobile_money':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des paiements</h1>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.transactionId}</TableCell>
                <TableCell>{payment.order.orderNumber}</TableCell>
                <TableCell>{payment.order.user.name}</TableCell>
                <TableCell>
                  {payment.amount.toLocaleString()} {payment.currency}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getMethodIcon(payment.method)}
                    {payment.method}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(payment.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 