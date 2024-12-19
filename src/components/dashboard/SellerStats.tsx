"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface SellerStats {
  seller: {
    name: string;
    avatar?: string;
    rating: number;
  };
  performance: {
    sales: number;
    target: number;
    orders: number;
    completionRate: number;
  };
}

export function SellerStats({ seller, performance }: SellerStats) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-16 w-16 sm:h-12 sm:w-12">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback>{seller.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle>{seller.name}</CardTitle>
            <div className="flex items-center justify-center sm:justify-start mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i}
                  className={`h-4 w-4 ${i < seller.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row justify-between mb-2">
                <span className="text-sm font-medium">Objectif de ventes</span>
                <span className="text-sm font-medium">
                  {performance.sales.toLocaleString()} / {performance.target.toLocaleString()} FCFA
                </span>
              </div>
              <Progress value={(performance.sales / performance.target) * 100} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-xl sm:text-2xl font-bold">{performance.orders}</p>
                <p className="text-sm text-muted-foreground">Commandes</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-xl sm:text-2xl font-bold">{seller.rating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 