// "use client";

// import React, { useEffect, useState } from "react";
// import { FaStar } from "react-icons/fa";

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
//         const response = await fetch("http://localhost:5000/api/product/get-all");
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
//         <a href="/" className="hover:underline">
//           Accueil
//         </a>{" "}
//         >{" "}
//         <a href="/products" className="hover:underline">
//           Boutique
//         </a>{" "}
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
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// Interface pour les produits
interface Product {
  id: number;
  title: string;
  images: string[];
  category: string;
  price: number;
  rating: number;
  badge?: string; // Pour les badges comme "Belle Offre" ou "Plus Vendus"
}

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product/get-all");
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

  // Gestion des filtres
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

  return (
    <div>
<nav className="text-gray-600 text-sm mb-6">
  <Link href="/" className="hover:underline">
    Accueil
  </Link>{" "}
  /{" "}
  <Link href="/products" className="hover:underline">
    Boutique
  </Link>{" "}
  {/* / {product.title} */}
</nav>
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Barre latérale (filtres) */}
      
      <div className="lg:col-span-1">
        <h3 className="font-bold text-lg mb-4">Catégories</h3>
        <ul className="space-y-2">
          {["Produits frais", "Produits Congeles", "Épicerie", "Agro-Alimentaires"].map((category) => (
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
          ))}
        </ul>

        <h3 className="font-bold text-lg mt-6 mb-4">Prix</h3>
        {/* Slider pour filtrer par prix */}
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
          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="Rechercher quelque chose"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-2/3"
          />
          {/* Tri des produits */}
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

        {/* Liste des produits */}
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                {product.badge && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-bold">{product.title}</h3>
                <p className="text-gray-500 mb-2">{product.category}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">
                    {"★".repeat(product.rating)}{" "}
                    {"☆".repeat(5 - product.rating)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-bold">{product.price} FCFA</span>
                  <button className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Acheter →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default ShopPage;
