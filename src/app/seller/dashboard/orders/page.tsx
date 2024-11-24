// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent} from "@/components/ui/card";
// import { OrdersTable } from "@/components/dashboard/OrdersTable";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { Filter, Download } from "lucide-react";
// import { error } from "console";

// export default function OrdersPage() {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [orders, setOrders] = useState([]);
//   const [filters] = useState({
//     status: "all",
//     dateRange: "all",
//   });

//   useEffect(() => {
//     fetchOrders();
//   }, [currentPage, filters]);

//   const fetchOrders = async () => {
//     try {
//       // Simulation d'appel API
//       const response = await fetch(`/api/seller/orders?page=${currentPage}&status=${filters.status}&dateRange=${filters.dateRange}`);
//       if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
//       const data = await response.json();
//       setOrders(data.orders);
//       setTotalPages(data.totalPages);
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Impossible de charger les commandes",
//         variant: "destructive",
//       });
//       console.log(error);
      
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleExport = async () => {
//     try {
//       // Simulation d'export
//       toast({
//         title: "Export en cours",
//         description: "Le fichier sera téléchargé dans quelques instants",
//       });
//       console.log(error);
      
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Impossible d'exporter les commandes",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Commandes</h1>
//         <div className="flex gap-4">
//           <Button variant="outline" onClick={() => {}}>
//             <Filter className="h-4 w-4 mr-2" />
//             Filtrer
//           </Button>
//           <Button onClick={handleExport}>
//             <Download className="h-4 w-4 mr-2" />
//             Exporter
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           <OrdersTable 
//             orders={orders} 
//             isLoading={isLoading}
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         </CardContent>
//       </Card>
//     </div>
//   );
// } 

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  const [filters] = useState({
    status: "all",
    dateRange: "all",
  });

  // Fonction pour récupérer les commandes (mémorisée avec useCallback)
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/seller/orders?page=${currentPage}&status=${filters.status}&dateRange=${filters.dateRange}`
      );
      if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters, toast]);

  // Appel de fetchOrders lors du changement de page ou de filtres
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Gestion de l'export des commandes
  const handleExport = async () => {
    try {
      toast({
        title: "Export en cours",
        description: "Le fichier sera téléchargé dans quelques instants",
      });
      // Simuler un délai pour l'export
      setTimeout(() => {
        toast({
          title: "Export terminé",
          description: "Le fichier a été téléchargé avec succès",
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les commandes",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Commandes</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => toast({ title: "Filtre indisponible pour le moment" })}>
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
