"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Tag, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryDetail {
  id: string;
  type: string;
  action: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  metadata: {
    [key: string]: any;
  };
  status: string;
}

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [detail, setDetail] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryDetail = async () => {
      try {
        const response = await fetch(`/api/history/${params.id}`);
        const data = await response.json();
        setDetail(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryDetail();
  }, [params.id]);

  if (loading) return <div>Chargement...</div>;
  if (!detail) return <div>Historique non trouvé</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="self-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold">Détails de l'activité</h1>
      </div>

      <div className="grid gap-6">
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Informations générales</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Type:</span>
              </div>
              <span className="ml-6 sm:ml-2">{detail.type}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
              </div>
              <span className="ml-6 sm:ml-2">
                {format(new Date(detail.timestamp), "PPP 'à' HH:mm", { locale: fr })}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Utilisateur:</span>
              </div>
              <span className="ml-6 sm:ml-2">{detail.user.name}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Détails de l'action</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Action:</span>
              <p className="font-medium ml-2">{detail.action}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Description:</span>
              <p className="ml-2">{detail.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Statut:</span>
              <Badge variant="outline">{detail.status}</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Métadonnées</h2>
          <ScrollArea className="h-[200px] sm:h-[300px] w-full rounded-md border">
            <pre className="p-4 text-sm">
              {JSON.stringify(detail.metadata, null, 2)}
            </pre>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}