"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  CreditCard,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "inactive";
  recentOrders: CustomerOrder[];
  stats: {
    averageOrderValue: number;
    ordersThisMonth: number;
    spentThisMonth: number;
  };
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-xl font-bold">Client non trouvé</h1>
        <Button variant="outline" onClick={() => router.back()}>Retour</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="w-fit -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-sm text-muted-foreground">
              Client depuis le {new Date(customer.joinDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <Badge className={`w-fit ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {customer.status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 space-y-4">
          <h2 className="font-semibold">Informations personnelles</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{customer.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{customer.address}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="font-semibold">Statistiques</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total commandes</p>
              <p className="text-xl font-bold">{customer.totalOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total dépensé</p>
              <p className="text-xl font-bold">{customer.totalSpent.toLocaleString()} FCFA</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Commande moyenne</p>
              <p className="text-xl font-bold">{customer.stats.averageOrderValue.toLocaleString()} FCFA</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Commandes ce mois</p>
              <p className="text-xl font-bold">{customer.stats.ordersThisMonth}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4 md:col-span-2 lg:col-span-1">
          <h2 className="font-semibold">Dernière activité</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Dernière commande: {new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Dépensé ce mois: {customer.stats.spentThisMonth.toLocaleString()} FCFA</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4">
          <h2 className="font-semibold mb-4">Commandes récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium text-gray-500">N° Commande</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-500">Articles</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left p-2 text-sm font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody>
                {customer.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2 text-sm">#{order.orderNumber}</td>
                    <td className="p-2 text-sm">{new Date(order.date).toLocaleDateString('fr-FR')}</td>
                    <td className="p-2 text-sm">{order.items} articles</td>
                    <td className="p-2 text-sm">{order.total.toLocaleString()} FCFA</td>
                    <td className="p-2">
                      <Badge 
                        className={
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}