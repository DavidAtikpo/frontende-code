"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaShoppingCart, FaRegHeart, FaSearch, FaStar, FaFire } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart, onAddToWishlist, onViewProduct }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-lg group relative"
    >
      {/* Badge Hot ou Best Seller */}
      {(product.isHot || product.isBestSeller) && (
        <div className={`absolute top-4 left-4 z-10 ${
          product.isHot ? 'bg-red-500' : 'bg-yellow-500'
        } text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
          <FaFire className={product.isHot ? 'text-white' : 'text-yellow-600'} />
          {product.isHot ? 'Hot' : 'Best Seller'}
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={Array.isArray(product.images) ? product.images[0] : '/placeholder.png'}
          alt={product.title}
          fill
          className="object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay avec boutons */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddToWishlist(product)}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-red-50 transition-colors"
          >
            <FaRegHeart className="text-red-500" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddToCart(product)}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
          >
            <FaShoppingCart className="text-blue-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onViewProduct(product._id)}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          >
            <FaSearch className="text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{product.category}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`${
                index < product.rating ? 'text-yellow-400' : 'text-gray-300'
              } w-4 h-4`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">
              {product.finalPrice} cfa
            </span>
            {product.discount && (
              <span className="text-sm text-gray-400 line-through">
                {product.price} cfa
              </span>
            )}
          </div>
          {product.discount && (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const HomeProducts = ({ products, onAddToCart, onAddToWishlist, onViewProduct }) => {
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
            Découvrez notre sélection de produits les plus appréciés par nos clients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onViewProduct={onViewProduct}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Aucun produit disponible pour le moment
            </p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            Voir plus de produits
            <FaSearch className="text-sm" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeProducts;
