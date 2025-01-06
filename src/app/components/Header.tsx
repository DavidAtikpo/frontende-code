"use client";

import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaHeart, FaUser, FaSearch } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import ProductImage from "@/components/ui/ProductImage";
import { useCartContext } from "../context/CartContext";
import { API_CONFIG } from '@/utils/config';
import { useRouter } from 'next/navigation';

// Hook personnalisé pour gérer le clic extérieur
const useClickOutside = (handler: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler]);

  return ref;
};

const { BASE_URL } = API_CONFIG;

// Fonction pour gérer les URLs des images
const getImageUrl = (imagePath: string | string[]) => {
  if (!imagePath) return "/placeholder.jpg";
  const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path}`;
};

const getProfileImageUrl = (imagePath: string | null) => {
  if (!imagePath) return "/placeholder-avatar.jpg";
  if (imagePath.startsWith("http")) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

const Header = () => {
  const { state, dispatch } = useCartContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [, setIsSearchOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    profilePhotoURL: string | null;
  }>({ name: '', email: '', profilePhotoURL: null });
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [_firstName, setFirstName] = useState("");

  // Refs pour les menus déroulants
  const cartRef = useClickOutside(() => setIsCartOpen(false));
  const wishlistRef = useClickOutside(() => setIsWishlistOpen(false));
  const profileRef = useClickOutside(() => setIsOpen(false));


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const firstName = user.name?.split(' ')[0] || '';
        
        // Construire l'URL de la photo de profil de manière sécurisée
        let photoURL = null;
        if (user.profilePhotoUrl) {
          // Si l'URL commence déjà par http, on la garde telle quelle
          if (user.profilePhotoUrl.startsWith('http')) {
            photoURL = user.profilePhotoUrl;
          } else {
            // Sinon, on ajoute le BASE_URL
            photoURL = `${API_CONFIG.BASE_URL}${user.profilePhotoUrl}`;
          }
        }

        console.log('Photo URL:', photoURL); // Pour le débogage
        console.log('User Data:', user); // Pour le débogage

        setUserInfo({
          name: user.name || '',
          email: user.email || '',
          profilePhotoURL: photoURL
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur parsing userData:', error);
      }
    }
    setIsAuthenticated(!!token);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Recherche :", searchQuery);
      if (isMobile) {
        setIsSearchOpen(false);
      }
    }
  };

  const calculateSubtotal = () => {
    return state.cart.reduce((acc, item) => acc + item.quantity * item.finalPrice, 0);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserInfo({ name: '', email: '', profilePhotoURL: null });
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        alert(`Erreur de déconnexion : ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      alert("Impossible de se déconnecter. Veuillez réessayer.");
    }
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false); // Ferme le dropdown
    router.push(path);
  };

  return (
    <header className="bg-gradient-to-r bg-customBlue text-white py-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Première ligne : Logo et Actions */}
        <div className="flex items-center justify-between gap-4 mb-2">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logod.png"
              alt="Dubon Services"
              width={150}
              height={150}
              className="w-16 h-auto transform hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Barre de recherche desktop */}
          {!isMobile && (
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit, une catégorie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 pr-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/40 transition-all duration-200 text-sm"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
                >
                  <FaSearch size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Actions utilisateur */}
          <div className="flex items-center gap-2">
            {/* Panier */}
            <div ref={cartRef} className="relative">
              <button 
                onClick={() => {
                  setIsCartOpen(!isCartOpen);
                  setIsWishlistOpen(false);
                  setIsOpen(false);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors duration-200 relative focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Panier"
              >
                <FaShoppingCart size={16} />
                {state.cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {state.cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-xl p-4 z-50 border border-gray-100">
                  <h3 className="font-bold text-lg border-b pb-2">
                    Votre panier ({state.cart.length})
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {state.cart.map((item) => (
                      <li key={item._id} className="flex items-center py-2">
                        <ProductImage
                          images={item.images}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-bold">{item.title}</h4>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × {(typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(String(item.finalPrice)) || 0).toFixed(2)} CFA
                          </p>
                        </div>
                        <button
                          className="text-red-600 hover:underline text-sm"
                          onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item._id })}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span>Sous-total</span>
                      <span>{calculateSubtotal()} CFA</span>
                    </div>
                    <div className="mt-3">
                      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        PAYER MAINTENANT →
                      </button>
                    </div>
                    <div className="mt-2 text-center">
                      <Link href="/cart" className="text-blue-600 hover:underline text-sm">
                        VOIR LE PANIER
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <div ref={wishlistRef} className="relative">
              <button 
                onClick={() => {
                  setIsWishlistOpen(!isWishlistOpen);
                  setIsCartOpen(false);
                  setIsOpen(false);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors duration-200 relative focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Liste de souhaits"
              >
                <FaHeart size={16} />
                {state.wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {state.wishlist.length}
                  </span>
                )}
              </button>
              {isWishlistOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-xl p-4 z-50 border border-gray-100">
                  <h3 className="font-bold text-lg border-b pb-2">
                    Wishlist ({state.wishlist.length})
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {state.wishlist.map((item) => (
                      <li key={item._id} className="flex items-center py-2">
                        <ProductImage
                          images={item.images}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-bold">{item.title}</h4>
                          <button
                            className="text-red-600 hover:underline text-sm"
                            onClick={() => dispatch({ type: "REMOVE_FROM_WISHLIST", payload: item._id })}
                          >
                            ×
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-center">
                    <Link href="/wishlist" className="text-blue-600 hover:underline text-sm">
                      VOIR LA WISHLIST
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profil */}
            <div ref={profileRef} className="relative">
              <button 
                onClick={() => {
                  setIsOpen(!isOpen);
                  setIsCartOpen(false);
                  setIsWishlistOpen(false);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Profil"
              >
                {userInfo.profilePhotoURL ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src={getProfileImageUrl(userInfo.profilePhotoURL)}
                      alt="Photo de profil"
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full object-cover"
                      priority={true}
                    />
                    <span className="text-sm">{userInfo.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                      {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm">{userInfo.name || 'Utilisateur'}</span>
                  </div>
                )}
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-xl p-4 z-50 border border-gray-100">
                  {isAuthenticated ? (
                    <>
                      {/* En-tête du profil */}
                      <div className="flex items-center space-x-3 mb-4 pb-4 border-b">
                        {userInfo.profilePhotoURL ? (
                          <Image
                            src={getProfileImageUrl(userInfo.profilePhotoURL)}
                            alt="Photo de profil"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                            priority={true}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaUser className="text-gray-500" size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{userInfo.name}</p>
                          <p className="text-sm text-gray-500">{userInfo.email}</p>
                        </div>
                      </div>

                      {/* Menu du profil */}
                      <ul className="space-y-2">
                        <li>
                          <Link href="/user/profile" className="block hover:underline">
                            Mon Profil
                          </Link>
                        </li>
                        <li>
                          <Link href="/user/dashboard" className="block hover:underline">
                            Tableau de bord
                          </Link>
                        </li>
                        <li>
                          <Link href="/seller/onboarding" className="block hover:underline">
                            Devenir Vendeur
                          </Link>
                        </li>
                        <li>
                          <Link href="/help" className="block hover:underline">
                            Centre d&apos;Aide
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left hover:underline text-red-600"
                          >
                            Déconnexion
                          </button>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login"
                        className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-center"
                        onClick={() => handleNavigate('/login')}
                      >
                        CONNEXION →
                      </Link>
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Pas de compte ?</p>
                        <Link 
                          href="/register" 
                          className="block w-full mt-2 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                          onClick={() => handleNavigate('/register')}
                        >
                          CRÉER VOTRE COMPTE
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barre de recherche mobile */}
        {isMobile && (
          <div className="w-full mt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 pr-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/40 transition-all duration-200 text-sm"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
              >
                <FaSearch size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
