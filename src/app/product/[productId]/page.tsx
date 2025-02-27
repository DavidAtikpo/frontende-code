"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaHeart, FaShareAlt, FaStar, FaShoppingCart, FaCreditCard, FaHome, FaChevronRight, FaShieldAlt, FaTruck, FaUndo, FaClock, FaCheckCircle, FaLock } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { API_CONFIG } from '@/utils/config';
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { getCookie } from "cookies-next";
import { useCartContext } from "@/app/context/CartContext";

const { BASE_URL } = API_CONFIG;

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string | string[]) => {
  if (!imagePath) return DEFAULT_IMAGE;
  
  try {
    // Si c'est un tableau, prendre la première image
    const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
    if (!path) return DEFAULT_IMAGE;
  
    // Retourner l'URL Cloudinary directement
    return path;
  } catch (error) {
    console.error('Erreur dans getImageUrl:', error);
    return DEFAULT_IMAGE;
  }
};

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  quantity: number;
  status: string;
  category: {
    id: string;
    name: string;
  };
  images: string[];
  nutritionalInfo?: {
    servingSize: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    fiber: number;
    sodium: number;
    allergens: string[];
  };
  shippingInfo?: Array<{
    type: string;
    details: string;
  }>;
  temperature?: {
    min: number;
    max: number;
    unit: string;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  weight?: number;
  brand?: string;
  tags?: string[];
  featured?: boolean;
  lowStockThreshold?: number;
  packaging?: {
    type: string;
    quantity: number;
    unit: string;
  };
  certifications?: string[];
  origin?: string;
  preparationTime?: string;
  cookingInstructions?: string;
  ingredients?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  shop: {
    id: string;
    name: string;
    description?: string;
  };
  seller: {
    id: string;
    businessInfo: {
      companyName: string;
      address: string;
      phone: string;
    };
  };
}

