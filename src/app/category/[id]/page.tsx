'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaShoppingCart, FaHeart, FaEye, FaShieldAlt, FaTruck, FaCreditCard, FaUndo, FaClock, FaCheckCircle } from 'react-icons/fa';
import { Slider } from "@/components/ui/slider";
import { useCartContext } from "@/app/context/CartContext";
import { getCookie } from 'cookies-next';
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const DEFAULT_IMAGE = '/placeholder.jpg';

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
    const path = Array.isArray(images) ? images[0] : images;
    if (!path) return DEFAULT_IMAGE;
  
    // Si c'est une URL Cloudinary, la retourner directement
    if (path.startsWith('http')) {
      return path;
    }

    // Si c'est un chemin relatif, construire l'URL complète
    if (path.startsWith('/')) {
      return `${BASE_URL}${path}`;
    }

    return `${BASE_URL}/${path}`;
  } catch (error) {
    console.error('Erreur dans getImageUrl:', error);
    return DEFAULT_IMAGE;
  }
};

export default function CategoryPage() {
  const params = useParams();
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
        const response = await fetch(`${BASE_URL}/api/products/category/id/${params.id}`);
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

    if (params.id) {
      fetchProducts();
    }
  }, [params.id]);

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Section Filtres */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white p-4 rounded-lg shadow mb-6"
      >
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
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Grille de produits */}
        <div className="lg:w-3/4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-lg shadow-sm overflow-hidden group relative border hover:border-blue-500 transition-all duration-300"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative h-40 sm:h-48">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={getImageUrl(product.images)}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain p-2"
                        priority={true}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = DEFAULT_IMAGE;
                        }}
                      />
                    </motion.div>
                    
                    {/* Actions Overlay */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
                        title="Ajouter au panier"
                      >
                        <FaShoppingCart size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleWishlist(product);
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                        title="Ajouter aux favoris"
                      >
                        <FaHeart 
                          className={state.wishlist.find((item) => item._id === product.id) ? "text-red-500" : ""} 
                          size={16} 
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/product/${product.id}`);
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-all duration-300"
                        title="Voir le produit"
                      >
                        <FaEye size={16} />
                      </motion.button>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs text-gray-500"
                      >
                        {product.subcategory?.name}
                      </motion.span>
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center"
                      >
                        <FaStar className="text-yellow-400 w-4 h-4" />
                        <span className="text-xs text-gray-500 ml-1">4.5</span>
                      </motion.div>
                    </div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-medium text-gray-900 mb-1 truncate"
                    >
                      {product.name}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm text-gray-500 mb-2 line-clamp-2"
                    >
                      {product.shortDescription}
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center justify-between"
                    >
                      <p className="text-blue-600 font-bold">{product.price.toLocaleString()} CFA</p>
                    </motion.div>
                  </motion.div>
                </Link>

                {/* Nouveau bouton Acheter */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="px-4 pb-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.quantity > 0) {
                        handleBuyNow(product);
                      }
                    }}
                    disabled={product.quantity === 0}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                      product.quantity === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {product.quantity === 0 ? 'Indisponible' : 'Acheter maintenant'}
                    {product.quantity > 0 && (
                      <img 
                        src="/Logo blanc.png" 
                        alt="Logo" 
                        className="w-4 h-4"
                      />
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 text-gray-500"
            >
              Aucun produit trouvé avec les filtres sélectionnés.
            </motion.div>
          )}
        </div>

        {/* Sections d'informations */}
        <div className="lg:w-1/4 space-y-6">
          {/* Paiement Sécurisé */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaCreditCard className="text-blue-600 text-2xl" />
              <h3 className="text-lg font-semibold">Paiement Sécurisé</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Nous utilisons FedaPay, une plateforme de paiement sécurisée et fiable en Afrique.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Transactions cryptées
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Paiement mobile simple
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Protection contre la fraude
              </li>
            </ul>
          </motion.div>

          {/* Livraison Rapide */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaTruck className="text-blue-600 text-2xl" />
              <h3 className="text-lg font-semibold">Livraison Express</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Service de livraison rapide et fiable dans toute la région.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <FaClock className="text-blue-500" />
                Livraison en 24-48h
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Suivi en temps réel
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Emballage sécurisé
              </li>
            </ul>
          </motion.div>

          {/* Garantie et Remboursement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-blue-600 text-2xl" />
              <h3 className="text-lg font-semibold">Garantie Qualité</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Nous garantissons la qualité de tous nos produits.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <FaUndo className="text-blue-500" />
                Remboursement sous 7 jours
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Produits authentiques
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Service après-vente réactif
              </li>
            </ul>
          </motion.div>

          {/* Sécurité de la Plateforme */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-blue-600 text-2xl" />
              <h3 className="text-lg font-semibold">Plateforme Sécurisée</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Votre sécurité est notre priorité absolue.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Protection des données
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Vendeurs vérifiés
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Support client 24/7
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}