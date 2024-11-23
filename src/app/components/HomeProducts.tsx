"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/CartContext";

interface Product {
  _id: number;
  title: string;
  images: string | string[];
  category: string;
  price: number;
  rating: number;
  isHot?: boolean;
  isBestDeal?: boolean;
  discount?: number;
  quantity?: number;
}

const HomeProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { state, dispatch } = useCartContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product/get-all");
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

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1 },
    });
  };

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = state.wishlist.find((item) => item._id === product._id);
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product._id });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", payload: { ...product, quantity: 1 } });
    }
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Section de Publicité */}
      <div className="bg-orange-400 col-span-1 rounded-lg overflow-hidden flex flex-col justify-between">
        <div className="p-6 text-black">
          <h3 className="text-lg font-bold">PRODUITS CONGELÉS</h3>
          <h2 className="text-3xl font-bold mt-2">30% de réduction !</h2>
          <p className="mt-4">Sur tous vos produits favoris</p>
          <p className="mt-1 text-sm">
            Offre valide jusqu'à <strong>FIN D'ANNÉE</strong>
          </p>
          <button className="mt-4 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            PROFITEZ MAINTENANT →
          </button>
        </div>
        <img
          className="h-48 object-cover"
          src="/images/publicite.jpg"
          alt="Publicité"
        />
      </div>

      {/* Section des produits */}
      <div className="col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Nos produits en promotion</h2>
          <a
            href="/products"
            className="text-blue-800 hover:underline font-medium"
          >
            Voir tous les produits →
          </a>
        </div>

        {loading ? (
          <p className="text-gray-500">Chargement des produits...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 9).map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition relative group"
              >
                {/* Labels des produits */}
                {product.isHot && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                    HOT
                  </span>
                )}
                {product.isBestDeal && (
                  <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                    BEST DEAL
                  </span>
                )}
                {product.discount && (
                  <span className="absolute top-12 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                    {product.discount}% OFF
                  </span>
                )}

                {/* Image du produit */}
                <img
                  src={Array.isArray(product.images) ? product.images[0] : product.images}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />

                {/* Icônes Wishlist, Panier, Vue */}
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

                {/* Infos produit */}
                <h3 className="text-lg font-bold">{product.title}</h3>
                <p className="text-gray-500 mb-2">{product.category}</p>

                {/* Prix */}
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-bold">{product.price} CFA</span>
                  {product.discount && (
                    <span className="text-gray-500 line-through text-sm ml-2">
                      {(product.price * (1 + product.discount / 100)).toFixed(2)} CFA
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeProducts;
