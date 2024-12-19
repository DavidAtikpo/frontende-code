"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center">
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">Commande #{order.orderNumber}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    order.status === 'completed' ? 'success' :
                    order.status === 'pending' ? 'warning' : 'default'
                  }>
                    {order.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                <p className="text-sm text-muted-foreground">
                  {order.items.length} article(s)
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 