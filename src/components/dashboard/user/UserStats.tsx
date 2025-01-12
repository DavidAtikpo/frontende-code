"use client";

import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { ShoppingBag, Heart, MapPin, Star } from "lucide-react";

interface StatsProps {
  stats: {
    totalOrders: number;
    favoriteCount: number;
    addressCount: number;
    reviewCount: number;
  };
}

export function UserStats({ stats }: StatsProps) {
  const statItems = [
    {
      label: "Commandes",
      value: stats.totalOrders,
      icon: ShoppingBag,
      href: "/user/orders"
    },
    {
      label: "Favoris",
      value: stats.favoriteCount,
      icon: Heart,
      href: "/user/favorites"
    },
    {
      label: "Adresses",
      value: stats.addressCount,
      icon: MapPin,
      href: "/user/addresses"
    },
    {
      label: "Avis",
      value: stats.reviewCount,
      icon: Star,
      href: "/user/reviews"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Link key={item.label} href={item.href}>
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <item.icon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 