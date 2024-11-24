// "use client";

// import { useState, } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// // import { Card } from "@/components/ui/card";

// interface OrderDetail {
//   id: string;
//   orderNumber: string;
//   status: string;
//   date: string;
//   customer: {
//     name: string;
//     email: string;
//     phone: string;
//   };
//   shipping: {
//     address: string;
//     city: string;
//     postalCode: string;
//     country: string;
//   };
//   products: {
//     id: string;
//     name: string;
//     quantity: number;
//     price: number;
//     status: string;
//   }[];
//   total: number;
// }

// export default function OrderDetailPage() {
//   const params = useParams();
//   const [order] = useState<OrderDetail | null>(null);
//   // const [isLoading, setIsLoading] = useState(true);
//   // const [error, setError] = useState("");

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex items-center mb-6">
//         <Link href="/admin/orders">
//           <Button variant="ghost" className="mr-4">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Retour aux commandes
//           </Button>
//         </Link>
//         <h1 className="text-2xl font-bold">Détails de la commande #{order?.orderNumber}</h1>
//       </div>

//       {/* Contenu détaillé de la commande */}
//       {/* ... Le reste du JSX pour les détails de la commande ... */}
//     </div>
//   );
// } 


// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface OrderDetail {
//   id: string;
//   orderNumber: string;
//   status: string;
//   date: string;
//   customer: {
//     name: string;
//     email: string;
//     phone: string;
//   };
//   shipping: {
//     address: string;
//     city: string;
//     postalCode: string;
//     country: string;
//   };
//   products: {
//     id: string;
//     name: string;
//     quantity: number;
//     price: number;
//     status: string;
//   }[];
//   total: number;
// }

// export default function OrderDetailPage() {
//   const params = useParams();
//   const [order, setOrder] = useState<OrderDetail | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         const response = await fetch(`/api/orders/${params.id}`); // Example API endpoint
//         if (!response.ok) {
//           throw new Error("Erreur lors du chargement de la commande");
//         }
//         const data: OrderDetail = await response.json();
//         setOrder(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (params.id) {
//       fetchOrderDetails();
//     }
//   }, [params.id]);

//   if (isLoading) return <p>Chargement...</p>;
//   if (error) return <p className="text-red-600">{error}</p>;

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex items-center mb-6">
//         <Link href="/admin/orders">
//           <Button variant="ghost" className="mr-4">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Retour aux commandes
//           </Button>
//         </Link>
//         <h1 className="text-2xl font-bold">Détails de la commande #{order?.orderNumber}</h1>
//       </div>

//       {/* Contenu détaillé de la commande */}
//       <div className="bg-white p-4 rounded shadow">
//         <h2 className="font-bold mb-4">Informations client</h2>
//         <p>Nom: {order.customer.name}</p>
//         <p>Email: {order.customer.email}</p>
//         <p>Téléphone: {order.customer.phone}</p>

//         <h2 className="font-bold mt-6 mb-4">Adresse de livraison</h2>
//         <p>{order.shipping.address}</p>
//         <p>{order.shipping.city}, {order.shipping.postalCode}, {order.shipping.country}</p>

//         <h2 className="font-bold mt-6 mb-4">Produits</h2>
//         {order.products.map(product => (
//           <div key={product.id} className="border-b py-2">
//             <p>Nom: {product.name}</p>
//             <p>Quantité: {product.quantity}</p>
//             <p>Prix: {product.price} FCFA</p>
//             <p>Status: {product.status}</p>
//           </div>
//         ))}

//         <h2 className="font-bold mt-6">Total: {order.total} FCFA</h2>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    status: string;
  }[];
  total: number;
}

export default function OrderDetailPage() {
  const [order] = useState<OrderDetail | null>(null);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/orders">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux commandes
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Détails de la commande #{order?.orderNumber}</h1>
      </div>

      {/* Contenu détaillé de la commande */}
      {/* ... Le reste du JSX pour les détails de la commande ... */}
    </div>
  );
}
