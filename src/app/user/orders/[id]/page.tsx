"use client";

import { useState } from "react";
import { ArrowLeft, Package, Truck, CheckCircle, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order] = useState<OrderDetails>({
    id: params.id,
    date: "17 Jan, 2021 at 7:32 PM",
    status: "packaging",
    total: 150000,
    products: [
      {
        id: "1",
        category: "SMARTPHONE",
        name: "Google Pixel 6 Pro - 5G Android Phone",
        price: 899,
        quantity: 1,
        image: "/images/pixel6.jpg"
      },
      {
        id: "2",
        category: "ACCESSORIES",
        name: "Tech21 Evo Clear for Google Pixel 6 Pro",
        price: 39,
        quantity: 1,
        image: "/images/case.jpg"
      }
    ],
    shippingAddress: {
      fullName: "Kevin Gilbert",
      address: "East Tejturi Bazar, Word No. 04, Road No. 13/x, House no. 1320/C, Flat No. 5D, Dhaka - 1200, Bangladesh",
      phone: "+1-202-555-0118",
      email: "kevin.gilbert@gmail.com"
    },
    billingAddress: {
      fullName: "Kevin Gilbert",
      address: "East Tejturi Bazar, Word No. 04, Road No. 13/x, House no. 1320/C, Flat No. 5D, Dhaka - 1200, Bangladesh",
      phone: "+1-202-555-0118",
      email: "kevin.gilbert@gmail.com"
    },
    notes: "Donec ac vehicula turpis. Aenean sagittis est eu arcu ornare, eget venenatis purus lobortis.",
    timeline: [
      {
        status: "Commande passée",
        date: "23 Jan, 2021 at 7:32 PM",
        message: "Vous venez d'acheter. Merci d'avoir commandé chez nous !"
      },
      {
        status: "Commande vérifiée",
        date: "20 Jan, 2021 at 7:32 PM",
        message: "Votre commande a été vérifiée"
      },
      {
        status: "En cours de livraison",
        date: "19 Jan, 2021 at 2:61 PM",
        message: "Vous êtes en cours de livraison"
      }
    ]
  });

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