import React from "react";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/CartContext";
import ProductImage from "@/components/ui/ProductImage";
import { motion } from "framer-motion";

const ProductSection = ({ products }) => {
  // ... existing code ...
  <div className="relative aspect-square">
    <ProductImage
      images={product.images}
      alt={product.title}
      width={500}
      height={300}
      className="object-cover transition-transform duration-500 group-hover:scale-110"
    />
  </div>
  // ... existing code ...
};

export default ProductSection; 