// "use client";

// import React, { useEffect, useState } from "react";
// import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import { useCartContext } from "../context/CartContext";
// import Image from "next/image";

// interface Product {
//   _id: number;
//   title: string;
//   images: string | string[];
//   category: string;
//   price: number;
//   rating: number;
//   isHot?: boolean;
//   isBestDeal?: boolean;
//   discount?: number;
//   quantity?: number;
// }

// const HomeProducts = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const { state, dispatch } = useCartContext();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/product/get-all");
//         const data = await response.json();
//         setProducts(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des produits :", error);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
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
//       dispatch({ type: "ADD_TO_WISHLIST", payload: { ...product, quantity: 1 } });
//     }
//   };

//   const handleViewProduct = (productId: number) => {
//     router.push(`/product/${productId}`);
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
//       {/* Section de Publicité */}
//       <div className="bg-orange-400 col-span-1 rounded-lg overflow-hidden flex flex-col justify-between">
//         <div className="p-6 text-black">
//           <h3 className="text-lg font-bold">PRODUITS CONGELÉS</h3>
//           <h2 className="text-3xl font-bold mt-2">30% de réduction !</h2>
//           <p className="mt-4">Sur tous vos produits favoris</p>
//           <p className="mt-1 text-sm">
//             Offre valide jusqu&apos;à <strong>FIN D&apos;ANNÉE</strong>
//           </p>
//           <button className="mt-4 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//             PROFITEZ MAINTENANT →
//           </button>
//         </div>
//         <Image
//           className="h-48 object-cover"
//           src="/images/publicite.jpg"
//           width={10}
//           height={10}
//           alt="Publicité"
//         />
//       </div>

//       {/* Section des produits */}
//       <div className="col-span-3">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">Nos produits en promotion</h2>
//           <a
//             href="/products"
//             className="text-blue-800 hover:underline font-medium"
//           >
//             Voir tous les produits →
//           </a>
//         </div>

//         {loading ? (
//           <p className="text-gray-500">Chargement des produits...</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.slice(0, 9).map((product) => (
//               <div
//                 key={product._id}
//                 className="border rounded-lg p-4 shadow hover:shadow-lg transition relative group"
//               >
//                 {/* Labels des produits */}
//                 {product.isHot && (
//                   <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
//                     HOT
//                   </span>
//                 )}
//                 {product.isBestDeal && (
//                   <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
//                     BEST DEAL
//                   </span>
//                 )}
//                 {product.discount && (
//                   <span className="absolute top-12 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
//                     {product.discount}% OFF
//                   </span>
//                 )}

//                 {/* Image du produit */}
//                 <Image
//                   src={Array.isArray(product.images) ? product.images[0] : product.images}
//                   alt={product.title}
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                   width={300}
//                   height={200}
//                 />

//                 {/* Icônes Wishlist, Panier, Vue */}
//                 <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <button
//                     onClick={() => handleToggleWishlist(product)}
//                     className={`text-white p-2 rounded-full transition ${
//                       state.wishlist.find((item) => item._id === product._id)
//                         ? "bg-red-600 hover:bg-red-800"
//                         : "bg-blue-600 hover:bg-blue-800"
//                     }`}
//                   >
//                     <FaHeart size={20} />
//                   </button>
//                   <button
//                     onClick={() => handleAddToCart(product)}
//                     className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition"
//                   >
//                     <FaShoppingCart size={20} />
//                   </button>
//                   <button
//                     onClick={() => handleViewProduct(product._id)}
//                     className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition"
//                   >
//                     <FaEye size={20} />
//                   </button>
//                 </div>

//                 {/* Infos produit */}
//                 <h3 className="text-lg font-bold">{product.title}</h3>
//                 <p className="text-gray-500 mb-2">{product.category}</p>

//                 {/* Prix */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-blue-800 font-bold">{product.price} CFA</span>
//                   {product.discount && (
//                     <span className="text-gray-500 line-through text-sm ml-2">
//                       {(product.price * (1 + product.discount / 100)).toFixed(2)} CFA
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default HomeProducts;


// "use client";

