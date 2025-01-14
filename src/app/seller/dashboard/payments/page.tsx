"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import { Download, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const { BASE_URL } = API_CONFIG;

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
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    accountName: '',
    accountNumber: '',
    bankName: ''
  });

  const fetchPaymentStats = useCallback(async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/payments/stat`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors du chargement des statistiques");
      }
      
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les statistiques",
        variant: "destructive",
      });
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPaymentStats();
  }, [fetchPaymentStats]);

  const handleWithdrawalRequest = async () => {
    try {
      if (!bankInfo.accountName || !bankInfo.accountNumber || !bankInfo.bankName) {
        throw new Error("Veuillez remplir toutes les informations bancaires");
      }

      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/payments/withdraw`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: stats?.totalEarnings,
          paymentMethod: 'bank_transfer',
          bankInfo: bankInfo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la demande de retrait");
      }

      toast({
        title: "Succès",
        description: "Demande de retrait envoyée avec succès",
      });

      setIsWithdrawalDialogOpen(false);
      fetchPaymentStats();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de traiter la demande de retrait",
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
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Paiements</h1>
          <p className="text-muted-foreground">
            Gérez vos revenus et retraits
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <DateRangePicker
            value={date}
            onChange={setDate}
          />
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <Dialog open={isWithdrawalDialogOpen} onOpenChange={setIsWithdrawalDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!stats?.totalEarnings}
                  className="mt-2 w-full sm:w-auto"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Demander un retrait
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Informations bancaires pour le retrait</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Nom de la banque</Label>
                    <Input
                      id="bankName"
                      placeholder="Ex: ECOBANK"
                      value={bankInfo.bankName}
                      onChange={(e) => setBankInfo(prev => ({ ...prev, bankName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Nom du compte</Label>
                    <Input
                      id="accountName"
                      placeholder="Ex: John DOE"
                      value={bankInfo.accountName}
                      onChange={(e) => setBankInfo(prev => ({ ...prev, accountName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Numéro de compte</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Ex: CI123456789"
                      value={bankInfo.accountNumber}
                      onChange={(e) => setBankInfo(prev => ({ ...prev, accountNumber: e.target.value }))}
                    />
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleWithdrawalRequest}
                  >
                    Confirmer le retrait de {stats?.totalEarnings} FCFA
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 sm:p-4 text-left">Date</th>
                  <th className="p-2 sm:p-4 text-left">Référence</th>
                  <th className="p-2 sm:p-4 text-left">Montant</th>
                  <th className="p-2 sm:p-4 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b">
                    <td className="p-2 sm:p-4">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 sm:p-4">#{withdrawal.id.slice(0, 8)}</td>
                    <td className="p-2 sm:p-4">{withdrawal.amount} FCFA</td>
                    <td className="p-2 sm:p-4">
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
