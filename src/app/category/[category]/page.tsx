"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import { useCartContext } from "../../context/CartContext"; // Contexte global pour gérer le panier et les wishlists

const BASE_URL = "http://localhost:5000/api"; // Backend URL

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number>(Infinity);
  const [advertisements, setAdvertisements] = useState<string[]>([]);
  const { state, dispatch } = useCartContext(); // Global state pour wishlist et panier
  const router = useRouter();

  // Fetch les produits de la catégorie
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/category/get-by-category?category=${category}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des produits");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les produits pour cette catégorie");
      } finally {
        setLoading(false);
      }
    };

    const fetchAdvertisements = async () => {
      try {
        const response = await fetch(`${BASE_URL}/advertisements`);
        const ads = await response.json();
        if (Array.isArray(ads)) setAdvertisements(ads);
      } catch (err) {
        console.error("Erreur lors de la récupération des publicités :", err);
      }
    };

    fetchCategoryProducts();
    fetchAdvertisements();
  }, [category]);

  // Filtrer les produits lorsque l'utilisateur tape ou ajuste le prix
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        product.finalPrice <= priceRange
    );
    setFilteredProducts(filtered);
  }, [searchQuery, priceRange, products]);

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // Gestion des actions utilisateur
  const handleAddToCart = (product: any) => {
    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
  };

  const handleToggleWishlist = (product: any) => {
    const isInWishlist = state.wishlist.find((item: any) => item._id === product._id);
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
    <section className="max-w-7xl  mx-auto px-6 py-10">
      {/* Section des publicités */}

      <div className="flex justify-center mb-8">
        {advertisements.map((ad, index) => (
          <img
            key={index}
            src={ad}
            alt={`Publicité ${index + 1}`}
            className="w-full max-w-sm mx-2 rounded shadow-md"
          />
        ))}
      </div>

      {/* Barre de recherche et filtre par prix */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-1/2"
        />
        <div className="flex items-center space-x-4">
          <label htmlFor="price" className="text-sm text-gray-500">
            Prix max :
          </label>
          <input
            type="number"
            id="price"
            value={priceRange === Infinity ? "" : priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value) || Infinity)}
            className="border border-gray-300 px-4 py-2 rounded w-24"
          />
        </div>
      </div>

      {/* Liste des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
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
                  onClick={() => handleToggleWishlist(product)}
                  className={`text-white p-2 rounded-full transition ${
                    state.wishlist.find((item: any) => item._id === product._id)
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
            </div>

            {/* Informations du produit */}
            <h3 className="text-lg font-bold">{product.title}</h3>
            <p className="text-gray-500 text-sm mb-2">{product.category}</p>

            {/* Prix */}
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-bold">{product.finalPrice} CFA</span>
              {product.discount && (
                <span className="text-gray-500 line-through text-sm ml-2">
                  {product.price} CFA
                </span>
              )}
            </div>

            {/* Bouton d'achat direct */}
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition"
            >
              Acheter maintenant
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryPage;
