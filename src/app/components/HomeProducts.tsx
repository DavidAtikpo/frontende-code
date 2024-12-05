"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaEye, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/CartContext";
import Image from "next/image";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

const BASE_URL = "https://dubon-server.onrender.com";

interface Product {
  _id: string;
  title: string;
  images: string | string[];
  category: string;
  price: number;
  rating: number;
  isHot?: boolean;
  isBestDeal?: boolean;
  discount?: number;
}

const HomeProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { state, dispatch } = useCartContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/product/get-all`);
        const data = await response.json();
        setProducts(data.slice(0, 8)); // Limiter à 8 produits
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
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
      dispatch({
        type: "ADD_TO_WISHLIST",
        payload: {
          _id: product._id,
          title: product.title,
          images: product.images,
          finalPrice: product.price,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Produits Populaires
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection des produits les plus appréciés
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group"
            >
              <div className="relative aspect-square">
                <Image
                  src={Array.isArray(product.images) ? product.images[0] : product.images}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isHot && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      HOT
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggleWishlist(product)}
                    className={`p-3 rounded-full ${
                      state.wishlist.find((item) => item._id === product._id)
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <FaHeart
                      size={20}
                      className={
                        state.wishlist.find((item) => item._id === product._id)
                          ? "text-white"
                          : "text-red-500"
                      }
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddToCart(product)}
                    className="bg-white p-3 rounded-full hover:bg-gray-100"
                  >
                    <FaShoppingCart size={20} className="text-blue-500" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="bg-white p-3 rounded-full hover:bg-gray-100"
                  >
                    <FaEye size={20} className="text-blue-500" />
                  </motion.button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < product.rating ? "text-yellow-400" : "text-gray-300"
                      } w-4 h-4`}
                    />
                  ))}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">
                      {product.discount
                        ? (product.price * (1 - product.discount / 100)).toFixed(0)
                        : product.price} CFA
                    </span>
                    {product.discount && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.price} CFA
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => router.push('/products')}
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl 
              hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <span className="font-medium">Voir tous les produits</span>
            <FaShoppingCart className="ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeProducts;
