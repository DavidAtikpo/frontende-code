"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { API_CONFIG } from '@/utils/config';
import Link from 'next/link';
import { FaShoppingCart, FaHeart, FaShoppingBag, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCartContext } from "../context/CartContext";

const { BASE_URL } = API_CONFIG;
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  mainImage: string;
  seller?: {
    id: string;
    storeName: string;
  };
}

const PRODUCTS_PER_PAGE = 20;

const ProductVivriere = () => {
  const [produitsFrais, setProduitsFrais] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { state, dispatch } = useCartContext();

  const totalPages = Math.ceil(produitsFrais.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = produitsFrais.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchProduitsFrais = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/products/produits-vivriere`);
        const data = await response.json();
        
        if (data.success) {
          setProduitsFrais(data.data);
        } else {
          setError(data.message || "Erreur lors de la récupération des produits vivriere");
        }
      } catch (error) {
        console.error("Erreur:", error);
        setError("Erreur lors de la récupération des produits vivriere");
      } finally {
        setLoading(false);
      }
    };

    fetchProduitsFrais();
  }, []);

  const getImageUrl = (product: Product) => {
    if (product.mainImage) {
      return `${BASE_URL}/${product.mainImage}`;
    }
    if (product.images && product.images.length > 0) {
      return `${BASE_URL}/${product.images[0]}`;
    }
    return '/placeholder.jpg';
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Empêcher la navigation
    dispatch({ 
      type: "ADD_TO_CART", 
      payload: {
        _id: product.id,
        title: product.name,
        finalPrice: product.price,
        sellerId: product.seller?.storeName || 'unknown',
        images: product.images,
        quantity: 1
      }
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Empêcher la navigation
    dispatch({
      type: "ADD_TO_WISHLIST",
      payload: {
        _id: product.id,
        title: product.name,
        finalPrice: product.price,
        sellerId: product.seller?.storeName || 'unknown',
        images: product.images
      }
    });
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Empêcher la navigation
    dispatch({ 
      type: "ADD_TO_CART", 
      payload: {
        _id: product.id,
        title: product.name,
        finalPrice: product.price,
        sellerId: product.seller?.storeName || 'unknown',
        images: product.images,
        quantity: 1
      }
    });
    router.push('/checkout/payment-method');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des produits vivriere...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (produitsFrais.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center text-gray-600">
          <p>Aucun produit vivriere disponible pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-8 text-center">Nos Produits vivriere</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {produitsFrais.slice(0, 20).map((product) => (
          <div key={product.id} className="border-2 border-blue-500 rounded-lg p-3 hover:shadow-lg transition-all duration-300 bg-white relative group">
            <div className="relative aspect-square mb-2">
              <Link href={`/product/${product.id}`}>
                <Image 
                  src={getImageUrl(product)} 
                  alt={product.name} 
                  width={200}
                  height={200}
                  className="object-cover rounded-md w-full h-full"
                />
              </Link>
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleAddToWishlist(e, product)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  title="Ajouter à la liste de souhaits"
                >
                  <FaHeart className="text-red-500" size={14} />
                </button>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors"
                  title="Ajouter au panier"
                >
                  <FaShoppingCart className="text-blue-500" size={14} />
                </button>
              </div>
            </div>
            <h4 className="text-sm font-semibold truncate">{product.name}</h4>
            <p className="text-blue-800 font-bold mt-1 text-sm">{product.price.toLocaleString()} CFA</p>
            {product.seller && (
              <Link 
                href={`/store/${product.seller.id}`}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 block"
              >
                {product.seller.storeName}
              </Link>
            )}
            <button
              onClick={(e) => handleBuyNow(e, product)}
              className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <FaShoppingBag size={14} />
              <span>Acheter</span>
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft size={20} />
          </button>
          <span className="text-sm">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductVivriere;
