import React from "react";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/CartContext";
import ProductImage from "./ProductImage";
import { motion } from "framer-motion";

interface Product {
  id: string;
  title: string;
  images: string[];
  price: number;
}

interface ProductSectionProps {
  products: Product[];
}

const ProductSection = ({ products }: ProductSectionProps) => {
  const router = useRouter();
  const { addToCart } = useCartContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <div className="relative aspect-square">
            <ProductImage
              images={product.images}
              alt={product.title}
              width={500}
              height={300}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => addToCart({
                  ...product,
                  _id: product.id,
                  quantity: 1,
                  finalPrice: product.price || 0
                })}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg hover:bg-gray-100"
              >
                <FaShoppingCart /> Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSection; 