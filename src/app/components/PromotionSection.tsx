// "use client";

// import React, { useEffect, useState } from "react";
// import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { useCartContext } from "../context/CartContext";

// const BASE_URL = "http://localhost:5000";

// interface Product {
//   _id: string;
//   title: string;
//   images: string | string[];
//   category: string;
//   price: number;
//   finalPrice: number;
//   rating: number;
//   discount?: number;
// }

// const PromotionsSection = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [countdown, setCountdown] = useState<string>("");
//   const router = useRouter();
//   const { state, dispatch } = useCartContext();

//   // Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/api/product/promotion`);
//         const data = await response.json();
//         if (Array.isArray(data)) {
//           setProducts(data);
//         } else {
//           console.error("Unexpected data format.");
//         }
//       } catch (error) {
//         console.error("Error fetching promotions:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Countdown logic
//   useEffect(() => {
//     const targetDate = new Date().getTime() + 16 * 24 * 60 * 60 * 1000;
//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = targetDate - now;

//       if (distance <= 0) {
//         clearInterval(interval);
//         setCountdown("Promotion terminée !");
//         return;
//       }

//       const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
//       const seconds = Math.floor((distance % 1000) / 1000);

//       setCountdown(`${days}j : ${hours}h : ${minutes}m : ${seconds}s`);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleAddToCart = (product: Product) => {
//     dispatch({
//       type: "ADD_TO_CART",
//       payload: { ...product, quantity: 1 },
//     });
//   };

//   const handleToggleWishlist = (product: Product) => {
//     const isInWishlist = state.wishlist.find((item) => item._id === product._id);
//     if (isInWishlist) {
//       dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product._id });
//     } else {
//       dispatch({ type: "ADD_TO_WISHLIST", payload: product });
//     }
//   };

//   const handleViewProduct = (productId: string) => {
//     router.push(`/product/${productId}`);
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//         <h2 className="text-2xl font-bold mb-2 sm:mb-0">Promotions</h2>
//         <p className="text-sm text-gray-500">
//           Se termine dans :{" "}
//           <span className="text-yellow-500 font-semibold">{countdown}</span>
//         </p>
//         <a href="/products" className="text-blue-800 hover:underline font-medium mt-2 sm:mt-0">
//           Voir tous les produits →
//         </a>
//       </div>

//       {/* Products grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {products.slice(0, 8).map((product) => (
//           <div
//             key={product._id}
//             className="border rounded-lg p-4 shadow hover:shadow-lg transition relative group"
//           >
//             {/* Image */}
//             <div className="relative">
//               <Image
//                 src={Array.isArray(product.images) ? product.images[0] : "/placeholder.png"}
//                 alt={product.title || "Produit"}
//                 className="w-full h-40 object-cover rounded-md mb-4"
//                 width={300}
//                 height={200}
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button
//                   onClick={() => handleToggleWishlist(product)}
//                   className={`text-white p-2 rounded-full transition ${
//                     state.wishlist.find((item) => item._id === product._id)
//                       ? "bg-red-600 hover:bg-red-800"
//                       : "bg-blue-600 hover:bg-blue-800"
//                   }`}
//                 >
//                   <FaHeart size={20} />
//                 </button>
//                 <button
//                   onClick={() => handleAddToCart(product)}
//                   className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition"
//                 >
//                   <FaShoppingCart size={20} />
//                 </button>
//                 <button
//                   onClick={() => handleViewProduct(product._id)}
//                   className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition"
//                 >
//                   <FaEye size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Details */}
//             <h3 className="text-lg font-bold">{product.title}</h3>
//             <p className="text-gray-500 text-sm mb-2">{product.category}</p>
//             <div className="flex items-center justify-between">
//               <span className="text-blue-800 font-bold">{product.finalPrice} cfa</span>
//               {product.discount && (
//                 <span className="text-gray-500 line-through text-sm ml-2">
//                   {product.price} cfa
//                 </span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default PromotionsSection;


