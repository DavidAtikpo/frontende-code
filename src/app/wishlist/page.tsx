// "use client";

// import React from "react";
// import { useCartContext } from "../context/CartContext"; // Import du contexte
// import Image from "next/image";

// const WishlistPage = () => {
//   const { state, dispatch } = useCartContext(); // Accès au contexte global

//   // Supprimer un produit de la wishlist
//   const handleRemoveFromWishlist = (id: number) => {
//     dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
//   };

//   // Ajouter un produit au panier
//   const handleAddToCart = (id: number) => {
//     const product = state.wishlist.find((item) => item._id === id);
//     if (product) {
//       dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
//       dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id }); // Optionnel : supprimer de la wishlist
//       alert(`Produit "${product.title}" ajouté au panier !`);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Wishlist</h1>
//       {state.wishlist.length === 0 ? (
//         <p className="text-gray-600">Votre wishlist est vide.</p>
//       ) : (
//         <table className="w-full border-collapse bg-white shadow-md">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-4 text-left text-sm font-semibold text-gray-600">PRODUCTS</th>
//               <th className="p-4 text-left text-sm font-semibold text-gray-600">PRICE</th>
//               <th className="p-4 text-left text-sm font-semibold text-gray-600">STOCK STATUS</th>
//               <th className="p-4 text-left text-sm font-semibold text-gray-600">ACTIONS</th>
//             </tr>
//           </thead>
//           <tbody>
//             {state.wishlist.map((item) => (
//               <tr key={item._id} className="border-b hover:bg-gray-50">
//                 <td className="p-4 flex items-center space-x-4">
//                 <Image
//                         src={item.images || "/default-image.jpg"}
//                         alt={item.title || "Produit"}
//                         width={64}
//                         height={64}
//                         className="w-16 h-16 object-cover rounded"
//                       />
//                   <span className="text-sm font-medium text-gray-800">{item.title}</span>
//                 </td>
//                 <td className="p-4">
//                   <span className="text-blue-600 font-bold">${item.finalPrice}</span>
//                 </td>
//                 <td className="p-4">
//                   <span className="text-green-600 font-medium">IN STOCK</span>
//                 </td>
//                 <td className="p-4 flex items-center space-x-4">
//                   <button
//                     onClick={() => handleAddToCart(item._id)}
//                     className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//                   >
//                     ADD TO CART
//                   </button>
//                   <button
//                     onClick={() => handleRemoveFromWishlist(item._id)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     &#x2715;
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default WishlistPage;


"use client";

import React from "react";
import { useCartContext } from "../context/CartContext";
import Image from "next/image";

const WishlistPage = () => {
  const { state, dispatch } = useCartContext();

  // Supprimer un produit de la wishlist
  const handleRemoveFromWishlist = (id: string) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
  };

  // Ajouter un produit au panier
  const handleAddToCart = (id: string) => {
    const product = state.wishlist.find((item) => item._id === id);
    if (product) {
      dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id }); // Optionnel : supprimer de la wishlist
      alert(`Produit "${product.title}" ajouté au panier !`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ma Wishlist</h1>
      {state.wishlist.length === 0 ? (
        <p className="text-gray-600">Votre wishlist est vide.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Produits
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Prix
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Stock
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {state.wishlist.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="p-4 flex items-center space-x-4">
                <Image
                  src={
                    Array.isArray(item.images)
                      ? item.images[0] || "/default-image.jpg" // Utilise le premier élément du tableau ou une image par défaut
                      : item.images || "/default-image.jpg"   // Utilise la chaîne ou une image par défaut
                  }
                  alt={item.title || "Produit"}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded"
                />

                  <span className="text-sm font-medium text-gray-800">
                    {item.title}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-blue-600 font-bold">
                    {item.finalPrice.toFixed(2)} CFA
                  </span>
                </td>
                <td className="p-4">
                  {/* Remplacez "EN STOCK" par un état dynamique si nécessaire */}
                  <span className="text-green-600 font-medium">En Stock</span>
                </td>
                <td className="p-4 flex items-center space-x-4">
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Ajouter au Panier
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    &#x2715;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WishlistPage;
