"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { API_CONFIG } from '@/utils/config';
import Link from 'next/link';
import { FaShoppingCart, FaHeart, FaShoppingBag, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCartContext } from "../context/CartContext";
import { motion } from "framer-motion";

const { BASE_URL } = API_CONFIG;
const DEFAULT_IMAGE = '/default-image.jpg';

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  seller?: {
    id: string;
    shopName: string;
  };
}

const PRODUCTS_PER_PAGE = 20;

const ProductVivriere = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { dispatch } = useCartContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/products/produits-vivriere`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.message || "Erreur lors de la récupération des produits.");
        }
      } catch (error) {
        console.error("Erreur de chargement des produits:", error);
        setError("Impossible de récupérer les produits.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const currentProducts = products.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  const getImageUrl = (product: Product) => product.images?.[0] || DEFAULT_IMAGE;

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    dispatch({ 
      type: "ADD_TO_CART", 
      payload: {
        _id: product.id,
        title: product.name,
        finalPrice: product.price,
        sellerId: product.seller?.id ||'undefine',
        images: product.images,
        quantity: 1
      }
    });
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    handleAddToCart(e, product);
    router.push('/checkout/payment-method');
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (products.length === 0) return <p>Aucun produit disponible.</p>;

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-3xl font-bold text-center">Produits Vivriers</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {currentProducts.map(product => (
          <motion.div key={product.id} whileHover={{ scale: 1.05 }} className="border p-4 rounded shadow">
            <Link href={`/product/${product.id}`}>
              <Image src={getImageUrl(product)} alt={product.name} width={200} height={200} className="w-full h-40 object-cover" />
            </Link>
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-blue-600 font-bold">{product.price.toLocaleString()} CFA</p>
            {product.seller && (
              <p className="text-sm text-gray-500">Vendu par: {product.seller.shopName || 'Inconnu'}</p>
            )}
            <div className="flex gap-2 mt-2">
              <button onClick={(e) => handleAddToCart(e, product)} className="bg-blue-500 text-white px-3 py-1 rounded">Ajouter</button>
              <button onClick={(e) => handleBuyNow(e, product)} className="bg-green-500 text-white px-3 py-1 rounded">Acheter</button>
            </div>
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <FaChevronLeft />
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            <FaChevronRight />
          </button>
        </div>
      )}
    </motion.section>
  );
};

export default ProductVivriere;
