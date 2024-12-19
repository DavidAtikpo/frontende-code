"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesProgressProps {
  currentSales: number;
  target: number;
  period: string;
}

export function SalesProgress({ currentSales, target, period }: SalesProgressProps) {
  const progress = Math.min((currentSales / target) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objectif de ventes - {period}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <div>
              <p className="font-medium">{currentSales.toLocaleString()} FCFA</p>
              <p className="text-muted-foreground">Ventes actuelles</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{target.toLocaleString()} FCFA</p>
              <p className="text-muted-foreground">Objectif</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">{progress.toFixed(1)}% atteint</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 