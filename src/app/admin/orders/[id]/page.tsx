"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    status: string;
  }[];
  total: number;
}

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/orders">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux commandes
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Détails de la commande #{order?.orderNumber}</h1>
      </div>

      {/* Contenu détaillé de la commande */}
      {/* ... Le reste du JSX pour les détails de la commande ... */}
    </div>
  );
} 