// "use client";

// import { useState, useEffect } from "react";
// import { Plus, Search, Filter,
//   //  MoreVertical
//    } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ProductDialog } from "@/components/dashboard/ProductDialog";
// import { ProductCard } from "@/components/dashboard/ProductCard";
// import { useToast } from "@/components/ui/use-toast";

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   images: string[];
//   stock: number;
//   status: "active" | "inactive";
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [
//     // isLoading,
//      setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch("/api/seller/products");
//       if (!response.ok) throw new Error("Erreur lors du chargement des produits");
//       const data = await response.json();
//       setProducts(data);
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Impossible de charger les produits",
//         variant: "destructive",
//       });
//       console.log(error);
      
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Mes Produits</h1>
//         <Button onClick={() => setIsDialogOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Ajouter un produit
//         </Button>
//       </div>

//       <div className="flex gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//           <Input
//             placeholder="Rechercher un produit..."
//             className="pl-10"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline">
//               <Filter className="mr-2 h-4 w-4" />
//               Filtrer
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuItem>Prix croissant</DropdownMenuItem>
//             <DropdownMenuItem>Prix décroissant</DropdownMenuItem>
//             <DropdownMenuItem>Plus récents</DropdownMenuItem>
//             <DropdownMenuItem>Plus anciens</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {filteredProducts.map((product) => (
//           <ProductCard
//             key={product.id}
//             product={product}
//             onUpdate={fetchProducts}
//           />
//         ))}
//       </div>

//       <ProductDialog
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         onSuccess={fetchProducts}
//       />
//     </div>
//   );
// } 



// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { Plus, Search, Filter } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ProductDialog } from "@/components/dashboard/ProductDialog";
// import { ProductCard } from "@/components/dashboard/ProductCard";
// import { useToast } from "@/components/ui/use-toast";

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   images: string[];
//   stock: number;
//   status: "active" | "inactive";
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const { toast } = useToast();

//   // Fonction pour récupérer les produits, mémorisée avec useCallback
//   const fetchProducts = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/seller/products");
//       if (!response.ok) throw new Error("Erreur lors du chargement des produits");
//       const data = await response.json();
//       setProducts(data);
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Impossible de charger les produits",
//         variant: "destructive",
//       });
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [toast]);

//   // Appel à fetchProducts à chaque changement de dépendance
//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   // Filtrer les produits en fonction de la recherche
//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Mes Produits</h1>
//         <Button onClick={() => setIsDialogOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Ajouter un produit
//         </Button>
//       </div>

//       <div className="flex gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//           <Input
//             placeholder="Rechercher un produit..."
//             className="pl-10"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline">
//               <Filter className="mr-2 h-4 w-4" />
//               Filtrer
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuItem>Prix croissant</DropdownMenuItem>
//             <DropdownMenuItem>Prix décroissant</DropdownMenuItem>
//             <DropdownMenuItem>Plus récents</DropdownMenuItem>
//             <DropdownMenuItem>Plus anciens</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {filteredProducts.map((product) => (
//           <ProductCard
//             key={product.id}
//             product={product}
//             onUpdate={fetchProducts}
//           />
//         ))}
//       </div>

//       <ProductDialog
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         onSuccess={fetchProducts}
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