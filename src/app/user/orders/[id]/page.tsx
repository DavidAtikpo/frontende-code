"use client";

import { useState, useEffect } from "react";
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Package, Truck, CheckCircle, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const { BASE_URL } = API_CONFIG;

interface OrderDetails {
  id: string;
  date: string;
  status: "processing" | "packaging" | "shipping" | "delivered";
  total: number;
  products: Array<{
    id: string;
    category: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    phone: string;
    email: string;
  };
  billingAddress: {
    fullName: string;
    address: string;
    phone: string;
    email: string;
  };
  notes?: string;
  timeline: Array<{
    status: string;
    date: string;
    message: string;
  }>;
}

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function OrderDetailsPage({ 
  params: paramsPromise 
}: PageProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      const params = await paramsPromise;
      try {
        const token = getCookie('token');
        
        const response = await fetch(`${BASE_URL}/api/user/orders/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement de la commande');
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la commande",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [paramsPromise, toast]);

  if (isLoading) return <div>Chargement...</div>;
  if (!order) return <div>Commande non trouvée</div>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <ClipboardList className="h-6 w-6 text-blue-600" />;
      case "packaging":
        return <Package className="h-6 w-6 text-blue-600" />;
      case "shipping":
        return <Truck className="h-6 w-6 text-blue-600" />;
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/user/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Détails de la commande</h1>
            <p className="text-sm text-gray-500">
              Commande {order.id} • {order.date}
            </p>
          </div>
        </div>
        <Button variant="outline">Laisser une note</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Statut de la livraison */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Livraison</h2>
              <div className="relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200">
                  <div 
                    className="absolute left-0 h-full bg-blue-600 transition-all duration-500"
                    style={{ width: "50%" }}
                  />
                </div>
                <div className="relative flex justify-between">
                  {["processing", "packaging", "shipping", "delivered"].map((status, index) => (
                    <div 
                      key={status}
                      className={`flex flex-col items-center ${
                        index <= 1 ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 ${
                        index <= 1 ? "border-blue-600" : "border-gray-200"
                      }`}>
                        {getStatusIcon(status)}
                      </div>
                      <span className="mt-2 text-sm capitalize">
                        {status === "processing" ? "Mise en place" :
                         status === "packaging" ? "Packaging" :
                         status === "shipping" ? "En chemin" : "Livré"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 

