"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaHeart, FaShareAlt } from "react-icons/fa";

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
  features?: string[]; // Marked as optional to handle undefined
  shippingInfo?: { type: string; details: string }[]; // Optional
  images?: string[]; // Optional
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch the product data
  useEffect(() => {
    if (!productId) return; // Ensure productId exists
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/product-detail/${productId}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching the product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  if (!product) {
    return <p className="text-center py-10">Loading product...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Upper Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images */}
        <div className="flex flex-col">
          <div className="border rounded-lg overflow-hidden">
            <img
              src={product.images?.[0] || "/placeholder.jpg"} // Fallback image
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex mt-4 space-x-2">
            {product.images?.map((img, index) => (
              <img
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
          <p className="text-sm text-gray-600 mb-4">SKU: {product.sku}</p>
          <p className="text-sm text-gray-600 mb-4">Vendor: {product.vendor}</p>
          <p className="text-2xl font-bold text-blue-600 mb-2">{product.price} FCFA</p>
          <p className="text-sm text-gray-500 line-through mb-2">{product.oldPrice} FCFA</p>
          <p className="text-sm text-green-600">{product.discount}% off</p>
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
              Add to Cart
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Buy Now
            </button>
          </div>
          <div className="flex items-center mt-4 space-x-4">
            <button className="flex items-center text-gray-600">
              <FaHeart className="mr-2" />
              Add to Wishlist
            </button>
            <button className="flex items-center text-gray-600">
              <FaShareAlt className="mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for Description */}
      <div className="mt-8">
        <div className="flex space-x-6 border-b pb-2">
          <button className="font-bold text-blue-600">DESCRIPTION</button>
        </div>
        <div className="mt-4">
          <p>{product.description}</p>
          <ul className="mt-4 list-disc pl-6">
            {product.features?.map((feature, index) => (
              <li key={index}>{feature}</li>
            )) || <li>No features available</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
