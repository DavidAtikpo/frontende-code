"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, Check, X } from 'lucide-react';
import { toast } from "react-hot-toast";

const { BASE_URL } = API_CONFIG;

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  status: 'pending' | 'approved' | 'rejected';
  eventsCount: number;
  totalRevenue: number;
  createdAt: string;
  documents: {
    businessRegistration?: string;
    identityProof?: string;
  };
}

type Row = {
  original: Seller;
};

export default function AdminSellers() {
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      accessorKey: "businessName",
      header: "Entreprise",
      cell: ({ row }: { row: Row }) => (
        <div>
          <p className="font-medium">{row.original.businessName}</p>
          <p className="text-sm text-gray-500">{row.original.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }: { row: Row }) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            {row.original.email}
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            {row.original.phone}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "stats",
      header: "Statistiques",
      cell: ({ row }: { row: Row }) => (
        <div>
          <p>{row.original.eventsCount} événements</p>
          <p className="text-sm text-gray-500">
            {row.original.totalRevenue.toLocaleString()} FCFA
          </p>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Inscription",
      cell: ({ row }: { row: Row }) => (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: { row: Row }) => {
        const status = row.original.status as 'pending' | 'approved' | 'rejected';
        const colors = {
          pending: "bg-yellow-100 text-yellow-800",
          approved: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
        } as const;
        return (
          <Badge className={colors[status]}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/sellers/${row.original.id}`)}
          >
            Détails
          </Button>
          {row.original.status === 'pending' && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleApprove(row.original.id)}
              >
                <Check className="mr-2 h-4 w-4" />
                Approuver
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleReject(row.original.id)}
              >
                <X className="mr-2 h-4 w-4" />
                Rejeter
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/sellers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des vendeurs');
      }

      const data = await response.json();
      setSellers(data.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des vendeurs');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApprove = async (sellerId: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/sellers/${sellerId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Vendeur approuvé avec succès');
        fetchSellers();
      }
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
      console.error('Erreur:', error);
    }
  };

  const handleReject = async (sellerId: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/sellers/${sellerId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Vendeur rejeté');
        fetchSellers();
      }
    } catch (error) {
      toast.error('Erreur lors du rejet');
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des vendeurs</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des vendeurs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={sellers}
            searchKey="businessName"
          />
        </CardContent>
      </Card>
    </div>
  );
} 