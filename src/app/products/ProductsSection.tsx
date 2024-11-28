// "use client";

// import React, { useEffect, useState } from "react";
// import { FaStar } from "react-icons/fa";
// import Link from "next/link";
// const BASE_URL = "https://dubon-server.vercel.app"
// // const BASE_URL = "http://localhost:5000";

// // Interface pour les produits
// interface Product {
//   _id: number;
//   title: string;
//   images: string[];
//   category: string;
//   price: number;
//   rating: number;
//   badge?: string; // Pour les badges comme "Belle Offre" ou "Plus Vendus"
// }

// const ShopPage = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [search, setSearch] = useState("");
//   const [filterCategory, setFilterCategory] = useState<string | null>(null);
//   const [filterRating, setFilterRating] = useState<number | null>(null);
//   const [sortBy, setSortBy] = useState("popular");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/api/product/get-all`);
//         const data = await response.json();
//         setProducts(data);
//         setFilteredProducts(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des produits :", error);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Gestion des filtres
//   useEffect(() => {
//     let filtered = [...products];

//     if (filterCategory) {
//       filtered = filtered.filter((product) => product.category === filterCategory);
//     }

//     if (filterRating) {
//       filtered = filtered.filter((product) => product.rating >= filterRating);
//     }

//     if (search) {
//       filtered = filtered.filter((product) =>
//         product.title.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (sortBy === "low-price") {
//       filtered.sort((a, b) => a.price - b.price);
//     } else if (sortBy === "high-price") {
//       filtered.sort((a, b) => b.price - a.price);
//     }

//     setFilteredProducts(filtered);
//   }, [filterCategory, filterRating, search, sortBy, products]);

//   return (
//     <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
//            {/* Breadcrumb */}
//            <nav className="text-gray-600 text-sm mb-6">
//         <Link href="/" className="hover:underline">
//           Accueil
//         </Link>{" "}
//         &gt;{" "}
//         <Link href="/products" className="hover:underline">
//           Boutique
//         </Link>{" "}
//       </nav>
     
//       {/* Barre latérale (filtres) */}
      
//       <div className="lg:col-span-1">
//         <h3 className="font-bold text-lg mb-4">Catégories</h3>
//         <ul className="space-y-2">
//           {["Produits frais", "Produits Congeles", "Épicerie", "Agro-Alimentaires"].map((category) => (
//             <li key={category}>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="category"
//                   value={category}
//                   onChange={() => setFilterCategory(category)}
//                   checked={filterCategory === category}
//                   className="form-radio"
//                 />
//                 <span>{category}</span>
//               </label>
//             </li>
//           ))}
//         </ul>

//         <h3 className="font-bold text-lg mt-6 mb-4">Prix</h3>
//         {/* Slider pour filtrer par prix */}
//         <input
//           type="range"
//           min="0"
//           max="100000"
//           step="1000"
//           onChange={(e) => setSortBy(e.target.value === "low" ? "low-price" : "high-price")}
//           className="w-full"
//         />

//         <h3 className="font-bold text-lg mt-6 mb-4">Évaluations</h3>
//         <ul className="space-y-2">
//           {[5, 4, 3, 2, 1].map((rating) => (
//             <li key={rating}>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name="rating"
//                   value={rating}
//                   onChange={() => setFilterRating(rating)}
//                   checked={filterRating === rating}
//                   className="form-radio"
//                 />
//                 <span className="flex items-center">
//                   {[...Array(rating)].map((_, i) => (
//                     <FaStar key={i} className="text-yellow-500" />
//                   ))}
//                 </span>
//               </label>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Section principale (produits) */}
//       <div className="lg:col-span-3">
//         <div className="flex justify-between items-center mb-6">
//           {/* Barre de recherche */}
//           <input
//             type="text"
//             placeholder="Rechercher quelque chose"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border px-4 py-2 rounded-lg w-2/3"
//           />
//           {/* Tri des produits */}
//           <select
//             onChange={(e) => setSortBy(e.target.value)}
//             value={sortBy}
//             className="border px-4 py-2 rounded-lg"
//           >
//             <option value="popular">Plus populaire</option>
//             <option value="low-price">Prix croissant</option>
//             <option value="high-price">Prix décroissant</option>
//           </select>
//         </div>
//         {/* <div className="border px-4 py-4 mb-4 bg-gray-50 ">