// import React, { useEffect, useState } from "react";
// import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import { useCartContext } from "../context/CartContext";
// import Link from "next/link";
// import Image from "next/image";


// interface Product {
//   _id: string; // Uniformisé en string pour MongoDB
//   title: string;
//   images: string | string[];
//   category: string;
//   price: number;
//   rating: number;
//   isHot?: boolean;
//   isBestDeal?: boolean;
//   discount?: number;
// }

// const HomeProducts = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const { state, dispatch } = useCartContext();

//   // Récupération des produits
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/product/get-all");
//         const data = await response.json();
//         setProducts(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des produits :", error);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Gestion de l'ajout au panier
//   const handleAddToCart = (product: Product) => {
//     const finalPrice = product.discount
//       ? product.price * (1 - product.discount / 100)
//       : product.price;

//     dispatch({
//       type: "ADD_TO_CART",
//       payload: { ...product, quantity: 1, finalPrice },
//     });
//   };

//   // Gestion des favoris (wishlist)
//   const handleToggleWishlist = (product: Product) => {
//     const isInWishlist = state.wishlist.find((item) => item._id === product._id);
//     if (isInWishlist) {
//       dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product._id });
//     } else {
//       const wishlistItem: WishlistItem = {
//         _id: product._id,
//         title: product.title,
//         images: product.images,
//         finalPrice: product.price, // Adaptez si nécessaire
//       };
  
//       dispatch({
//         type: "ADD_TO_WISHLIST",
//         payload: wishlistItem,
//       });
//     }
//   };
  

//   // Redirection vers la page de détail du produit
//   const handleViewProduct = (productId: string) => {
//     router.push(`/product/${productId}`);
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
//       {/* Section de Publicité */}
//       <div className="bg-orange-400 col-span-1 rounded-lg overflow-hidden flex flex-col justify-between">
//         <div className="p-6 text-black">
//           <h3 className="text-lg font-bold">PRODUITS CONGELÉS</h3>
//           <h2 className="text-3xl font-bold mt-2">30% de réduction !</h2>
//           <p className="mt-4">Sur tous vos produits favoris</p>
//           <p className="mt-1 text-sm">
//             Offre valide jusqu&apos;à <strong>FIN D&apos;ANNÉE</strong>
//           </p>
//           <button className="mt-4 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//             PROFITEZ MAINTENANT →
//           </button>
//         </div>
//         <Image
//           className="h-48 object-cover"
//           src="/images/publicite.jpg"
//           width={300}
//           height={300}
//           alt="Publicité"
//         />
//       </div>

//       {/* Section des produits */}
//       <div className="col-span-3">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">Nos produits en promotion</h2>
//           <Link
//             href="/products"
//             className="text-blue-800 hover:underline font-medium"
//           >
//             Voir tous les produits →
//           </Link>
//         </div>

//         {loading ? (
//           <p className="text-gray-500">Chargement des produits...</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.slice(0, 9).map((product) => (
//               <div
//                 key={product._id}
//                 className="border rounded-lg p-4 shadow hover:shadow-lg transition relative group"
//               >
//                 {/* Labels des produits */}
//                 {product.isHot && (
//                   <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
//                     HOT
//                   </span>
//                 )}
//                 {product.isBestDeal && (
//                   <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
//                     BEST DEAL
//                   </span>
//                 )}
//                 {product.discount && (
//                   <span className="absolute top-12 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
//                     {product.discount}% OFF
//                   </span>
//                 )}

//                 {/* Image du produit */}
//                 <Image
//                   src={
//                     Array.isArray(product.images) && product.images.length > 0
//                       ? product.images[0]
//                       : "/default-product.jpg" // Image par défaut si aucune image disponible
//                   }
//                   alt={product.title}
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                   width={300}
//                   height={200}
//                 />

//                 {/* Icônes Wishlist, Panier, Vue */}
//                 <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <button
//                     onClick={() => handleToggleWishlist(product)}
//                     className={`text-white p-2 rounded-full transition ${
//                       state.wishlist.find((item) => item._id === product._id)
//                         ? "bg-red-600 hover:bg-red-800"
//                         : "bg-blue-600 hover:bg-blue-800"
//                     }`}
//                   >
//                     <FaHeart size={20} />
//                   </button>
//                   <button
//                     onClick={() => handleAddToCart(product)}
//                     className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition"
//                   >
//                     <FaShoppingCart size={20} />
//                   </button>
//                   <button
//                     onClick={() => handleViewProduct(product._id)}
//                     className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition"
//                   >
//                     <FaEye size={20} />
//                   </button>
//                 </div>

