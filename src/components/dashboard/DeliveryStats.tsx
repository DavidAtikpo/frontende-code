"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, MapPin } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface DeliveryData {
  inTransit: number;
  delivered: number;
  delayed: number;
  zones: Array<{
    name: string;
    count: number;
    avgTime: number;
  }>;
  metrics: {
    avgDeliveryTime: number;
    onTimeDeliveryRate: number;
    returnRate: number;
  };
}

interface DeliveryStatsProps {
  data: DeliveryData;
}

const COLORS = ['#2563eb', '#16a34a', '#dc2626'];

export function DeliveryStats({ data }: DeliveryStatsProps) {
  const pieData = [
    { name: 'En transit', value: data.inTransit },
    { name: 'Livrées', value: data.delivered },
    { name: 'Retardées', value: data.delayed }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques de livraison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* Graphique des statuts */}
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Métriques */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Temps moyen de livraison</p>
                <p className="text-2xl font-bold">
                  {data.metrics.avgDeliveryTime} heures
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Taux de livraison à temps</p>
                <p className="text-2xl font-bold">
                  {data.metrics.onTimeDeliveryRate}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Taux de retour</p>
                <p className="text-2xl font-bold text-red-600">
                  {data.metrics.returnRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Zones de livraison */}
        <div className="mt-6">
          <h4 className="font-medium mb-4">Performance par zone</h4>
          <div className="space-y-3">
            {data.zones.map((zone) => (
              <div key={zone.name} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{zone.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {zone.count} livraisons
                  </p>
                </div>
                <Badge variant="outline">
                  {zone.avgTime}h en moyenne
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 