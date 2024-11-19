"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Product {
  _id: number;
  title: string;
  images: string | string[];
  category: string;
  price: number;
  discountPrice: number;
  rating: number;
  discount?: number;
  isHot?: boolean;
  isBestSeller?: boolean;
  quantity?: number; // Ajout pour gérer les quantités
}

const PromotionsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [countdown, setCountdown] = useState<string>(""); // Compte à rebours
  const [cart, setCart] = useState<Product[]>([]); // Panier
  const [wishlist, setWishlist] = useState<Product[]>([]); // Liste de souhaits
  const router = useRouter();

  // Récupérer les produits en promotion
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/product/promotions");
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Données inattendues : ce n'est pas un tableau.");
          setProducts([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des promotions :", error);
      }
    };

    fetchProducts();
  }, []);

  // Gérer le compte à rebours pour la promotion
  useEffect(() => {
    const targetDate = new Date().getTime() + 16 * 24 * 60 * 60 * 1000; // 16 jours à partir de maintenant
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % 1000) / 1000);

      setCountdown(`${days}d : ${hours}h : ${minutes}m : ${seconds}s`);

      if (distance < 0) {
        clearInterval(interval);
        setCountdown("Promotion terminée !");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Ajouter un produit au panier
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingProduct = prev.find((item) => item._id === product._id);
      if (existingProduct) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    console.log("Panier mis à jour :", product);
    alert(`Ajouté au panier : ${product.title}`);
  };

  // Ajouter un produit à la liste de souhaits
  const handleAddToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item._id === product._id)) {
        alert("Produit déjà ajouté à la liste de souhaits !");
        return prev;
      }
      return [...prev, product];
    });
    alert(`Ajouté à la liste de souhaits : ${product.title}`);
  };

  // Rediriger vers la page de détail du produit
  const handleViewProduct = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Section d'en-tête */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Promotions</h2>
        <p className="text-sm text-gray-500">
          Se termine dans :{" "}
          <span className="text-yellow-500 font-semibold">{countdown}</span>
        </p>
        <a href="/products" className="text-blue-800 hover:underline font-medium">
          Voir tous les produits →
        </a>
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition relative group"
          >
            {/* Image du produit */}
            <div className="relative">
              <img
                src={Array.isArray(product.images) ? product.images[0] : product.images}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-800 transition"
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
            </div>

            {/* Informations du produit */}
            <h3 className="text-lg font-bold">{product.title}</h3>
            <p className="text-gray-500 text-sm mb-2">{product.category}</p>

            {/* Prix */}
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-bold">${product.discountPrice}</span>
              {product.discount && (
                <span className="text-gray-500 line-through text-sm ml-2">
                  ${product.price}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromotionsSection;
