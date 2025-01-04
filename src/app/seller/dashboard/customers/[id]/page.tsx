"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  ShoppingBag,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Activity
} from "lucide-react";

interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  lastPurchase: string;
  status: "active" | "inactive";
  orders: Array<{
    id: string;
    date: string;
    total: number;
    status: string;
  }>;
  payments: Array<{
    id: string;
    date: string;
    amount: number;
    method: string;
  }>;
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await fetch(`/api/customers/${params.id}`);
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [params.id]);

  if (loading) return <div>Chargement...</div>;
  if (!customer) return <div>Client non trouvé</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">Client depuis {new Date(customer.joinedDate).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        <Badge variant={customer.status === 'active' ? 'success' : 'secondary'}>
          {customer.status === 'active' ? 'Actif' : 'Inactif'}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ShoppingBag className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total commandes</p>
              <p className="text-2xl font-bold">{customer.totalOrders}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total dépensé</p>
              <p className="text-2xl font-bold">{customer.totalSpent} FCFA</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Activity className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Dernier achat</p>
              <p className="text-2xl font-bold">{new Date(customer.lastPurchase).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Inscrit le {new Date(customer.joinedDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          {/* Tableau des commandes similaire à celui de la page orders */}
        </TabsContent>

        <TabsContent value="payments">
          {/* Tableau des paiements similaire à celui de la page payments */}
        </TabsContent>
      </Tabs>
    </div>
  );
}