"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  CreditCard,
  Receipt,
  Calendar,
  User,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface PaymentDetail {
  id: string;
  transactionId: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  paymentMethod: {
    type: string;
    last4?: string;
    expiryDate?: string;
  };
  customer: {
    name: string;
    email: string;
    businessName?: string;
  };
  order: {
    id: string;
    number: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  metadata: {
    [key: string]: any;
  };
}

export default function PaymentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [payment, setPayment] = useState<PaymentDetail | null>(null);

  const getStatusDetails = (status: string) => {
    const statusConfig = {
      completed: {
        icon: <CheckCircle className="h-8 w-8 text-green-500" />,
        badge: "bg-green-100 text-green-800",
        text: "Paiement réussi"
      },
      pending: {
        icon: <AlertCircle className="h-8 w-8 text-yellow-500" />,
        badge: "bg-yellow-100 text-yellow-800",
        text: "En attente"
      },
      failed: {
        icon: <XCircle className="h-8 w-8 text-red-500" />,
        badge: "bg-red-100 text-red-800",
        text: "Échec"
      }
    };
    return statusConfig[status as keyof typeof statusConfig];
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Transaction #{payment?.transactionId}</h1>
            <p className="text-muted-foreground">
              {payment?.date && new Date(payment.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        {payment && (
          <Badge className={getStatusDetails(payment.status).badge}>
            {getStatusDetails(payment.status).text}
          </Badge>
        )}
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Détails du paiement</h2>
              {payment && getStatusDetails(payment.status).icon}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Montant</p>
                <p className="text-2xl font-bold">
                  {payment?.amount.toLocaleString()} FCFA
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Méthode de paiement</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <p>
                    {payment?.paymentMethod.type}
                    {payment?.paymentMethod.last4 && ` (**** ${payment.paymentMethod.last4})`}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Articles commandés</h3>
              <div className="space-y-4">
                {payment?.order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Informations client</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>{payment?.customer.name}</span>
              </div>
              {payment?.customer.businessName && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span>{payment.customer.businessName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-gray-400" />
                <span>Commande #{payment?.order.number}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Métadonnées</h3>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
              {payment?.metadata && JSON.stringify(payment.metadata, null, 2)}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}