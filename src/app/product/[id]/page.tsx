"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaHeart, FaShoppingCart, FaShare, FaStar, FaFacebook, FaTwitter, FaPinterest } from 'react-icons/fa';
import { useCartContext } from '../../context/CartContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const BASE_URL = "https://dubon-server.vercel.app";

interface Product {
  _id: string;
  title: string;
  images: string[];
  description: string;
  price: number;
  category: string;
  rating: number;
  discount?: number;
  stock?: number;
  reference?: string;
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCartContext();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/product/${params.id}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      const finalPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

      dispatch({
        type: "ADD_TO_CART",
        payload: { ...product, quantity, finalPrice },
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <div>Produit non trouvé</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 
                  ${selectedImage === index ? 'border-blue-600' : 'border-gray-200'}`}
              >
                <Image
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Section Informations */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < product.rating ? 'text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.rating} étoiles)</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-gray-500">Catégorie: {product.category}</p>
            <p className="text-sm text-gray-500">Référence: {product.reference}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-blue-600">
              {product.discount
                ? `${(product.price * (1 - product.discount / 100)).toFixed(0)} FCFA`
                : `${product.price} FCFA`}
            </span>
            {product.discount && (
              <span className="text-lg text-gray-500 line-through">{product.price} FCFA</span>
            )}
            {product.discount && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                -{product.discount}%
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border-r hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 border-l hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <FaShoppingCart />
                <span>Ajouter au panier</span>
              </button>
            </div>

            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <FaHeart />
                <span>Ajouter aux favoris</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <FaShare />
                <span>Partager</span>
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Partager sur les réseaux sociaux</h3>
            <div className="flex space-x-4">
              <button className="text-blue-600 hover:text-blue-800">
                <FaFacebook size={24} />
              </button>
              <button className="text-blue-400 hover:text-blue-600">
                <FaTwitter size={24} />
              </button>
              <button className="text-red-600 hover:text-red-800">
                <FaPinterest size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 