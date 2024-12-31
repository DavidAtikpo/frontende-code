"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import { 
  FaMoneyBillWave,
  FaDownload,
  FaExclamationCircle,
  FaCheckCircle,
  FaWallet
} from 'react-icons/fa';

const { BASE_URL } = API_CONFIG;

interface Transaction {
  id: string;
  type: 'service' | 'event' | 'formation';
  itemName: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  customer: {
    name: string;
    email: string;
  };
  paymentMethod: string;
  createdAt: string;
  paidAt?: string;
}

interface PaymentStats {
  totalRevenue: number;
  pendingAmount: number;
  availableBalance: number;
  monthlyRevenue: number;
  transactionCount: number;
  refundCount: number;
}

export default function SellerPayments() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'

  const columns = [
    {
      accessorKey: "details",
      header: "Détails",
      cell: ({ row }: { row: { original: Transaction } }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.original.itemName}</p>
          <Badge>{row.original.type}</Badge>
          <p className="text-sm text-gray-500">
            {row.original.customer.name}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }: { row: { original: Transaction } }) => (
        <div className="space-y-1">
          <p className="font-medium">
            {row.original.amount.toLocaleString()} FCFA
          </p>
          <p className="text-sm text-gray-500">
            Net: {row.original.netAmount.toLocaleString()} FCFA
          </p>
          <p className="text-xs text-gray-400">
            Frais: {row.original.fee.toLocaleString()} FCFA
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: { row: { original: Transaction } }) => {
        const status = row.original.status;
        const colors: Record<Transaction['status'], string> = {
          pending: "bg-yellow-100 text-yellow-800",
          completed: "bg-green-100 text-green-800",
          failed: "bg-red-100 text-red-800",
          refunded: "bg-gray-100 text-gray-800"
        };
        return (
          <div className="space-y-1">
            <Badge className={colors[status]}>
              {status}
            </Badge>
            <p className="text-sm text-gray-500">
              {row.original.paymentMethod}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "dates",
      header: "Dates",
      cell: ({ row }: { row: { original: Transaction } }) => (
        <div className="space-y-1">
          <p className="text-sm">
            Créé le: {new Date(row.original.createdAt).toLocaleDateString()}
          </p>
          {row.original.paidAt && (
            <p className="text-sm text-gray-500">
              Payé le: {new Date(row.original.paidAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ),
    }
  ];

  useEffect(() => {
    fetchPaymentData();
  }, [dateRange]);

  const fetchPaymentData = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/payments?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des paiements');
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setStats(data.stats);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(
        `${BASE_URL}/api/seller/payments/report?range=${dateRange}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-paiements-${dateRange}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du téléchargement du rapport');
    }
  };

  if (loading || !stats) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Paiements & Transactions</h1>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded ${
                  dateRange === range 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <Button onClick={handleDownloadReport}>
            <FaDownload className="mr-2" />
            Télécharger le rapport
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Revenu total
                </p>
                <p className="text-2xl font-bold">
                  {stats.totalRevenue.toLocaleString()} FCFA
                </p>
              </div>
              <FaMoneyBillWave className="text-2xl text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Solde disponible
                </p>
                <p className="text-2xl font-bold">
                  {stats.availableBalance.toLocaleString()} FCFA
                </p>
              </div>
              <FaWallet className="text-2xl text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  En attente
                </p>
                <p className="text-2xl font-bold">
                  {stats.pendingAmount.toLocaleString()} FCFA
                </p>
              </div>
              <FaExclamationCircle className="text-2xl text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            searchKey="itemName"
          />
        </CardContent>
      </Card>
    </div>
  );
} 