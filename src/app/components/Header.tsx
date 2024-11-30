"use client";

import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaHeart, FaUser, FaSearch } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "../context/CartContext";
const BASE_URL = "http://localhost:5000/api";

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

const Header = () => {
  const { state, dispatch } = useCartContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Refs pour les menus déroulants
  const cartRef = useClickOutside(() => setIsCartOpen(false));
  const wishlistRef = useClickOutside(() => setIsWishlistOpen(false));
  const profileRef = useClickOutside(() => setIsProfileOpen(false));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Ajouter ici la logique de recherche ou rediriger l'utilisateur
      console.log("Recherche :", searchQuery);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Si un token existe, l'utilisateur est connecté
  }, []);


  // Calcul du sous-total du panier
  const calculateSubtotal = () => {
    return state.cart.reduce((acc, item) => acc + item.quantity * item.finalPrice, 0);
  };

  const handleLogout = async () => {
    try {
      // Appeler l'API de déconnexion
      const response = await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Inclure le token
        },
      });

      if (response.ok) {
        // Si la déconnexion est réussie, supprimer le token
        localStorage.removeItem("token");
        localStorage.setItem("isAuthenticated", "false");
        setIsAuthenticated(false);
        alert("Déconnexion réussie !");
        window.location.href = "/";
      } else {
        // Si la déconnexion échoue, afficher un message d'erreur
        const errorData = await response.json();
        alert(`Erreur de déconnexion : ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      alert("Impossible de se déconnecter. Veuillez réessayer.");
    }
  };

  return (
    <header className="bg-gradient-to-r bg-customBlue text-white py-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
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

          {/* Barre de recherche */}
          {!isMobile ? (
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
          ) : (
            <button onClick={handleSearch} className="p-1.5 hover:bg-white/10 rounded-full transition-colors duration-200">
              <FaSearch size={16} />
            </button>
          )}

          {/* Actions utilisateur */}
          <div className="flex items-center gap-2">
            {/* Panier */}
            <div ref={cartRef} className="relative">
              <button 
                onClick={() => {
                  setIsCartOpen(!isCartOpen);
                  setIsWishlistOpen(false);
                  setIsProfileOpen(false);
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
                        <Image
                          src={Array.isArray(item.images) ? item.images[0] : item.images}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-md"
                          width={64}
                          height={64}
                        />
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-bold">{item.title}</h4>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × ${item.finalPrice.toFixed(2)}
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
                  setIsProfileOpen(false);
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
                        <Image
                          src={Array.isArray(item.images) ? item.images[0] : item.images}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-md"
                          width={64}
                          height={64}
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
                  setIsProfileOpen(!isProfileOpen);
                  setIsCartOpen(false);
                  setIsWishlistOpen(false);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Profil"
              >
                <FaUser size={16} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-xl p-4 z-50 border border-gray-100">
                  {isAuthenticated ? (
                    <>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/profile" className="block hover:underline">
                            Mon Profil
                          </Link>
                        </li>
                        <li>
                          <Link href="/account" className="block hover:underline">
                            Mon Compte
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
                          onClick={ handleLogout}
                          className="w-full text-left hover:underline text-red-600"
                        >
                          Déconnexion
                   </button>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <>
                   <form className="space-y-4">
                     <div>
                       <input 
                         type="email" 
                         placeholder="Adresse mail" 
                         className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                       />
                     </div>
                    
                     <div className="relative">
                       <input 
                         type="password" 
                         placeholder="Mot de passe" 
                         className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                       />
                       <button 
                         type="button"
                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                           <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                       </button>
                     </div>

                    <div className="flex justify-end">
                       <Link
                         href="/forgot-password" 
                         className="text-sm text-blue-600 hover:underline"
                       >
                         Mot de passe oublié
                       </Link>
                     </div>

                     <button 
                       type="submit" 
                       className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                     >
                       CONNEXION →
                     </button>
                   </form>
                   <div className="mt-4 text-center">
                     <p className="text-sm text-gray-600">Pas de compte déjà ?</p>
                     <Link 
                       href="/register" 
                       className="block w-full mt-2 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
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
      </div>
    </header>
  );
};

export default Header;
