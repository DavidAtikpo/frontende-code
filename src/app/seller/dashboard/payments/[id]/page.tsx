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
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="w-fit -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          
          <div className="flex flex-col gap-2">
            <h1 className="text-lg sm:text-xl font-bold break-words">
              Transaction #{payment?.transactionId}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {payment?.date && new Date(payment.date).toLocaleDateString('fr-FR')}
              </p>
              {payment && (
                <Badge className={`w-fit ${getStatusDetails(payment.status).badge}`}>
                  {getStatusDetails(payment.status).text}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="p-3 sm:p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold">Détails du paiement</h2>
                {payment && getStatusDetails(payment.status).icon}
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Montant</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {payment?.amount.toLocaleString()} FCFA
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Méthode de paiement</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">
                      {payment?.paymentMethod.type}
                      {payment?.paymentMethod.last4 && ` (**** ${payment.paymentMethod.last4})`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Articles commandés</h3>
                <div className="space-y-3">
                  {payment?.order.items.map((item, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-gray-500">Quantité: {item.quantity}</p>
                        <p className="font-medium">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Informations client</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{payment?.customer.name}</span>
                </div>
                {payment?.customer.businessName && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{payment.customer.businessName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Commande #{payment?.order.number}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Métadonnées</h3>
              <pre className="bg-gray-50 p-2 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
                {payment?.metadata && JSON.stringify(payment.metadata, null, 2)}
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}