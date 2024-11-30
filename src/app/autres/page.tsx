// "use client";

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import { FaArrowRight, FaShoppingCart, FaRegHeart, FaMobile, FaLaptop, FaHeadphones } from 'react-icons/fa';

// const ProductCard = ({ title, description, image, price }: {
//   title: string;
//   description: string;
//   image: string;
//   price: string;
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <motion.div
//       className="bg-white rounded-xl overflow-hidden shadow-lg group"
//       onHoverStart={() => setIsHovered(true)}
//       onHoverEnd={() => setIsHovered(false)}
//       whileHover={{ y: -5 }}
//     >
//       <div className="relative h-48 overflow-hidden">
//         <Image
//           src={image}
//           alt={title}
//           fill
//           className="object-cover transition-transform duration-300 group-hover:scale-110"
//         />
//         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
//         <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//           <button className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50">
//             <FaRegHeart className="text-blue-600" />
//           </button>
//           <button className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50">
//             <FaShoppingCart className="text-blue-600" />
//           </button>
//         </div>
//       </div>
//       <div className="p-6">
//         <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
//         <p className="text-gray-600 mb-4">{description}</p>
//         <div className="flex justify-between items-center">
//           <span className="text-blue-600 font-bold text-xl">{price}</span>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors"
//           >
//             Voir plus <FaArrowRight />
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const CategoryButton = ({ icon, label, isActive, onClick }: {
//   icon: React.ReactNode;
//   label: string;
//   isActive: boolean;
//   onClick: () => void;
// }) => (
//   <motion.button
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//     onClick={onClick}
//     className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
//       isActive 
//         ? 'bg-blue-600 text-white shadow-lg' 
//         : 'bg-white text-gray-600 hover:bg-gray-50'
//     }`}
//   >
//     {icon}
//     {label}
//   </motion.button>
// );

// const AutresPage = () => {
//   const [activeCategory, setActiveCategory] = useState('all');

//   const categories = [
//     { id: 'all', label: 'Tous les produits', icon: <FaShoppingCart /> },
//     { id: 'phones', label: 'Téléphones', icon: <FaMobile /> },
//     { id: 'laptops', label: 'Ordinateurs', icon: <FaLaptop /> },
//     { id: 'accessories', label: 'Accessoires', icon: <FaHeadphones /> },
//   ];

//   const products = [
//     {
//       title: "Dubon - Produits Phares",
//       description: "Performance ultime et design élégant pour tous vos besoins.",
//       image: "/product1.jpg",
//       price: "299.99€",
//       category: "phones"
//     },
//     {
//       title: "Accessoires Premium",
//       description: "Complétez votre setup avec nos accessoires haut de gamme.",
//       image: "/product2.jpg",
//       price: "149.99€",
//       category: "accessories"
//     },
//     {
//       title: "Ordinateurs Portables",
//       description: "Puissance et mobilité pour les professionnels.",
//       image: "/product3.jpg",
//       price: "899.99€",
//       category: "laptops"
//     },
//     // Ajoutez plus de produits ici
//   ];

//   const filteredProducts = activeCategory === 'all' 
//     ? products 
//     : products.filter(product => product.category === activeCategory);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
//         <div className="absolute inset-0 z-0">
//           <div className="absolute inset-0 bg-black/30" />
//         </div>
//         <div className="relative z-10 text-center text-white px-4">
//           <motion.h1 
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-4xl md:text-6xl font-bold mb-6"
//           >
//             Découvrez Nos Autres Produits
//           </motion.h1>
//           <motion.p 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-xl md:text-2xl max-w-2xl mx-auto"
//           >
//             Une sélection premium pour répondre à tous vos besoins
//           </motion.p>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="py-16 px-4 md:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Categories */}
//           <div className="flex flex-wrap gap-4 mb-12 justify-center">
//             {categories.map((category) => (
//               <CategoryButton
//                 key={category.id}
//                 icon={category.icon}
//                 label={category.label}
//                 isActive={activeCategory === category.id}
//                 onClick={() => setActiveCategory(category.id)}
//               />
//             ))}
//           </div>

//           {/* Products Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredProducts.map((product, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <ProductCard {...product} />
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Newsletter Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 md:px-8">
//           <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white text-center">
//             <motion.h2 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="text-3xl font-bold mb-4"
//             >
//               Restez Informé
//             </motion.h2>
//             <motion.p 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.2 }}
//               className="text-white/90 mb-8 max-w-2xl mx-auto"
//             >
//               Inscrivez-vous à notre newsletter pour recevoir nos dernières offres et nouveautés
//             </motion.p>
//             <div className="flex flex-col md:flex-row gap-4 justify-center max-w-xl mx-auto">
//               <input
//                 type="email"
//                 placeholder="Votre adresse email"
//                 className="px-6 py-3 rounded-full text-gray-800 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
//               >
//                 S&apos;inscrire
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AutresPage;


"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaArrowRight,
  FaShoppingCart,
  FaRegHeart,
  FaMobile,
  FaLaptop,
  FaHeadphones,
} from "react-icons/fa";

const ProductCard = ({
  title,
  description,
  image,
  price,
}: {
  title: string;
  description: string;
  image: string;
  price: string;
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg group"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50">
            <FaRegHeart className="text-blue-600" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50">
            <FaShoppingCart className="text-blue-600" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold text-xl">{price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            Voir plus <FaArrowRight />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const CategoryButton = ({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "bg-white text-gray-600 hover:bg-gray-50"
    }`}
  >
    {icon}
    {label}
  </motion.button>
);

const AutresPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "Tous les produits", icon: <FaShoppingCart /> },
    { id: "phones", label: "Téléphones", icon: <FaMobile /> },
    { id: "laptops", label: "Ordinateurs", icon: <FaLaptop /> },
    { id: "accessories", label: "Accessoires", icon: <FaHeadphones /> },
  ];

  const products = [
    {
      title: "Dubon - Produits Phares",
      description: "Performance ultime et design élégant pour tous vos besoins.",
      image: "/product1.jpg",
      price: "299.99€",
      category: "phones",
    },
    {
      title: "Accessoires Premium",
      description: "Complétez votre setup avec nos accessoires haut de gamme.",
      image: "/product2.jpg",
      price: "149.99€",
      category: "accessories",
    },
    {
      title: "Ordinateurs Portables",
      description: "Puissance et mobilité pour les professionnels.",
      image: "/product3.jpg",
      price: "899.99€",
      category: "laptops",
    },
  ];

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Découvrez Nos Autres Produits
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto"
          >
            Une sélection premium pour répondre à tous vos besoins
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                icon={category.icon}
                label={category.label}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AutresPage;
