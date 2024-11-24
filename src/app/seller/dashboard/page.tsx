// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ProductDialog } from "@/components/dashboard/ProductDialog";
// import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
// import { SalesChart } from "@/components/dashboard/SalesChart";
// import {
//   // BarChart3,
//   DollarSign,
//   // Package,
//   // ShoppingCart,
//   // TrendingUp,
//   // Users,
//   ArrowUp,
//   ArrowDown,
//   Plus,
// } from "lucide-react";

// export default function DashboardPage() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [
//     // isLoading,
//      setIsLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState({
//     revenue: {
//       total: 0,
//       percentage: 0,
//       trend: "up",
//     },
//     orders: {
//       total: 0,
//       percentage: 0,
//       trend: "up",
//     },
//     products: {
//       total: 0,
//       active: 0,
//     },
//     customers: {
//       total: 0,
//       new: 0,
//     },
//   });

//   useEffect(() => {
//     // Simulation de chargement des données
//     setTimeout(() => {
//       setDashboardData({
//         revenue: {
//           total: 15420,
//           percentage: 12.5,
//           trend: "up",
//         },
//         orders: {
//           total: 156,
//           percentage: 8.2,
//           trend: "up",
//         },
//         products: {
//           total: 48,
//           active: 42,
//         },
//         customers: {
//           total: 312,
//           new: 24,
//         },
//       });
//       setIsLoading(false);
//     }, 1000);
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Tableau de bord</h1>
//         <Button onClick={() => setIsDialogOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Ajouter un produit
//         </Button>
//       </div>

//       {/* Cartes de statistiques */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">
//               Chiffre d&apos;affaires
//             </CardTitle>
//             <DollarSign className="h-4 w-4 text-gray-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{dashboardData.revenue.total.toLocaleString()} €</div>
//             <div className="flex items-center pt-1">
//               {dashboardData.revenue.trend === "up" ? (
//                 <ArrowUp className="h-4 w-4 text-green-500" />
//               ) : (
//                 <ArrowDown className="h-4 w-4 text-red-500" />
//               )}
//               <span className={`text-xs ${dashboardData.revenue.trend === "up" ? "text-green-500" : "text-red-500"}`}>
//                 {dashboardData.revenue.percentage}%
//               </span>
//               <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Autres cartes statistiques similaires pour Orders, Products, Customers */}
//       </div>

//       {/* Graphique et Tableau */}
//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Aperçu des ventes</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <SalesChart />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Ventes récentes</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <RecentSalesTable />
//           </CardContent>
//         </Card>
//       </div>

//       {/* Dialog pour ajouter un produit */}
//       <ProductDialog 
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         onSuccess={() => {
//           // Rafraîchir les données du dashboard
//           // À implémenter avec l'API
//         }}
//       />
//     </div>
//   );
// } 


// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ProductDialog } from "@/components/dashboard/ProductDialog";
// import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
// import { SalesChart } from "@/components/dashboard/SalesChart";
// import { DollarSign, ArrowUp, ArrowDown, Plus } from "lucide-react";

// export default function DashboardPage() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [dashboardData, setDashboardData] = useState({
//     revenue: { total: 0, percentage: 0, trend: "up" },
//     orders: { total: 0, percentage: 0, trend: "up" },
//     products: { total: 0, active: 0 },
//     customers: { total: 0, new: 0 },
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   // Simulation ou appel API pour récupérer les données
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       setIsLoading(true);
//       try {
//         // Simulez un appel API ici
//         setTimeout(() => {
//           setDashboardData({
//             revenue: { total: 15420, percentage: 12.5, trend: "up" },
//             orders: { total: 156, percentage: 8.2, trend: "up" },
//             products: { total: 48, active: 42 },
//             customers: { total: 312, new: 24 },
//           });
//           setIsLoading(false);
//         }, 1000);
//       } catch (error) {
//         console.error("Erreur lors du chargement des données :", error);
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Tableau de bord</h1>
//         <Button onClick={() => setIsDialogOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Ajouter un produit
//         </Button>
//       </div>

//       {/* Cartes de statistiques */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         {/* Carte Chiffre d'affaires */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">
//               Chiffre d&apos;affaires
//             </CardTitle>
//             <DollarSign className="h-4 w-4 text-gray-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{dashboardData.revenue.total.toLocaleString()} €</div>
//             <div className="flex items-center pt-1">
//               {dashboardData.revenue.trend === "up" ? (
//                 <ArrowUp className="h-4 w-4 text-green-500" />
//               ) : (
//                 <ArrowDown className="h-4 w-4 text-red-500" />
//               )}
//               <span className={`text-xs ${dashboardData.revenue.trend === "up" ? "text-green-500" : "text-red-500"}`}>
//                 {dashboardData.revenue.percentage}%
//               </span>
//               <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Carte Commandes */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">Commandes</CardTitle>
//             <DollarSign className="h-4 w-4 text-gray-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{dashboardData.orders.total.toLocaleString()}</div>
//             <div className="flex items-center pt-1">
//               {dashboardData.orders.trend === "up" ? (
//                 <ArrowUp className="h-4 w-4 text-green-500" />
//               ) : (
//                 <ArrowDown className="h-4 w-4 text-red-500" />
//               )}
//               <span className={`text-xs ${dashboardData.orders.trend === "up" ? "text-green-500" : "text-red-500"}`}>
//                 {dashboardData.orders.percentage}%
//               </span>
//               <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Carte Produits */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">Produits</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{dashboardData.products.active} / {dashboardData.products.total}</div>
//           </CardContent>
//         </Card>

//         {/* Carte Clients */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">Clients</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{dashboardData.customers.total.toLocaleString()}</div>
//             <div className="text-sm text-gray-500">{dashboardData.customers.new} nouveaux ce mois-ci</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Graphique et Tableau */}
//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Aperçu des ventes</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <SalesChart />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Ventes récentes</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <RecentSalesTable />
//           </CardContent>
//         </Card>
//       </div>

//       {/* Dialog pour ajouter un produit */}
//       <ProductDialog
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         onSuccess={() => {
//           // Implémentez un rafraîchissement des données si nécessaire
//           console.log("Produit ajouté !");
//         }}
//       />
//     </div>
//   );
// }



import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page