import React from "react";

interface Product {
  id: number;
  title: string;
  images: string | string[];
  category: string;
  price: number;
  rating?: number;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img
        src={Array.isArray(product.images) ? product.images[0] : product.images}
        alt={product.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-bold">{product.title}</h3>
      <p className="text-gray-500 mb-2">{product.category}</p>
      <div className="flex items-center mb-2">
        <span className="text-yellow-500">★★★★★</span>
        <span className="text-gray-500 ml-2">({product.rating || 0})</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-blue-800 font-bold">${product.price}</span>
        <button className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Acheter →
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
