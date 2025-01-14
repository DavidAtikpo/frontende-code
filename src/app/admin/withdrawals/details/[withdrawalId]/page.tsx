"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { toast } from 'sonner';
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;


interface Withdrawal {
  id: string;
  sellerId: string;
  amount: number;
  netAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  processedAt?: string;
  seller?: {
    businessName: string;
    user?: {
      name: string;
      email: string;
      phone: string;
    }
  };
  bankInfo: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  notes?: string;
}

export default function WithdrawalDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (params.withdrawalId) {
      fetchWithdrawalDetails();
    }
  }, [params.withdrawalId]);

  const fetchWithdrawalDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/withdrawals/${params.withdrawalId}`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails du retrait');
      }
      const data = await response.json();
      setWithdrawal(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/withdrawals/${params.withdrawalId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du statut');
      }

      await fetchWithdrawalDetails();
      toast.success('Statut mis à jour avec succès');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours';
      case 'completed':
        return 'Complété';
      case 'failed':
        return 'Échoué';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-4">
        <Card className="p-6">
          <div className="text-red-500">
            Erreur: {error}
          </div>
        </Card>
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="p-4">
        <Card className="p-6">
          <div className="text-gray-500">
            Demande de retrait non trouvée
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Détails du Retrait</h1>
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Retour
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Informations du Vendeur</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Entreprise:</span> {withdrawal.seller?.businessName}</p>
              <p><span className="font-medium">Nom:</span> {withdrawal.seller?.user?.name}</p>
              <p><span className="font-medium">Email:</span> {withdrawal.seller?.user?.email}</p>
              <p><span className="font-medium">Téléphone:</span> {withdrawal.seller?.user?.phone}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Informations Bancaires</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Banque:</span> {withdrawal.bankInfo.bankName}</p>
              <p><span className="font-medium">Titulaire:</span> {withdrawal.bankInfo.accountName}</p>
              <p><span className="font-medium">Numéro de compte:</span> {withdrawal.bankInfo.accountNumber}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Détails du Retrait</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Montant brut:</span> {withdrawal.amount.toLocaleString('fr-FR')} XOF</p>
              <p><span className="font-medium">Montant net:</span> {withdrawal.netAmount.toLocaleString('fr-FR')} XOF</p>
              <p><span className="font-medium">Solde avant:</span> {withdrawal.balanceBefore.toLocaleString('fr-FR')} XOF</p>
              <p><span className="font-medium">Solde après:</span> {withdrawal.balanceAfter.toLocaleString('fr-FR')} XOF</p>
              <p><span className="font-medium">Date de demande:</span> {format(new Date(withdrawal.createdAt), 'PPP à HH:mm', { locale: fr })}</p>
              {withdrawal.processedAt && (
                <p><span className="font-medium">Date de traitement:</span> {format(new Date(withdrawal.processedAt), 'PPP à HH:mm', { locale: fr })}</p>
              )}
              <p><span className="font-medium">Statut:</span> <Badge className={getStatusColor(withdrawal.status)}>{getStatusText(withdrawal.status)}</Badge></p>
            </div>
          </div>

          {withdrawal.status === 'pending' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              <div className="space-x-2">
                <Button
                  onClick={() => handleStatusUpdate('processing')}
                  disabled={isProcessing}
                >
                  Approuver
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={isProcessing}
                >
                  Rejeter
                </Button>
              </div>
            </div>
          )}

          {withdrawal.status === 'processing' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              <div className="space-x-2">
                <Button
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={isProcessing}
                >
                  Marquer comme payé
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate('failed')}
                  disabled={isProcessing}
                >
                  Marquer comme échoué
                </Button>
              </div>
            </div>
          )}

          {withdrawal.notes && (
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-4">Notes</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                {withdrawal.notes}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 