"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Eye,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total_amount: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      seller: {
        businessName: string;
      }
    }
  }>;
  payment: {
    status: string;
    method: string;
  };
  shipping: {
    address: string;
    city: string;
    phone: string;
  };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    try {
      const queryParams = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await fetch(`${BASE_URL}/api/admin/orders${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data.orders);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });

      if (response.ok) {
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des commandes</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="processing">En traitement</SelectItem>
            <SelectItem value="shipped">Expédiée</SelectItem>
            <SelectItem value="delivered">Livrée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                  </div>
                </TableCell>
                <TableCell>{order.total_amount.toLocaleString()} FCFA</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog des détails de commande */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande #{selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Client</h3>
                  <p>Nom: {selectedOrder.user.name}</p>
                  <p className="text-gray-500">{selectedOrder.user.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Livraison</h3>
                  <p>{selectedOrder.shipping.address}</p>
                  <p>{selectedOrder.shipping.city}</p>
                  <p>{selectedOrder.shipping.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Articles</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Vendeur</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix unitaire</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.product.seller.businessName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price.toLocaleString()} FCFA</TableCell>
                        <TableCell>
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center">
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Modifier le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En traitement</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">
                    {selectedOrder.total_amount.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}