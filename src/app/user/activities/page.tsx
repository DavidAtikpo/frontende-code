"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";
import { useToast } from "@/components/ui/use-toast";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Activity {
  id: string;
  type: string;
  action: string;
  details: ActivityDetails;
  ip: string;
  userAgent: string;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
}

interface ActivityDetails {
  type: string;
  data: Record<string, string | number>;
}

export default function UserActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pages: 1
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchActivities(1);
  }, []);

  const fetchActivities = async (page: number = 1) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/user/activity?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
        setPagination(data.pagination);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les activités",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  if (!activities || activities.length === 0) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Clock className="h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-semibold">Aucune activité</h3>
            <p className="text-muted-foreground">
              Vous n'avez pas encore d'activités enregistrées.
              Elles apparaîtront ici une fois que vous commencerez à utiliser la plateforme.
            </p>
            <Button 
              variant="outline"
              onClick={() => router.push('/products')}
            >
              Découvrir des produits
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatActivityType = (type: string) => {
    const types: { [key: string]: string } = {
      PROFILE_UPDATE: "Mise à jour du profil",
      LOGIN: "Connexion",
      LOGOUT: "Déconnexion",
      ORDER: "Commande",
      PAYMENT: "Paiement",
      // Ajoutez d'autres types selon vos besoins
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Activités récentes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Historique des activités</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Détails</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{formatDate(activity.createdAt)}</TableCell>
                  <TableCell>{formatActivityType(activity.type)}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>
                    {JSON.stringify(activity.details)}
                  </TableCell>
                  <TableCell>{activity.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => fetchActivities(pagination.page - 1)}
            >
              Précédent
            </Button>
            <span>
              Page {pagination.page} sur {pagination.pages}
            </span>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.pages}
              onClick={() => fetchActivities(pagination.page + 1)}
            >
              Suivant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 