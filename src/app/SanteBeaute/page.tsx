"use client";

import { useEffect, useState } from "react";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  subcategory?: {
    id: string;
    name: string;
  };
  seller?: {
    id: string;
  };
}

interface FilterState {
  selectedSubcategories: Set<string>;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
}

export default function SanteBeautePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    selectedSubcategories: new Set<string>(),
    minPrice: 0,
    maxPrice: 1000000,
    sortBy: "newest"
  });
  const [subcategories, setSubcategories] = useState<Set<string>>(new Set());
  const [maxPriceValue, setMaxPriceValue] = useState(1000000);
  const { addToCart, addToWishlist } = useCartContext();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/category/id/5`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.data);
        
        // Extract unique subcategories
        const subs = new Set<string>(data.data
          .map((p: Product) => p.subcategory?.name)
          .filter((name: string | undefined): name is string => Boolean(name)));
        setSubcategories(subs);
        
        // Find maximum price
        const maxPrice = Math.max(...data.data.map((p: Product) => p.price));
        setMaxPriceValue(maxPrice);
        setFilters(prev => ({ ...prev, maxPrice }));
        
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by subcategories
    if (filters.selectedSubcategories.size > 0) {
      filtered = filtered.filter(product => 
        product.subcategory && filters.selectedSubcategories.has(product.subcategory.name)
      );
    }

    // Filter by price
    filtered = filtered.filter(product => 
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Sort products
    switch (filters.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Assuming products are already sorted by date
        break;
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleSubcategoryChange = (subcategory: string) => {
    setFilters(prev => {
      const newSelected = new Set(prev.selectedSubcategories);
      if (newSelected.has(subcategory)) {
        newSelected.delete(subcategory);
      } else {
        newSelected.add(subcategory);
      }
      return { ...prev, selectedSubcategories: newSelected };
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1]
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const sellerId = product.seller?.id || "";
    addToCart(product.id, product.name, product.price, product.images[0], sellerId);
  };

  const handleAddToWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const sellerId = product.seller?.id || "";
    addToWishlist(product.id, product.name, product.price, product.images[0], sellerId);
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const sellerId = product.seller?.id || "";
    addToCart(product.id, product.name, product.price, product.images[0], sellerId);
    router.push("/checkout/shipping-address");
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Santé & Beauté</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Sous-catégories</h3>
            <div className="space-y-2">
              {Array.from(subcategories).map((sub) => (
                <label key={sub} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.selectedSubcategories.has(sub)}
                    onChange={() => handleSubcategoryChange(sub)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{sub}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Prix</h3>
            <div className="px-2">
              <input
                type="range"
                min={0}
                max={maxPriceValue}
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange([filters.minPrice, Number(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{filters.minPrice.toFixed(2)} DT</span>
                <span>{filters.maxPrice.toFixed(2)} DT</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Trier par</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Plus récent</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              Aucun produit ne correspond à vos critères de recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link href={`/product/${product.id}`}>
                    <div className="relative h-48">
                      <Image
                        src={product.images[0] ? `http://localhost:5000/${product.images[0]}` : "/images/placeholder.jpg"}
                        alt={product.name}
                        className="object-cover w-full h-full"
                        width={300}
                        height={200}
                        onError={(e: any) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {product.description.length > 100
                          ? `${product.description.substring(0, 100)}...`
                          : product.description}
                      </p>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">{product.price.toFixed(2)} DT</span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4 pt-0 flex justify-between gap-2">
                    <button
                      onClick={(e) => handleAddToWishlist(e, product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                    >
                      <FaHeart />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                    >
                      <FaShoppingCart />
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(e, product)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Acheter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
