 "use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentsFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentsFilter({ open, onOpenChange }: PaymentsFilterProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtrer les paiements</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Montant minimum</Label>
            <Input type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label>Montant maximum</Label>
            <Input type="number" placeholder="1000000" />
          </div>
          <div className="space-y-2">
            <Label>Méthode de paiement</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les méthodes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les méthodes</SelectItem>
                <SelectItem value="mobile">Mobile Money</SelectItem>
                <SelectItem value="card">Carte bancaire</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Appliquer les filtres
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}