"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaTimes, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useCartContext } from "../context/CartContext";
import Image from "next/image";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useCartContext();

  const modalVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { 
      x: "100%", 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Cart Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaShoppingCart className="text-2xl" />
                  <h2 className="text-xl font-bold">Mon Panier</h2>
                  <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-sm">
                    {cart.length} articles
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Image
                    src="/empty-cart.png"
                    alt="Panier vide"
                    width={200}
                    height={200}
                    className="mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-gray-500">
                    Ajoutez des articles pour commencer vos achats
                  </p>
                </motion.div>
              ) : (
                cart.map((item, index) => (
                  <motion.div
                    key={item._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24">
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-blue-600 font-medium mb-3">
                          {item.price} FCFA
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                              className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <FaMinus className="text-xs text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <FaPlus className="text-xs text-gray-600" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {calculateTotal()} FCFA
                  </span>
                </div>
                <button
                  onClick={() => {/* logique de paiement */}}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl
                    font-medium hover:from-blue-700 hover:to-blue-800 transition-colors transform 
                    hover:scale-[1.02] active:scale-[0.98] duration-200"
                >
                  Procéder au paiement
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal; 