"use client";

import { useState, useEffect, useCallback } from "react";
import AdForm from "./components/AdForm";
import AdScheduler from "./components/AdScheduler";
import AdPreview from "./components/AdPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Advertisement {
  id: string;
  name: string;
  type: 'banner' | 'popup' | 'sidebar';
  location: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'scheduled';
  imageUrl: string;
  targetUrl: string;
  impressions: number;
  clicks: number;
}

interface ScheduleProps {
  adId: string;
  startDate: Date;
  endDate: Date;
  frequency: 'always' | 'scheduled' | 'custom';
  customDays?: string[];
  customHours?: string[];
}

// Définition des colonnes pour le DataTable
const columns = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "location",
    header: "Emplacement",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }: { row: { original: Advertisement } }) => (
      <div className={`
        px-2 py-1 rounded-full text-xs font-medium inline-block
        ${row.original.status === 'active' ? 'bg-green-100 text-green-800' : ''}
        ${row.original.status === 'inactive' ? 'bg-gray-100 text-gray-800' : ''}
        ${row.original.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
      `}>
        {row.original.status}
      </div>
    )
  },
  {
    accessorKey: "impressions",
    header: "Impressions",
  },
  {
    accessorKey: "clicks",
    header: "Clics",
  },
  {
    accessorKey: "dates",
    header: "Période",
    cell: ({ row }: { row: { original: Advertisement } }) => (
      <div className="text-sm">
        <div>{format(new Date(row.original.startDate), 'dd/MM/yyyy', { locale: fr })}</div>
        <div className="text-gray-500">
          → {format(new Date(row.original.endDate), 'dd/MM/yyyy', { locale: fr })}
        </div>
      </div>
    )
  }
];

export default function AdvertisingPage() {
  const { toast } = useToast();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  const fetchAds = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/advertising');
      const data = await response.json();
      if (response.ok) {
        setAds(data);
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les publicités",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleCreateAd = async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/advertising', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Publicité créée avec succès"
        });
        fetchAds();
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la publicité",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = async (schedule: ScheduleProps) => {
    if (!selectedAd) return;

    try {
      const response = await fetch(`/api/admin/advertising/${selectedAd.id}/schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schedule),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Planification mise à jour"
        });
        fetchAds();
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la planification",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Publicités</h1>
          <p className="text-muted-foreground">
            Gérez les publicités de votre plateforme
          </p>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des publicités</TabsTrigger>
          <TabsTrigger value="new">Nouvelle publicité</TabsTrigger>
          <TabsTrigger value="schedule">Planification</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Publicités actives</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={ads}
                searchKey="name"
                loading={loading}
                onRowClick={(row) => setSelectedAd(row)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Créer une nouvelle publicité</CardTitle>
            </CardHeader>
            <CardContent>
              <AdForm onSubmit={handleCreateAd} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Planification des publicités</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAd ? (
                <div className="grid grid-cols-2 gap-6">
                  <AdScheduler
                    schedule={{
                      adId: selectedAd.id,
                      startDate: selectedAd.startDate,
                      endDate: selectedAd.endDate,
                      frequency: 'always'
                    }}
                    onScheduleChange={handleScheduleChange}
                  />
                  <AdPreview
                    imageUrl={selectedAd.imageUrl}
                    type={selectedAd.type}
                    location={selectedAd.location}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Sélectionnez une publicité pour gérer sa planification
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 