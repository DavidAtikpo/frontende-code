"use client";

import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaHeart, FaUser, FaSearch } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import ProductImage from "./ProductImage";
import { useCartContext } from "../context/CartContext";
import { API_CONFIG } from '@/utils/config';
import { useRouter } from 'next/navigation';
import { deleteCookie } from "cookies-next";

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

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTAwIDEwMEM4OC45NTQzIDEwMCA4MCAxMDguOTU0IDgwIDEyMEM4MCAxMzEuMDQ2IDg4Ljk1NDMgMTQwIDEwMCAxNDBDMTExLjA0NiAxNDAgMTIwIDEzMS4wNDYgMTIwIDEyMEMxMjAgMTA4Ljk1NCAxMTEuMDQ2IDEwMCAxMDAgMTAwWk04NSAxMjBDODUgMTExLjcxNiA5MS43MTU3IDEwNSAxMDAgMTA1QzEwOC4yODQgMTA1IDExNSAxMTEuNzE2IDExNSAxMjBDMTE1IDEyOC4yODQgMTA4LjI4NCAxMzUgMTAwIDEzNUM5MS43MTU3IDEzNSA4NSAxMjguMjg0IDg1IDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

// Fonction pour gérer les URLs des images


const getProfileImageUrl = (imagePath: string | null) => {
  if (!imagePath) return DEFAULT_IMAGE;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
}

interface SearchResult {
  _id: string;
  title: string;
  type: 'product' | 'event' | 'training' | 'service' | 'restaurant';
}

