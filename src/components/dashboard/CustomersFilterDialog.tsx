"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerFilters } from "@/types/customer";

interface CustomersFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilter: (filters: CustomerFilters) => void;
}

export function CustomersFilterDialog({
  open,
  onOpenChange,
  onFilter,
}: CustomersFilterDialogProps) {
  const [filters, setFilters] = useState<CustomerFilters>({
    dateRange: undefined,
    status: "",
    spentRange: { min: 0, max: 0 },
    orderCount: "",
    totalSpent: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrer les clients</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nombre de commandes</Label>
            <Select
              value={filters.orderCount}
              onValueChange={(value) => setFilters({ ...filters, orderCount: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une plage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="0">Aucune commande</SelectItem>
                <SelectItem value="1-5">1 à 5 commandes</SelectItem>
                <SelectItem value="6-10">6 à 10 commandes</SelectItem>
                <SelectItem value="10+">Plus de 10 commandes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Montant dépensé</Label>
            <Select
              value={filters.totalSpent}
              onValueChange={(value) => setFilters({ ...filters, totalSpent: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une plage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="0-100">0€ - 100€</SelectItem>
                <SelectItem value="100-500">100€ - 500€</SelectItem>
                <SelectItem value="500-1000">500€ - 1000€</SelectItem>
                <SelectItem value="1000+">Plus de 1000€</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Période d&apos;inscription</Label>
          </div>
        </form>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit">
            Appliquer les filtres
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 

