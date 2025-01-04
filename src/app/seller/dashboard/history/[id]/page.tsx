"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Tag, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Détails de l'activité</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Informations générales</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="text-gray-500">Type:</span>
              <span>{detail.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-gray-500">Date:</span>
              <span>
                {format(new Date(detail.timestamp), "PPP 'à' HH:mm", { locale: fr })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-gray-500">Utilisateur:</span>
              <span>{detail.user.name}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Détails de l'action</h2>
          <div className="space-y-4">
            <div>
              <span className="text-gray-500">Action:</span>
              <p className="font-medium">{detail.action}</p>
            </div>
            <div>
              <span className="text-gray-500">Description:</span>
              <p>{detail.description}</p>
            </div>
            <div>
              <span className="text-gray-500">Statut:</span>
              <Badge variant="outline" className="ml-2">
                {detail.status}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Métadonnées</h2>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
            {JSON.stringify(detail.metadata, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
}