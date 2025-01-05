"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, MessageSquare, Bell } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  type: 'email' | 'sms' | 'push';
  targetGroup: string;
  scheduledDate: string;
  status: 'scheduled' | 'sent' | 'failed';
  sentCount?: number;
  openRate?: number;
  clickRate?: number;
}

export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <div className="flex items-center">
            {type === 'email' && <Mail className="h-4 w-4 mr-2" />}
            {type === 'sms' && <MessageSquare className="h-4 w-4 mr-2" />}
            {type === 'push' && <Bell className="h-4 w-4 mr-2" />}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Titre",
    },
    {
      accessorKey: "targetGroup",
      header: "Groupe cible",
    },
    {
      accessorKey: "scheduledDate",
      header: "Date programmée",
      cell: ({ row }) => {
        return format(new Date(row.getValue("scheduledDate")), "Pp", { locale: fr });
      },
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={
            status === 'sent' ? 'success' :
            status === 'scheduled' ? 'default' :
            'destructive'
          }>
            {status === 'sent' ? 'Envoyé' :
             status === 'scheduled' ? 'Programmé' :
             'Échoué'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "sentCount",
      header: "Envois",
    },
    {
      accessorKey: "openRate",
      header: "Taux d'ouverture",
      cell: ({ row }) => {
        const rate = row.getValue("openRate") as number;
        return rate ? `${rate}%` : 'N/A';
      },
    },
    {
      accessorKey: "clickRate",
      header: "Taux de clic",
      cell: ({ row }) => {
        const rate = row.getValue("clickRate") as number;
        return rate ? `${rate}%` : 'N/A';
      },
    },
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/admin/marketing/campaigns');
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des campagnes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des campagnes</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={campaigns}
          searchKey="title"
          loading={isLoading}
        />
      </CardContent>
    </Card>
  );
} 