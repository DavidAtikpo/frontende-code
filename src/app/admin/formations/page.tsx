"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Calendar, DollarSign, Check, X } from 'lucide-react';
import { toast } from "react-hot-toast";
import { ColumnDef, Row } from "@tanstack/react-table";

const { BASE_URL } = API_CONFIG;

interface Formation {
  id: string;
  title: string;
  category: string;
  instructor: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  enrolledCount: number;
  maxParticipants: number;
  price: number;
}

export default function AdminFormations() {
  const router = useRouter();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<Formation>[] = [
    {
      accessorKey: "title",
      header: "Formation",
      cell: ({ row }: { row: Row<Formation> }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-sm text-gray-500">{row.original.category}</p>
        </div>
      ),
    },
    {
      accessorKey: "instructor",
      header: "Formateur",
      cell: ({ row }) => (
        <div className="flex items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          {row.original.instructor}
        </div>
      ),
    },
    {
      accessorKey: "participants",
      header: "Participants",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          {row.original.enrolledCount}/{row.original.maxParticipants}
        </div>
      ),
    },
    {
      accessorKey: "dates",
      header: "Dates",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date(row.original.startDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Prix",
      cell: ({ row }) => (
        <div className="flex items-center">
          <DollarSign className="mr-2 h-4 w-4" />
          {row.original.price.toLocaleString()} FCFA
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.status;
        const colors: Record<Formation['status'], string> = {
          pending: "bg-yellow-100 text-yellow-800",
          active: "bg-green-100 text-green-800",
          completed: "bg-blue-100 text-blue-800",
          cancelled: "bg-red-100 text-red-800",
        };
        return (
          <Badge className={colors[status]}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/formations/${row.original.id}`)}
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
                onClick={() => handleCancel(row.original.id)}
              >
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const fetchFormations = useCallback(async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/formations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/adminLogin');
          return;
        }
        throw new Error("Erreur lors du chargement des formations");
      }

      const data = await response.json();
      if (data.success) {
        setFormations(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleApprove = async (formationId: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/formations/${formationId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Formation approuvée avec succès');
        fetchFormations();
      }
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
      console.error('Erreur:', error);
    }
  };

  const handleCancel = async (formationId: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/formations/${formationId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Formation annulée');
        fetchFormations();
      }
    } catch (error) {
      toast.error('Erreur lors de l\'annulation');
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    const token = getCookie('token');
    const userRole = getCookie('role');

    if (!token || userRole !== 'admin') {
      router.replace('/adminLogin');
      return;
    }

    fetchFormations();
  }, [fetchFormations, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des formations</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des formations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={formations}
            searchKey="title"
          />
        </CardContent>
      </Card>
    </div>
  );
} 