"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartContext } from "../context/CartContext";

const BASE_URL = "http://localhost:5000";
// const BASE_URL = "https://dubon-server.vercel.app";

interface Product {
  _id: string;
  title: string;
  images: string | string[];
  category: string;
  price: number;
  finalPrice: number;
  rating: number;
  discount?: number;
  isHot?: boolean;
  isBestSeller?: boolean;
  quantity?: number;
}

const PromotionsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [countdown, setCountdown] = useState<string>(""); // Compte à rebours
  const router = useRouter();

  const { state, dispatch } = useCartContext();

  // Récupérer les produits en promotion
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/product/promotion`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
  
        const contentType = response.headers.get("Content-Type");
        if (contentType && !contentType.includes("application/json")) {
          throw new Error("Réponse non-JSON reçue.");
        }
  
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.data)) {
          setProducts(data.data); // Si les produits sont dans `data.data`
        } else {
          console.error("Structure inattendue :", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des promotions :", error);
        setProducts([]);
      }
    };
  
    fetchProducts();
  }, []);
  
  // Gérer le compte à rebours pour la promotion
  useEffect(() => {
    const targetDate = new Date().getTime() + 16 * 24 * 60 * 60 * 1000; // 16 jours à partir de maintenant
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % 1000) / 1000);

      setCountdown(`${days}j : ${hours}h : ${minutes}m : ${seconds}s`);

      if (distance < 0) {
        clearInterval(interval);
        setCountdown("Promotion terminée !");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Ajouter un produit au panier
  const handleAddToCart = (product: Product) => {
    const finalPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1, finalPrice },
    });
  };

  // Ajouter ou retirer un produit de la wishlist
  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = state.wishlist.find((item) => item._id === product._id);
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product._id });
    } else {
      const wishlistItem = {
        _id: product._id,
        title: product.title,
        images: product.images,
        finalPrice: product.price,
      };

      dispatch({
        type: "ADD_TO_WISHLIST",
        payload: wishlistItem,
      });
    }
  };

  // Rediriger vers la page de détail du produit
  const handleViewProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Section d'en-tête */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Promotions</h2>
        <p className="text-sm text-gray-500">
          Se termine dans :{" "}
          <span className="text-yellow-500 font-semibold">{countdown}</span>
        </p>
        <a href="/products" className="text-blue-800 hover:underline font-medium">
          Voir tous les produits →
        </a>
      </div>
  
      {/* Grille des produits */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-6 flex overflow-x-auto scrollbar-hide space-x-4">
        {products.slice(0, 8).map((product) => (
          <div
            key={product._id}
            className="rounded-lg p-4 shadow hover:shadow-lg transition relative group min-w-[180px] sm:min-w-[200px] lg:min-w-0"
          >
            {/* Image du produit */}
            <div className="relative">
              <Image
                src={
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : "/placeholder.png"
                }
                alt={product.title || "Produit"}
                className="w-full h-32 object-cover rounded-md mb-4"
                width={200}
                height={150}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className={`text-white p-2 rounded-full transition ${
                    state.wishlist.find((item) => item._id === product._id)
                      ? "bg-red-600 hover:bg-red-800"
                      : "bg-blue-600 hover:bg-blue-800"
                  }`}
                >
                  <FaHeart size={20} />
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition"
                >
                  <FaShoppingCart size={20} />
                </button>
                <button
                  onClick={() => handleViewProduct(product._id)}
                  className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition"
                >
                  <FaEye size={20} />
                </button>
              </div>
            </div>
  
            {/* Informations du produit */}
            <h3 className="text-sm font-bold">{product.title}</h3>
            <p className="text-gray-500 text-xs mb-2">{product.category}</p>
  
            {/* Prix */}
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-bold text-sm">
                {product.finalPrice} cfa
              </span>
              {product.discount && (
                <span className="text-gray-500 line-through text-xs ml-2">
                  {product.price} cfa
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
  
};

export default PromotionsSection;