// Ajout de la fonction debounce
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
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
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useClickOutside(() => setShowResults(false));
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms delay

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
        
        // Construire l'URL de la photo de profil


        setUserInfo({
          name: user.name || '',
          email: user.email || '',
          profilePhotoURL: user.profilePhotoURL
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

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch(`${API_CONFIG.BASE_URL}/user/logout`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     if (response.ok) {
  //       localStorage.removeItem("token");
  //       setIsAuthenticated(false);
  //       setUserInfo({ name: '', email: '', profilePhotoURL: null });
  //       window.location.href = "/";
  //     } else {
  //       const errorData = await response.json();
  //       alert(`Erreur de déconnexion : ${errorData.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors de la déconnexion :", error);
  //     alert("Impossible de se déconnecter. Veuillez réessayer.");
  //   }
  // };

  const handleLogout = () => {
    deleteCookie('token');
    localStorage.removeItem('token')
    localStorage.removeItem("userData")
    window.location.href = "/login";
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false); // Ferme le dropdown
    router.push(path);
  };

  // Fonction de recherche
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Effet pour gérer la recherche avec debounce
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchQuery.length > 0) {
        try {
          const response = await fetch(`${BASE_URL}/api/search?query=${encodeURIComponent(debouncedSearchQuery)}`);
          if (response.ok) {
            const results = await response.json();
            setSearchResults(results || []);
            setShowResults(true);
          }
        } catch (error) {
          console.error('Erreur de recherche:', error);
        }
      } else {
        setShowResults(false);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery]);

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setSearchQuery('');
    switch (result.type) {
      case 'product':
        router.push(`/product/${result._id}`);
        break;
      case 'event':
        router.push(`/event/${result._id}`);
        break;
      case 'training':
        router.push(`/training/${result._id}`);
        break;
      case 'service':
        router.push(`/service/${result._id}`);
        break;
      case 'restaurant':
        router.push(`/restaurant/${result._id}`);
        break;
    }
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
            <div className="flex-1 max-w-2xl" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit, une catégorie..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="w-full px-3 py-1.5 pr-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/40 transition-all duration-200 text-sm"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
                >
                  <FaSearch size={16} />
                </button>

                {/* Résultats de recherche */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-100 max-h-[300px] overflow-y-auto">
                    <ul className="py-1">
                      {searchResults.map((result) => (
                        <li
                          key={result._id}
                          onClick={() => handleResultClick(result)}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm flex items-center justify-between"
                        >
                          <span>{result.title}</span>
                          <span className="text-xs text-gray-500 capitalize">{result.type}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions utilisateur */}
          <div className="flex items-center gap-2">
            {/* Panier */}
            <div ref={cartRef} className="relative inline-block">
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
                <div className="absolute right--4 mt-2 w-52 bg-white text-gray-800 rounded-lg shadow-xl z-50 translate-x-0">
                  <div className="p-3 border-b">
                    <h3 className="font-medium text-sm">
                      Panier ({state.cart.length})
                    </h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    <ul className="divide-y divide-gray-100">
                      {state.cart.map((item) => (
                        <li key={item._id} className="flex items-center p-2">
                          <ProductImage
                            images={item.images}
                            alt={item.title}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="ml-2 flex-1 min-w-0">
                            <h4 className="text-xs font-medium truncate">{item.title}</h4>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × {(typeof item.finalPrice === 'number' ? item.finalPrice : parseFloat(String(item.finalPrice)) || 0).toFixed(2)} CFA
                            </p>
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700 text-sm ml-1 px-1"
                            onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item._id })}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 border-t bg-gray-50">
                    <div className="flex justify-between text-xs font-medium mb-2">
                      <span>Total</span>
                      <span>{calculateSubtotal()} CFA</span>
                    </div>
                    <Link 
                      href="/checkout/payment-method" 
                      onClick={() => setIsCartOpen(false)}
                      className="block w-full bg-blue-600 text-white text-xs py-2 rounded hover:bg-blue-700 text-center mb-1"
                    >
                      Payer maintenant
                    </Link>
                    <Link 
                      href="/cart" 
                      onClick={() => setIsCartOpen(false)}
                      className="text-blue-600 hover:underline text-xs block text-center"
                    >
                      Voir le panier
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <div ref={wishlistRef} className="relative inline-block">
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
                <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-lg shadow-xl z-50 translate-x-0">
                  <div className="p-3 border-b">
                    <h3 className="font-medium text-sm">
                      Wishlist ({state.wishlist.length})
                    </h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    <ul className="divide-y divide-gray-100">
                      {state.wishlist.map((item) => (
                        <li key={item._id} className="flex items-center p-2">
                          <ProductImage
                            images={item.images}
                            alt={item.title}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="ml-2 flex-1 min-w-0">
                            <h4 className="text-xs font-medium truncate">{item.title}</h4>
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700 text-sm ml-1 px-1"
                            onClick={() => dispatch({ type: "REMOVE_FROM_WISHLIST", payload: item._id })}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 border-t bg-gray-50">
                    <Link 
                      href="/wishlist" 
                      onClick={() => setIsWishlistOpen(false)}
                      className="text-blue-600 hover:underline text-xs block text-center"
                    >
                      Voir la wishlist
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
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <iframe
                        src={userInfo.profilePhotoURL}
                        className="w-full h-full"
                        style={{ border: 'none' }}
                      />
                    </div>
                    <span className="text-sm">{userInfo.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                      {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm">{userInfo.name || 'Connexion'}</span>
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
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <iframe
                              src={userInfo.profilePhotoURL}
                              className="w-full h-full"
                              style={{ border: 'none' }}
                            />
                          </div>
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
          <div className="w-full mt-2" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={handleSearchInput}
                className="w-full px-3 py-1.5 pr-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/40 transition-all duration-200 text-sm"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
              >
                <FaSearch size={16} />
              </button>

              {/* Résultats de recherche mobile */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-100 max-h-[300px] overflow-y-auto">
                  <ul className="py-1">
                    {searchResults.map((result) => (
                      <li
                        key={result._id}
                        onClick={() => handleResultClick(result)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm flex items-center justify-between"
                      >
                        <span>{result.title}</span>
                        <span className="text-xs text-gray-500 capitalize">{result.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

