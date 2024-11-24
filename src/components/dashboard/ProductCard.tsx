// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Edit, Trash2, MoreVertical } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
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

// interface ProductCardProps {
//   product: Product;
//   onUpdate: () => void;
// }

// export function ProductCard({ product, onUpdate }: ProductCardProps) {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleDelete = async () => {
//     if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    
//     setIsLoading(true);
//     try {
//       const response = await fetch(`/api/seller/products/${product.id}`, {
//         method: "DELETE",
//       });
      
//       if (!response.ok) throw new Error("Erreur lors de la suppression");
      
//       toast({
//         title: "Succès",
//         description: "Produit supprimé avec succès",
//       });
//       onUpdate();
//     } catch (error) {
//       console.log(error);
      
//       toast({
//         title: "Erreur",
//         description: "Impossible de supprimer le produit",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardContent className="p-0">
//         <div className="relative h-48 w-full">
//           <Image
//             src={product.images[0] || "/placeholder.png"}
//             alt={product.name}
//             fill
//             className="object-cover rounded-t-lg"
//           />
//           <div className="absolute top-2 right-2">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                   <MoreVertical className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem>
//                   <Edit className="h-4 w-4 mr-2" />
//                   Modifier
//                 </DropdownMenuItem>
//                 <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Supprimer
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="font-semibold truncate">{product.name}</h3>
//             <Badge variant={product.status === "active" ? "success" : "secondary"}>
//               {product.status === "active" ? "Actif" : "Inactif"}
//             </Badge>
//           </div>
//           <p className="text-sm text-gray-500 mb-2 line-clamp-2">
//             {product.description}
//           </p>
//           <div className="flex items-center justify-between">
//             <span className="font-bold text-lg">{product.price}€</span>
//             <span className="text-sm text-gray-500">Stock: {product.stock}</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// } 


"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MoreVertical, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  status: "active" | "inactive";
}

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
}

export function ProductCard({ product, onUpdate }: ProductCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/seller/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast({
        title: "Succès",
        description: "Produit supprimé avec succès",
      });
      onUpdate();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isLoading}>
                  {isLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreVertical className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold truncate">{product.name}</h3>
            <Badge variant={product.status === "active" ? "success" : "secondary"}>
              {product.status === "active" ? "Actif" : "Inactif"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">{product.price}€</span>
            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
