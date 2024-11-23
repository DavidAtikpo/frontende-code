"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Filter, Download } from "lucide-react";

export default function OrdersPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
  });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filters]);

  const fetchOrders = async () => {
    try {
      // Simulation d'appel API
      const response = await fetch(`/api/seller/orders?page=${currentPage}&status=${filters.status}&dateRange=${filters.dateRange}`);
      if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      // Simulation d'export
      toast({
        title: "Export en cours",
        description: "Le fichier sera téléchargé dans quelques instants",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les commandes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Commandes</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => {}}>
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <OrdersTable 
            orders={orders} 
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
} 