type TabType = 'description' | 'specification' | 'informations' | 'avis';
type InnerTabType = 'description' | 'details' | 'nutritional';

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params?.productId;
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [activeInnerTab, setActiveInnerTab] = useState<InnerTabType>('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { dispatch } = useCartContext();

  // Gérer les produits consultés récemment
  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updatedViewed = [product, ...viewed.filter((p: Product) => p.id !== product.id)].slice(0, 4);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
      setRecentlyViewed(updatedViewed);
    }
  }, [product]);

  const handleAddToCart = (product: Product) => {
    const finalPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    dispatch({
      type: "ADD_TO_CART",
      payload: { 
        _id: product.id,
        title: product.name,
        images: product.images,
        quantity: 1, 
        finalPrice,
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
        
        window.location.href = '/login';
        return;
      }

      dispatch({
        type: "ADD_TO_CART",
        payload: { 
          _id: product.id,
          title: product.name,
          images: product.images,
          quantity: 1, 
          finalPrice: product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price,
          sellerId: product.seller.id
        },
      });

      window.location.href = '/checkout/shipping-address';
    } catch (error) {
      console.error('Erreur dans handleBuyNow:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        console.error('ID du produit non défini');
        router.push('/products');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/products/product-detail/${productId}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        
        const data = await response.json();
        if (data.success) {
          console.log("Données reçues:", data);
          const formattedProduct: Product = {
            id: data.data.id,
            name: data.data.name,
            slug: data.data.slug,
            sku: data.data.sku,
            description: data.data.description,
            price: data.data.price,
            compareAtPrice: data.data.compareAtPrice,
            discount: data.data.discount,
            quantity: data.data.quantity,
            status: data.data.status,
            category: {
              id: data.data.category?.id,
              name: data.data.category?.name || 'Non catégorisé'
            },
            images: Array.isArray(data.data.images) ? data.data.images : [data.data.images],
            nutritionalInfo: data.data.nutritionalInfo,
            temperature: data.data.temperature,
            dimensions: data.data.dimensions,
            weight: data.data.weight,
            brand: data.data.brand,
            tags: data.data.tags,
            featured: data.data.featured,
            lowStockThreshold: data.data.lowStockThreshold,
            packaging: data.data.packaging,
            certifications: data.data.certifications,
            origin: data.data.origin,
            preparationTime: data.data.preparationTime,
            cookingInstructions: data.data.cookingInstructions,
            ingredients: data.data.ingredients,
            seoTitle: data.data.seoTitle,
            seoDescription: data.data.seoDescription,
            seoKeywords: data.data.seoKeywords,
            shop: {
              id: data.data.shop?.id,
              name: data.data.shop?.name,
              description: data.data.shop?.description
            },
            seller: {
              id: data.data.seller?.id,
              businessInfo: {
                companyName: data.data.seller?.businessInfo?.companyName,
                address: data.data.seller?.businessInfo?.address,
                phone: data.data.seller?.businessInfo?.phone
              }
            }
          };
          setProduct(formattedProduct);
        } else {
          throw new Error(data.message || "Erreur lors du chargement du produit");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du produit",
          variant: "destructive"
        });
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router, toast]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Accueil</Link>
        <span>/</span>
        <span className="text-blue-600">{product?.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="relative aspect-square">
              <img
                src={getImageUrl(product?.images?.[selectedImage] || '')}
                alt={product?.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_IMAGE;
                }}
              />
              {product?.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                  -{product.discount}%
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product?.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border rounded-lg p-1 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
              >
                <img
                  src={getImageUrl(img)}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full aspect-square object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_IMAGE;
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Information Sections */}
        <div className="space-y-6">
          {/* En-tête du produit */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{product?.name}</h1>
              <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                <FaHeart size={24} />
              </button>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={star <= 4 ? "text-yellow-400" : "text-gray-300"}
                    size={16}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">(4 avis vérifiés)</span>
            </div>
          </div>

            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p>SKU: <span className="font-medium">{product.sku}</span></p>
              <p>Vendeur: <span className="font-medium">{product.seller?.businessInfo?.companyName}</span></p>
              <p>Catégorie: <Link href={`/category/${product.category?.id}`} className="text-blue-600 hover:underline cursor-pointer">{product.category?.name}</Link></p>
            </div>

            <div className="flex items-baseline space-x-3 mb-4">
              <span className="text-3xl font-bold text-blue-600">
                {product?.price?.toLocaleString()} FCFA
              </span>
              {product?.compareAtPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {product.compareAtPrice.toLocaleString()} FCFA
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className={product.quantity > 0 ? 'text-blue-600' : 'text-red-600'}>
                  {product.quantity > 0 ? `${product.quantity} en stock` : 'Rupture de stock'}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${product.quantity > 0 ? 'bg-blue-600' : 'bg-red-600'} transition-all duration-500`}
                  style={{ width: `${Math.min(100, (product.quantity / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => handleBuyNow(product)}
                disabled={product.quantity === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <img src="/images/fedapay.png" alt="FedaPay" className="h-5" />
                Payer avec FedaPay
              </button>
              
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.quantity === 0}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
              >
                Ajouter au panier
              </button>
            </div>
          </div>

          {/* Informations de livraison */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Livraison Express</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Livraison Standard</p>
                  <p className="text-sm text-gray-600">Livraison en 24-48h</p>
                </div>
                <span className="text-blue-600 font-medium">Gratuit</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Suivi en temps réel</p>
                  <p className="text-sm text-gray-600">Suivez votre commande à tout moment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Garanties et Retours */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Garanties et Retours</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Garantie satisfaction</p>
                  <p className="text-sm text-gray-600">Retour gratuit sous 7 jours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Produits authentiques</p>
                  <p className="text-sm text-gray-600">Tous nos produits sont vérifiés</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Client */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Besoin d'aide ?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Service client disponible</p>
                  <p className="text-sm text-gray-600">Notre équipe est là pour vous aider 24/7</p>
                  <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Contactez-nous →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <div className="border-b overflow-x-auto">
          <div className="flex space-x-8">
            {['description', 'informations', 'specification', 'avis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TabType)}
                className={`pb-4 text-sm font-medium transition-colors whitespace-nowrap ${
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
              <p>{product.description}</p>
            </div>
          )}
          
          {activeTab === 'specification' && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex space-x-4 border-b">
                <button
                  onClick={() => setActiveInnerTab("description")}
                  className={`pb-4 ${activeInnerTab === "description" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveInnerTab("details")}
                  className={`pb-4 ${activeInnerTab === "details" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                >
                  Détails
                </button>
                {product.nutritionalInfo && (
                  <button
                    onClick={() => setActiveInnerTab("nutritional")}
                    className={`pb-4 ${activeInnerTab === "nutritional" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                  >
                    Informations nutritionnelles
                  </button>
                )}
              </div>

              <div className="py-6">
                {activeInnerTab === "description" && (
                  <div className="prose max-w-none">
                    <p>{product.description}</p>
                  </div>
                )}

                {activeInnerTab === "details" && product.dimensions && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Dimensions</h3>
                      <p>{product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}</p>
                    </div>
                    {product.temperature && (
                      <div>
                        <h3 className="font-medium">Température de conservation</h3>
                        <p>{product.temperature.min}°{product.temperature.unit} à {product.temperature.max}°{product.temperature.unit}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeInnerTab === "nutritional" && product.nutritionalInfo && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Valeurs nutritionnelles</h3>
                      <p>Portion: {product.nutritionalInfo.servingSize}</p>
                      <p>Calories: {product.nutritionalInfo.calories} kcal</p>
                      <p>Protéines: {product.nutritionalInfo.proteins}g</p>
                      <p>Glucides: {product.nutritionalInfo.carbohydrates}g</p>
                      <p>Lipides: {product.nutritionalInfo.fats}g</p>
                    </div>
                    {product.nutritionalInfo.allergens && (
                      <div>
                        <h3 className="font-medium">Allergènes</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.nutritionalInfo.allergens.map((allergen, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 1 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Produits consultés récemment</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyViewed.filter(p => p.id !== product?.id).map((viewedProduct) => (
              <motion.div
                key={viewedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden group relative border hover:border-blue-500 transition-colors"
              >
                <div 
                  onClick={() => router.push(`/product/${viewedProduct.id}`)}
                  className="relative h-32 cursor-pointer"
                >
                  <img
                    src={getImageUrl(viewedProduct.images)}
                    alt={viewedProduct.name}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_IMAGE;
                    }}
                  />
                  
                  {viewedProduct.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                      -{viewedProduct.discount}%
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(viewedProduct);
                      }}
                      className="p-1.5 bg-white rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      <FaShoppingCart size={12} />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 truncate">
                    {viewedProduct.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-600">
                      {viewedProduct.price.toLocaleString()} FCFA
                    </span>
                    <div className="flex items-center text-yellow-400 text-xs">
                      <FaStar />
                      <span className="ml-1 text-gray-600">4.5</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
