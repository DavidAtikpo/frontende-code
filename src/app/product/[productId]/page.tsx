"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaHeart, FaShareAlt, FaStar, FaShoppingCart, FaCreditCard, FaHome, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { API_CONFIG } from '@/utils/config';
import { useRouter } from "next/navigation";

const { BASE_URL } = API_CONFIG;

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "/placeholder.jpg";
  if (imagePath.startsWith("http")) {
    return imagePath.replace("http://localhost:5000", BASE_URL);
  }
  return `${BASE_URL}/uploads/products/${imagePath.replace(/^\/+/, '')}`;
};

interface Product {
  _id: string;
  title: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  category: string;
  availability: string;
  images: string[];
  features?: string[];
  shippingInfo?: { type: string; details: string }[];
  seller?: {
    storeName: string;
    status: string;
  };
}

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params?.productId;
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAddToCart = (product: Product) => {
    // TODO: Implémenter la logique d'ajout au panier
    alert("Produit ajouté au panier");
  };

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/product-detail/${productId}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        
        if (data.success) {
          console.log("Données reçues:", data);
          const formattedProduct: Product = {
            _id: data.data.id || data.data._id,
            title: data.data.name || data.data.title,
            name: data.data.name || data.data.title,
            sku: data.data.sku || 'N/A',
            description: data.data.description,
            price: data.data.price,
            oldPrice: data.data.compareAtPrice || data.data.oldPrice,
            discount: data.data.discount,
            category: data.data.category?.name || 'Non catégorisé',
            availability: data.data.quantity > 0 ? 'Disponible' : 'Rupture de stock',
            images: Array.isArray(data.data.images) ? data.data.images : [data.data.images],
            seller: {
              storeName: data.data.seller?.storeName || 'Vendeur inconnu',
              status: data.data.seller?.status || 'active'
            }
          };
          setProduct(formattedProduct);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-lg text-gray-600">Produit non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-white px-4 py-3 rounded-lg shadow-sm"
      >
        <Link 
          href="/" 
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          <FaHome className="mr-1" />
          Accueil
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">{product.title}</span>
      </motion.nav>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Section */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-white rounded-xl overflow-hidden border">
            <img
              src={getImageUrl(product?.images?.[selectedImage] || '')}
              alt={product?.title || ''}
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                console.error('Erreur de chargement image:', e);
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.jpg";
              }}
            />
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {product?.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                  ${selectedImage === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <img
                  src={getImageUrl(img)}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.jpg";
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">(26 avis)</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>SKU: <span className="font-medium">{product.sku}</span></p>
              <p>Vendeur: <span className="font-medium">{product.seller?.storeName}</span></p>
              <p>Catégorie: <span className="text-blue-600 hover:underline cursor-pointer">{product.category}</span></p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-blue-600">{product.price} FCFA</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-500 line-through">{product.oldPrice} FCFA</span>
              )}
            </div>
            {product.discount && product.discount > 0 && (
              <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                -{product.discount}% de réduction
              </span>
            )}
            <p className={`font-medium ${
              product.availability === "Disponible" ? "text-green-600" : "text-red-600"
            }`}>
              {product.availability}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleAddToCart(product)}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={product.availability !== "Disponible"}
              >
                <FaShoppingCart />
                <span>Ajouter au panier</span>
              </button>
              <button   
                onClick={() => {
                  if (product.availability === "Disponible") {
                    router.push(`/product/${productId}`);
                  }
                }}
                disabled={product.availability !== "Disponible"}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors
                  ${product.availability === "Disponible" 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                <FaCreditCard />
                <span>Acheter maintenant</span>
              </button>
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <FaHeart />
                <span>Ajouter aux favoris</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <FaShareAlt />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16">
        <div className="border-b">
          <div className="flex space-x-8">
            {['description', 'informations', 'specification', 'avis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              {product.features && (
                <ul className="mt-4 space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {activeTab === 'informations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.shippingInfo?.map((info, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{info.type}</h3>
                  <p className="text-gray-600">{info.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