//         </div> */}
//         {/* Liste des produits */}
//         {loading ? (
//           <p>Chargement...</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {filteredProducts.map((product) => (
//               <div
//                 key={product._id}
//                 className="border rounded-lg p-4 shadow hover:shadow-lg transition"
//               >
//                 {product.badge && (
//                   <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
//                     {product.badge}
//                   </span>
//                 )}
//                 <img
//                   src={product.images[0]}
//                   alt={product.title}
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                 />
//                 <h3 className="text-lg font-bold">{product.title}</h3>
//                 <p className="text-gray-500 mb-2">{product.category}</p>
//                 <div className="flex items-center mb-2">
//                   <span className="text-yellow-500">
//                     {"★".repeat(product.rating)}{" "}
//                     {"☆".repeat(5 - product.rating)}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-blue-800 font-bold">{product.price} FCFA</span>
//                   <button className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
//                     Acheter →
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShopPage;
"use client";

import React, { useEffect, useState } from "react";
import { FaStar, FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/CartContext";
import Image from "next/image";

const BASE_URL = "https://dubon-server.vercel.app";

// Interface pour les produits
interface Product {
  _id: string;
  title: string;
  images: string[];
  category: string;
  price: number;
  rating: number;
  discount?: number;
  badge?: string;
}

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const { state, dispatch } = useCartContext();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/product/get-all`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const finalPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1, finalPrice },
    });
  };

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

  const handleViewProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    let filtered = [...products];

    if (filterCategory) {
      filtered = filtered.filter((product) => product.category === filterCategory);
    }

    if (filterRating) {
      filtered = filtered.filter((product) => product.rating >= filterRating);
    }

    if (search) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "low-price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-price") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [filterCategory, filterRating, search, sortBy, products]);

  const handleCheckout = () => {
    const isAuthenticated = !!localStorage.getItem("token");
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      const hasShippingAddress =
        localStorage.getItem("hasShippingAddress") === "true";
      router.push(hasShippingAddress ? "/checkout" : "/checkout/shipping-address");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Barre latérale (filtres) */}
      <div className="lg:col-span-1">
        <h3 className="font-bold text-lg mb-4">Catégories</h3>
        <ul className="space-y-2">
          {["Produits frais", "Produits Congeles", "Épicerie", "Agro-Alimentaires"].map(
            (category) => (
              <li key={category}>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    onChange={() => setFilterCategory(category)}
                    checked={filterCategory === category}
                    className="form-radio"
                  />
                  <span>{category}</span>
                </label>
              </li>
            )
          )}
        </ul>

        <h3 className="font-bold text-lg mt-6 mb-4">Prix</h3>
        <input
          type="range"
          min="0"
          max="100000"
          step="1000"
          onChange={(e) => setSortBy(e.target.value === "low" ? "low-price" : "high-price")}
          className="w-full"
        />

        <h3 className="font-bold text-lg mt-6 mb-4">Évaluations</h3>
        <ul className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <li key={rating}>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  onChange={() => setFilterRating(rating)}
                  checked={filterRating === rating}
                  className="form-radio"
                />
                <span className="flex items-center">
                  {[...Array(rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Section principale (produits) */}
      <div className="lg:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Rechercher quelque chose"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-2/3"
          />
          <select
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="popular">Plus populaire</option>
            <option value="low-price">Prix croissant</option>
            <option value="high-price">Prix décroissant</option>
          </select>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {filteredProducts.map((product) => (
    <div
      key={product._id}
      className="rounded-lg p-2 shadow-md hover:shadow-lg transition"
    >
      {product.badge && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          {product.badge}
        </span>
      )}
      <Image
        src={product.images[0] || "/placeholder.jpg"}
        alt={product.title}
        className="w-full h-32 sm:h-40 object-cover rounded-md mb-2"
        width={64}
        height={64}
      />

      {/* Boutons d'action visibles */}
      <div className="flex justify-between items-center mb-2 text-xs">
        <button
          className="text-blue-600 bg-blue-100 p-1 rounded-full hover:bg-blue-200 transition"
          onClick={() => handleToggleWishlist(product)}
        >
          <FaHeart size={14} />
        </button>
        <button
          className="text-blue-600 bg-blue-100 p-1 rounded-full hover:bg-blue-200 transition"
          onClick={() => handleAddToCart(product)}
        >
          <FaShoppingCart size={14} />
        </button>
        <button
          className="text-blue-600 bg-blue-100 p-1 rounded-full hover:bg-blue-200 transition"
          onClick={() => handleViewProduct(product._id)}
        >
          <FaEye size={14} />
        </button>
      </div>

      {/* Détails du produit */}
      <h3 className="text-xs sm:text-sm font-bold">{product.title}</h3>
      <p className="text-gray-500 text-xs mb-1">{product.category}</p>
      <span className="text-blue-800 font-bold px-2 text-xs sm:text-sm">{product.price} FCFA</span>
      <button
          className="bg-blue-800 text-white text-xs px-2 py-1 rounded-lg hover:bg-blue-600"
          onClick={handleCheckout}
        >
          Acheter →
        </button>

    </div>
  ))}
</div>

        )}
      </div>
    </div>
  );
};

export default ShopPage;
