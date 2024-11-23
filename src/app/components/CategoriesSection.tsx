"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:5000/api"; // Changez en fonction de votre backend

const ProductsShowcase = () => {
  const [products, setProducts] = useState<any[]>([]); // Tous les produits
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter(); // Utilisation de Next.js router

  // Récupérer les produits au chargement
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/get-all`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }
        const data = await response.json();

        // Organiser les produits par catégorie
        const groupedByCategory: Record<string, any[]> = {};
        data.forEach((product: any) => {
          if (!groupedByCategory[product.category]) {
            groupedByCategory[product.category] = [];
          }
          groupedByCategory[product.category].push(product);
        });

        // Sélectionner 6 produits de différentes catégories
        const selectedProducts: any[] = [];
        for (const category in groupedByCategory) {
          if (selectedProducts.length < 6 && groupedByCategory[category].length > 0) {
            selectedProducts.push(groupedByCategory[category][0]); // Prendre le premier produit de chaque catégorie
          }
        }

        setProducts(selectedProducts);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // Fonction pour rediriger l'utilisateur
  const handleCategoryClick = (category: string) => {
    router.push(`/category/${category}`); // Redirige vers une page de catégorie
  };

  return (
    <section className="max-w-7xl bg-gray-400 mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Voir les categories</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => handleCategoryClick(product.category)} // Redirection sur clic
            className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={product.images || "/placeholder.png"} // Image du produit ou un placeholder
              alt={product.title}
              className="w-full h-32 object-cover mb-4 rounded"
            />
            <h3 className="text-center font-semibold mb-2">{product.title}</h3>
            <p className="text-center text-blue-600 font-bold">{product.category}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsShowcase;
