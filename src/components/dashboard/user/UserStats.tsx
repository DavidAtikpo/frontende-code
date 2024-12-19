"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart, MapPin, Star } from "lucide-react";

interface UserStatsProps {
  stats: {
    totalOrders: number;
    favoriteCount: number;
    addressCount: number;
    reviewCount: number;
  };
}

export function UserStats({ stats }: UserStatsProps) {
  const statItems = [
    {
      title: "Commandes",
      value: stats.totalOrders,
      icon: ShoppingBag,
      description: "Total des commandes"
    },
    {
      title: "Favoris",
      value: stats.favoriteCount,
      icon: Heart,
      description: "Produits favoris"
    },
    {
      title: "Adresses",
      value: stats.addressCount,
      icon: MapPin,
      description: "Adresses enregistrées"
    },
    {
      title: "Avis",
      value: stats.reviewCount,
      icon: Star,
      description: "Avis laissés"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 