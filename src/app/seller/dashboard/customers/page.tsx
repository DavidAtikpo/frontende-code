"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CustomersTable } from "@/components/dashboard/CustomersTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Filter } from "lucide-react";
import { CustomersFilterDialog } from "@/components/dashboard/CustomersFilterDialog";

export default function CustomersPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, filters]);

  const fetchCustomers = async () => {
    try {
      // Simulation d'appel API
      const response = await fetch(
        `/api/seller/customers?page=${currentPage}&status=${filters.status}`
      );
      if (!response.ok) throw new Error("Erreur lors du chargement des clients");
      const data = await response.json();
      setCustomers(data.customers);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      toast({
        title: "Export en cours",
        description: "Le fichier sera téléchargé dans quelques instants",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
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
          <CustomersTable
            customers={customers}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <CustomersFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onFilter={setFilters}
      />
    </div>
  );
} 