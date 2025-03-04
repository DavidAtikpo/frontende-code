'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaShoppingCart, FaHeart, FaEye, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useCartContext } from "@/app/context/CartContext";
import { getCookie } from 'cookies-next';
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { API_CONFIG } from '@/utils/config';
import ChatBox from "@/app/components/ChatBox";

const { BASE_URL } = API_CONFIG;

const DEFAULT_IMAGE = '/placeholder.jpg';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  shortDescription: string;
  quantity: number;
  seller: {
    id: string;
  };
}

interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  totalReviews: number;
  businessHours: {
    open: string;
    close: string;
  };
  seller: {
    id: string;
  };
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

const getImageUrl = (images: string[] | undefined) => {
  if (!images || images.length === 0) return DEFAULT_IMAGE;
  
  try {
    const path = Array.isArray(images) ? images[0] : images;
    if (!path) return DEFAULT_IMAGE;
  
    if (path.startsWith('http')) {
      return path;
    }

    if (path.startsWith('/')) {
      return `${BASE_URL}${path}`;
    }

    return `${BASE_URL}/${path}`;
  } catch (error) {
    console.error('Erreur dans getImageUrl:', error);
    return DEFAULT_IMAGE;
  }
};

export default function ShopPage() {
  const params = useParams();
  const router = useRouter();
  const { dispatch } = useCartContext();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Récupérer les informations de la boutique
        const shopResponse = await fetch(`${BASE_URL}/api/shops/${params.shopId}`);
        const shopData = await shopResponse.json();
        
        if (shopData.success) {
          setShop(shopData.data);
        } else {
          throw new Error(shopData.message || 'Erreur lors de la récupération des informations de la boutique');
        }

        // Récupérer les produits de la boutique
        const productsResponse = await fetch(`${BASE_URL}/api/products/by-shop/${params.shopId}?page=${currentPage}`);
        const productsData = await productsResponse.json();

        if (productsData.success && Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        } else if (productsData.data && Array.isArray(productsData.data.rows)) {
          // Si les données sont dans un format paginé
          setProducts(productsData.data.rows);
        } else {
          setProducts([]);
          console.warn('Format de données des produits inattendu:', productsData);
        }

        if (productsData.data && productsData.data.pagination) {
          setPagination(productsData.data.pagination);
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (params.shopId) {
      fetchShopAndProducts();
    }
  }, [params.shopId, currentPage]);

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { 
        _id: product.id,
        title: product.name,
        images: product.images,
        quantity: 1, 
        finalPrice: product.price,
        sellerId: product.seller.id
      },
    });
    
    toast({
      title: "Succès",
      description: "Produit ajouté au panier",
    });
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
          sellerId: product.seller.id
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

  // Add pagination handlers
  const handleNextPage = () => {
    if (pagination && typeof pagination.totalPages === 'number' && currentPage < pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
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
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* En-tête de la boutique */}
          {shop && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="relative h-48 md:h-64">
                <Image
                  src={getImageUrl([shop?.coverImage || ''])}
                  alt={shop?.name || 'Couverture de la boutique'}
                  width={1200}
                  height={400}
                  style={{ objectFit: 'cover' }}
                  className="w-full h-full"
                  priority
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white -mt-12">
                      <Image
                        src={getImageUrl([shop?.logo || ''])}
                        alt={shop?.name || 'Logo de la boutique'}
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover' }}
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{shop?.name}</h1>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={star <= (shop?.rating || 0) ? "text-yellow-400" : "text-gray-300"}
                              size={16}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({shop?.totalReviews || 0} avis)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex flex-col space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-end">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{shop?.address}</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <FaPhone className="mr-2" />
                        <span>{shop?.phone}</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <FaEnvelope className="mr-2" />
                        <span>{shop?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-gray-600">{shop?.description}</p>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Heures d'ouverture: {shop?.businessHours?.open} - {shop?.businessHours?.close}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Grille des produits */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="bg-white rounded-lg shadow-sm overflow-hidden group relative border hover:border-blue-500 transition-all duration-300"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative h-48">
                    <Image
                      src={getImageUrl(product.images)}
                      alt={product.name}
                      width={300}
                      height={300}
                      style={{ objectFit: 'contain' }}
                      className="w-full h-full p-2"
                    />
                    
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
                      >
                        <FaShoppingCart size={16} />
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
                      >
                        <FaEye size={16} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold">
                        {product.price.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Bouton Acheter */}
                <div className="px-4 pb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBuyNow(product)}
                    disabled={product.quantity === 0}
                    className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                      product.quantity === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {product.quantity === 0 ? 'Indisponible' : 'Acheter maintenant'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun produit disponible dans cette boutique pour le moment.
            </div>
          )}

          {/* Add pagination controls after products grid */}
          {pagination && typeof pagination.totalPages === 'number' && pagination.totalPages > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8 mb-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Précédent
              </button>
              <span className="text-gray-700">
                Page {currentPage} sur {pagination?.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === pagination?.totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === pagination?.totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Suivant
              </button>
            </div>
          )}

          {/* Bouton pour ouvrir la boîte de dialogue */}
          {shop && shop.seller && (
            <button 
              onClick={() => { 
                setShowChatBox(true); 
                setSelectedSellerId(shop.seller.id); 
              }} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Discuter avec le vendeur
            </button>
          )}

          {/* Afficher la boîte de dialogue si elle est ouverte */}
          {showChatBox && selectedSellerId && (
            <ChatBox sellerId={selectedSellerId} onClose={() => setShowChatBox(false)} />
          )}
        </>
      )}
    </motion.div>
  );
} 