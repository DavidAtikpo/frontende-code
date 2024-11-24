"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaHeart, FaShareAlt, FaStar } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const BASE_URL = "http://localhost:5000/api";

// Define the type for the product
interface Product {
  id: number;
  title: string;
  sku: string;
  vendor: string;
  price: number;
  oldPrice: number;
  discount: number;
  category: string;
  availability: string;
  description: string;
  features?: string[];
  shippingInfo?: { type: string; details: string }[];
  images?: string[];
}

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params?.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product data
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/product-detail/${productId}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  if (!product) {
    return <p className="text-center py-10">Chargement du produit...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-gray-600 text-sm mb-6">
  <Link href="/" className="hover:underline">
    Accueil
  </Link>{" "}
  /{" "}
  <Link href="/products" className="hover:underline">
    Boutique
  </Link>{" "}
  / {product.title}
</nav>

      {/* Upper Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images */}
        <div className="flex flex-col">
          <div className="border rounded-lg overflow-hidden">
            <Image
              src={product.images?.[0] || "/placeholder.jpg"} // Fallback image
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex mt-4 space-x-2 overflow-x-auto">
            {product.images?.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover border rounded cursor-pointer"
              />
            )) || <p>No images available</p>}
          </div>
        </div>

        {/* Product Information */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <div className="flex items-center mb-4">
            <FaStar className="text-yellow-500 mr-1" />
            <FaStar className="text-yellow-500 mr-1" />
            <FaStar className="text-yellow-500 mr-1" />
            <FaStar className="text-yellow-500 mr-1" />
            <FaStar className="text-gray-300" />
            <span className="text-sm text-gray-500 ml-2">(26 avis)</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">SKU: {product.sku}</p>
          <p className="text-sm text-gray-600 mb-2">Vendeur: {product.vendor}</p>
          <p className="text-sm text-gray-600 mb-2">
            Catégorie: <span className="text-blue-600">{product.category}</span>
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-2">{product.price} FCFA</p>
          <p className="text-sm text-gray-500 line-through mb-2">{product.oldPrice} FCFA</p>
          <p className="text-sm text-green-600 mb-4">{product.discount}% de réduction</p>
          <p className={`mb-4 ${product.availability === "Disponible" ? "text-green-600" : "text-red-600"}`}>
            {product.availability}
          </p>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-2 py-1 border rounded hover:bg-gray-200"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-2 py-1 border rounded hover:bg-gray-200"
              >
                +
              </button>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Ajouter au panier
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Acheter
            </button>
          </div>
          <div className="flex items-center mt-4 space-x-4">
            <button className="flex items-center text-gray-600">
              <FaHeart className="mr-2" />
              Ajouter à la liste de souhaits
            </button>
            <button className="flex items-center text-gray-600">
              <FaShareAlt className="mr-2" />
              Partager
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="flex space-x-6 border-b pb-2">
          <button className="font-bold text-blue-600">DESCRIPTION</button>
          <button className="text-gray-600">INFORMATIONS SUPPL.</button>
          <button className="text-gray-600">SPÉCIFICATION</button>
          <button className="text-gray-600">AVIS</button>
        </div>
        <div className="mt-4">
          <p>{product.description}</p>
          <ul className="mt-4 list-disc pl-6">
            {product.features?.map((feature, index) => (
              <li key={index}>{feature}</li>
            )) || <li>Pas de caractéristiques disponibles</li>}
          </ul>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-2">Caractéristiques</h3>
          <ul className="list-disc pl-6">
            {product.features?.map((feature, index) => (
              <li key={index}>{feature}</li>
            )) || <li>Pas de caractéristiques disponibles</li>}
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Informations sur la livraison</h3>
          <ul className="list-disc pl-6">
            {product.shippingInfo?.map((info, index) => (
              <li key={index}>
                <strong>{info.type}:</strong> {info.details}
              </li>
            )) || <li>Pas d&apos;informations disponibles</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