//                 {/* Infos produit */}
//                 <h3 className="text-lg font-bold">{product.title}</h3>
//                 <p className="text-gray-500 mb-2">{product.category}</p>

//                 {/* Prix */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-blue-800 font-bold">{product.price} CFA</span>
//                   {product.discount && (
//                     <span className="text-gray-500 line-through text-sm ml-2">
//                       {(product.price / (1 - product.discount / 100)).toFixed(2)} CFA
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default HomeProducts;


"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/CartContext";
// import Link from "next/link";
import Image from "next/image";

// const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://dubon-server.vercel.app";

// Interface pour les produits
interface Product {
  _id: string; // Utilisé comme string pour MongoDB
  title: string;
  images: string | string[];
  category: string;
  price: number;
  rating: number;
  isHot?: boolean;
  isBestDeal?: boolean;
  discount?: number;
}

// Composant HomeProducts
const HomeProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { state, dispatch } = useCartContext();

  // Récupération des produits via API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/product/get-all`);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Ajouter au panier
  const handleAddToCart = (product: Product) => {
    const finalPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1, finalPrice },
    });
  };

  // Gérer l'ajout ou la suppression dans la wishlist
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

  // Redirection vers la page du produit
  const handleViewProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <section className="max-w-7xl mx-auto  ">
      <div className="bg-orange-400 rounded-lg overflow-hidden flex flex-col justify-between w-full mb-10">
        <div className="p-6 text-black">
          <h3 className="text-base md:text-lg font-bold">PRODUITS CONGELÉS</h3>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">30% de réduction !</h2>
          <p className="text-sm md:text-base mt-4">Sur tous vos produits favoris</p>
          <p className="text-xs md:text-sm mt-1">
            Offre valide jusqu&apos;à <strong>FIN D&apos;ANNÉE</strong>
          </p>
          <button className="mt-4 bg-blue-800 text-white px-3 py-2 rounded-lg text-xs md:text-sm hover:bg-blue-600 transition">
            PROFITEZ MAINTENANT →
          </button>
        </div>
        <Image
          className="h-48 w-full object-cover"
          src="/images/publicite.jpg"
          width={300}
          height={300}
          alt="Publicité"
        />
      </div>

      {loading ? (
        <p className="text-gray-500  text-center">Chargement des produits...</p>
      ) : (
        <div className="overflow-x-auto p-5 py-4">
          <div className="flex space-x-4 min-w-max scrollbar-hide">
            {products.map((product) => (
              <div
                key={product._id}
                className="p-1 hover:shadow-lg transition relative group w-32 sm:w-40 md:w-48"
              >
                {product.isHot && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-1 py-0.5 text-[10px] sm:text-xs rounded">
                    HOT
                  </span>
                )}
                {product.isBestDeal && (
                  <span className="absolute top-2 right-2 bg-blue-500 text-white px-1 py-0.5 text-[10px] sm:text-xs rounded">
                    BEST DEAL
                  </span>
                )}
                {product.discount && (
                  <span className="absolute top-12 right-2 bg-green-500 text-white px-1 py-0.5 text-[10px] sm:text-xs rounded">
                    {product.discount}% OFF
                  </span>
                )}

                <Image
                  src={
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0]
                      : "/default-product.jpg"
                  }
                  alt={product.title}
                  className="w-full h-32 sm:h-40 md:h-48 object-cover mb-2 rounded"
                  width={300}
                  height={200}
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

                <h3 className="text-sm md:text-base font-bold">{product.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm mb-1">{product.category}</p>

                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-bold text-sm">{product.price} CFA</span>
                  {product.discount && (
                    <span className="text-gray-500 line-through text-xs ml-1">
                      {product.price} CFA
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  
    );
};

export default HomeProducts;
