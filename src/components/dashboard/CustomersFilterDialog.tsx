// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { DatePickerWithRange } from "@/components/ui/date-range-picker";
// import { addDays } from "date-fns";

// interface CustomerFilters {
//   status: string;
//   orderCount: string;
//   spentAmount: string;
//   dateRange: {
//     from: Date | undefined;
//     to: Date | undefined;
//   };
// }

// interface FilterDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onFilter: (filters: CustomerFilters) => void;
// }

// export function CustomersFilterDialog({ open, onOpenChange, onFilter }: FilterDialogProps) {
//   const [filters, setFilters] = useState<CustomerFilters>({
//     status: "all",
//     orderCount: "all",
//     spentAmount: "all",
//     dateRange: {
//       from: undefined,
//       to: undefined,
//     },
//   });

//   const presets = [
//     {
//       label: "7 derniers jours",
//       value: {
//         from: addDays(new Date(), -7),
//         to: new Date(),
//       },
//     },
//     {
//       label: "30 derniers jours",
//       value: {
//         from: addDays(new Date(), -30),
//         to: new Date(),
//       },
//     },
//     {
//       label: "90 derniers jours",
//       value: {
//         from: addDays(new Date(), -90),
//         to: new Date(),
//       },
//     },
//   ];

//   const handleApplyFilters = () => {
//     onFilter(filters);
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Filtrer les clients</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           <div className="space-y-2">
//             <Label>Statut</Label>
//             <Select
//               value={filters.status}
//               onValueChange={(value) => setFilters({ ...filters, status: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Sélectionner un statut" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Tous</SelectItem>
//                 <SelectItem value="active">Actifs</SelectItem>
//                 <SelectItem value="inactive">Inactifs</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label>Nombre de commandes</Label>
//             <Select
//               value={filters.orderCount}
//               onValueChange={(value) => setFilters({ ...filters, orderCount: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Sélectionner une plage" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Tous</SelectItem>
//                 <SelectItem value="0">Aucune commande</SelectItem>
//                 <SelectItem value="1-5">1 à 5 commandes</SelectItem>
//                 <SelectItem value="6-10">6 à 10 commandes</SelectItem>
//                 <SelectItem value="10+">Plus de 10 commandes</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label>Montant dépensé</Label>
//             <Select
//               value={filters.spentAmount}
//               onValueChange={(value) => setFilters({ ...filters, spentAmount: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Sélectionner une plage" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Tous</SelectItem>
//                 <SelectItem value="0-100">0€ - 100€</SelectItem>
//                 <SelectItem value="100-500">100€ - 500€</SelectItem>
//                 <SelectItem value="500-1000">500€ - 1000€</SelectItem>
//                 <SelectItem value="1000+">Plus de 1000€</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label>Période d&apos;inscription</Label>
//             {/* <DatePickerWithRange
//               selected={filters.dateRange}
//               // onSelect={(range) => setFilters({ ...filters, dateRange: range })}
//               presets={presets}
//             /> */}
//           </div>
//         </div>

//         <div className="flex justify-end gap-4">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Annuler
//           </Button>
//           <Button onClick={handleApplyFilters}>
//             Appliquer les filtres
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// } 

import React from 'react'

const CustomersFilterDialog = () => {
  return (
    <div>CustomersFilterDialog</div>
  )
}

export default CustomersFilterDialog