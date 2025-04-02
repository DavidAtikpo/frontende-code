"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, Clock, AlertCircle } from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";
import { Order, OrderItem } from "@/types/order";

interface RecentOrdersProps {
  deliveredOrders: Order[];
  paidOrders: Order[];
  pendingOrders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ deliveredOrders, paidOrders, pendingOrders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = (order: Order) => {
    console.log('Order selected:', order);
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const renderOrderSection = (orders: Order[], title: string, icon: React.ReactNode, color: string) => {
    if (orders.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center mb-4">
          {icon}
          <h3 className="text-lg font-semibold ml-2">{title}</h3>
        </div>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Commande #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{Number(order.total).toFixed(2)} €</p>
                  <p className="text-sm text-gray-500">
                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Commandes récentes</h2>
      
      {renderOrderSection(
        deliveredOrders,
        "Livrées",
        <CheckCircle className={`w-5 h-5 text-green-500`} />,
        "text-green-500"
      )}
      
      {renderOrderSection(
        paidOrders,
        "Payées",
        <Package className={`w-5 h-5 text-blue-500`} />,
        "text-blue-500"
      )}
      
      {renderOrderSection(
        pendingOrders,
        "En attente",
        <Clock className={`w-5 h-5 text-yellow-500`} />,
        "text-yellow-500"
      )}

      {deliveredOrders.length === 0 && paidOrders.length === 0 && pendingOrders.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune commande récente</p>
        </div>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RecentOrders; 