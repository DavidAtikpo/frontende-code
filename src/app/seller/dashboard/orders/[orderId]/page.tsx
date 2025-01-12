"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle,
  MapPin,
  User,
  Clock,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  shipping: {
    method: string;
    address: string;
    city: string;
    status: string;
    trackingNumber?: string;
  };
  payment: {
    method: string;
    status: string;
    total: number;
    tax: number;
    shipping: number;
  };
  timeline: Array<{
    status: string;
    date: string;
    note?: string;
  }>;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/${params.id}`);
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de la commande",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      await fetch(`${BASE_URL}/api/orders/${params.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      toast({
        title: "Succès",
        description: "Statut de la commande mis à jour",
      });
      
      fetchOrderDetails();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!order) return <div>Commande non trouvée</div>;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between gap-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Commande #{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        <Select
          value={order.status}
          onValueChange={updateOrderStatus}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Statut de la commande" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="processing">En cours</SelectItem>
            <SelectItem value="shipped">Expédiée</SelectItem>
            <SelectItem value="delivered">Livrée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Produits commandés</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="relative w-20 h-20 sm:w-16 sm:h-16">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantité: {item.quantity} × {item.price.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="text-right w-full sm:w-auto">
                    <p className="font-semibold">
                      {(item.quantity * item.price).toLocaleString()} FCFA
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-6 p-4 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Résumé</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{order.payment.total.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{order.payment.shipping.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{order.payment.tax.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>{(order.payment.total + order.payment.shipping + order.payment.tax).toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Informations client</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{order.shipping.address}, {order.shipping.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span>{order.payment.method}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Historique de la commande</h2>
        <div className="relative">
          <div className="absolute left-2 top-0 h-full w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {order.timeline.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative flex gap-4 ml-6"
              >
                <div className="absolute -left-9 w-4 h-4 rounded-full bg-white border-2 border-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{event.status}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleString('fr-FR')}
                  </p>
                  {event.note && (
                    <p className="text-sm text-gray-600 mt-1 break-words">
                      {event.note}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}