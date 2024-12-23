"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const { BASE_URL } = API_CONFIG;

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: "IN PROGRESS" | "COMPLETED" | "CANCELED";
  date: string;
  shipping: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  payment: {
    method: string;
    cardLast4: string;
    amount: number;
  };
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    status: string;
  }>;
}

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function PaymentDetailPage({ 
  params: paramsPromise 
}: PageProps) {
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const params = await paramsPromise;
      try {
        const token = getCookie('token');
        
        const response = await fetch(`${BASE_URL}/api/user/payments/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des détails du paiement');
        }

        const data = await response.json();
        setOrderDetail(data.payment);
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du paiement",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paramsPromise, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN PROGRESS": return "text-blue-600 bg-blue-50";
      case "COMPLETED": return "text-green-600 bg-green-50";
      case "CANCELED": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (!orderDetail) return <div>Paiement non trouvé</div>;

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux commandes
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Commande #{orderDetail.orderNumber}
                </h1>
                <p className="text-gray-500">
                  {new Date(orderDetail.date).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  orderDetail.status
                )}`}
              >
                {orderDetail.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-2">Adresse de livraison</h2>
                <p className="text-gray-600">
                  {orderDetail.shipping.address}
                  <br />
                  {orderDetail.shipping.city}, {orderDetail.shipping.postalCode}
                  <br />
                  {orderDetail.shipping.country}
                </p>
              </div>
              <div>
                <h2 className="font-semibold mb-2">Paiement</h2>
                <p className="text-gray-600">
                  {orderDetail.payment.method}
                  <br />
                  **** **** **** {orderDetail.payment.cardLast4}
                  <br />
                  Total: ${orderDetail.payment.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Produits commandés</h2>
            <div className="divide-y">
              {orderDetail.products.map((product) => (
                <div
                  key={product.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantité: {product.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(product.price * product.quantity).toLocaleString()}
                    </p>
                    <span
                      className={`text-sm ${getStatusColor(product.status)}`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
