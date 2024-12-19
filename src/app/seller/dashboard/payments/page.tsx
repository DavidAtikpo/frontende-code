"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import { Download, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getApiUrl } from '@/utils/api';

const BASE_URL = `${getApiUrl()}/api`;

interface PaymentStats {
  totalEarnings: number;
  totalTransactions: number;
  pendingAmount: number;
  recentWithdrawals: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function PaymentsPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [_isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>();

  const fetchPaymentStats = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/seller/payments/stats`);
      if (!response.ok) throw new Error("Erreur lors du chargement des statistiques");
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPaymentStats();
  }, [fetchPaymentStats]);

  const handleWithdrawalRequest = async () => {
    try {
      const response = await fetch(`${BASE_URL}/seller/payments/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: stats?.pendingAmount,
          bankInfo: {} // À compléter avec les infos bancaires
        })
      });

      if (!response.ok) throw new Error("Erreur lors de la demande de retrait");

      toast({
        title: "Succès",
        description: "Demande de retrait envoyée avec succès",
      });

      fetchPaymentStats();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter la demande de retrait",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paiements</h1>
          <p className="text-muted-foreground">
            Gérez vos revenus et retraits
          </p>
        </div>
        <div className="flex gap-4">
          <DateRangePicker
            value={date}
            onChange={setDate}
          />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalEarnings} FCFA
            </div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +12.5% vs mois dernier
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Montant en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pendingAmount} FCFA
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleWithdrawalRequest}
              disabled={!stats?.pendingAmount}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Demander un retrait
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalTransactions}
            </div>
            <div className="flex items-center text-sm text-red-600">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              -3.2% vs mois dernier
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Derniers retraits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Référence</th>
                  <th className="p-4 text-left">Montant</th>
                  <th className="p-4 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b">
                    <td className="p-4">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">#{withdrawal.id.slice(0, 8)}</td>
                    <td className="p-4">{withdrawal.amount} FCFA</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {withdrawal.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}