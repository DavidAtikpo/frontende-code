'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
import { Slider } from "@/components/ui/slider";
import { useCartContext } from "@/app/context/CartContext";
import { getCookie } from 'cookies-next';
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  shortDescription: string;
  subcategory?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  quantity: number;
  seller: {
    id: string;
  };
}

interface FilterState {
  priceRange: [number, number];
  subcategory: string | null;
  sort: 'price-asc' | 'price-desc' | 'newest' | 'popular';
}

const getImageUrl = (images: string[] | undefined) => {
  if (!images || images.length === 0) return DEFAULT_IMAGE;
  
  try {
    // Si c'est un tableau, prendre la première image
    const path = images[0];
    if (!path) return DEFAULT_IMAGE;
  
    // Retourner l'URL Cloudinary directement
    return path;
  } catch (error) {
    console.error('Erreur dans getImageUrl:', error);
    return DEFAULT_IMAGE;
  }
};

export default function ProduitAlimentairePage() {
  const router = useRouter();
  const { state, dispatch } = useCartContext();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    subcategory: null,
    sort: 'newest'
  });
  const [subcategories, setSubcategories] = useState<Set<string>>(new Set());
  const [maxPrice, setMaxPrice] = useState(1000000);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/category/name/ProduitAlimentaire`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
          // Extraire les sous-catégories uniques
          const subs = new Set(data.data
            .map((p: Product) => p.subcategory?.name)
            .filter((name: string | undefined): name is string => Boolean(name))) as Set<string>;
          setSubcategories(subs);
          // Trouver le prix maximum
          const max = Math.max(...data.data.map((p: Product) => p.price));
          setMaxPrice(max);
          setFilters(prev => ({ ...prev, priceRange: [0, max] }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let result = [...products];

    // Filtre par sous-catégorie
    if (filters.subcategory) {
      result = result.filter(p => p.subcategory?.name === filters.subcategory);
    }

    // Filtre par prix
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Tri
    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        // Implémenter le tri par popularité si disponible
        break;
      case 'newest':
        // Par défaut, les produits sont déjà triés par date
        break;
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      _id: product.id,
      title: product.name,
      images: product.images,
      quantity: 1,
      finalPrice: product.price,
      sellerId: product.seller?.id || ''
    };

    dispatch({
      type: "ADD_TO_CART",
      payload: cartItem
    });

    toast({
      title: "Succès",
      description: "Produit ajouté au panier"
    });
  };

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = state.wishlist.find((item) => item._id === product.id);
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product.id });
      toast({
        title: "Succès",
        description: "Produit retiré des favoris"
      });
    } else {
      dispatch({
        type: "ADD_TO_WISHLIST",
        payload: {
          _id: product.id,
          title: product.name,
          images: product.images,
          finalPrice: product.price,
          sellerId: product.seller?.id || ''
        },
      });
      toast({
        title: "Succès",
        description: "Produit ajouté aux favoris"
      });
    }
  };

  const handleBuyNow = async (product: Product) => {
    try {
      const token = getCookie('token');
      
      if (!token) {
        localStorage.setItem('pendingPurchase', JSON.stringify({
          productId: product.id,
          redirect: '/checkout/shipping-address'
        }));
        
        router.push('/login');
        return;
      }

      dispatch({
        type: "ADD_TO_CART",
        payload: { 
          _id: product.id,
          title: product.name,
          images: product.images,
          quantity: 1, 
          finalPrice: product.price,
          sellerId: product.seller?.id || ''
        },
      });

      router.push('/checkout/shipping-address');
    } catch (error) {
      console.error('Erreur dans handleBuyNow:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Produits Alimentaires</h1>
      
      {/* Section Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtre par sous-catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sous-catégorie
            </label>
            <select
              className="w-full border rounded-md p-2"
              value={filters.subcategory || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                subcategory: e.target.value || null
              }))}
            >
              <option value="">Toutes les sous-catégories</option>
              {Array.from(subcategories).map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Filtre par prix */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix: {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} FCFA
            </label>
            <Slider
              defaultValue={[0, maxPrice]}
              max={maxPrice}
              step={1000}
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                priceRange: value as [number, number]
              }))}
            />
          </div>

          {/* Tri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trier par
            </label>
            <select
              className="w-full border rounded-md p-2"
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                sort: e.target.value as FilterState['sort']
              }))}
            >
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="popular">Popularité</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille de produits */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden group relative border hover:border-blue-500 transition-colors"
          >
            <Link href={`/product/${product.id}`}>
              <div className="relative h-40 sm:h-48">
                <Image
                  src={getImageUrl(product.images)}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = DEFAULT_IMAGE;
                  }}
                />
                
                {/* Actions Overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-colors"
                    title="Ajouter au panier"
                  >
                    <FaShoppingCart size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleWishlist(product);
                    }}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                    title="Ajouter aux favoris"
                  >
                    <FaHeart 
                      className={state.wishlist.find((item) => item._id === product.id) ? "text-red-500" : ""} 
                      size={16} 
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/product/${product.id}`);
                    }}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-colors"
                    title="Voir le produit"
                  >
                    <FaEye size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{product.subcategory?.name}</span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 w-4 h-4" />
                    <span className="text-xs text-gray-500 ml-1">4.5</span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.shortDescription}</p>
                <div className="flex items-center justify-between">
                  <p className="text-blue-600 font-bold">{product.price.toLocaleString()} CFA</p>
                </div>
              </div>
            </Link>

            {/* Bouton Acheter avec effet diagonal */}
            <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden">
              <div 
                className="absolute bottom-0 right-0 w-28 h-28 bg-blue-600 transform rotate-45 translate-x-14 translate-y-6 hover:bg-blue-700 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.quantity > 0) {
                    handleBuyNow(product);
                  }
                }}
              >
                <div className="absolute bottom-6 right-14 transform -rotate-45 flex flex-col items-center top-12">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.quantity > 0) {
                        handleBuyNow(product);
                      }
                    }}
                    disabled={product.quantity === 0}
                    className={`text-white text-sm font-medium ${
                      product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                    }`}
                  >
                    {product.quantity === 0 ? 'Indisponible' : 'Acheter'}
                  </button>
                  <img 
                    src="/Logo blanc.png" 
                    alt="Logo" 
                    className="w-4 h-4 mt-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun produit trouvé avec les filtres sélectionnés.
        </div>
      )}
    </div>
  );
}