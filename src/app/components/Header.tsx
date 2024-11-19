"use client";

import { useState } from "react";
import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import Link from "next/link";

// Déclaration de l'interface pour les éléments du panier
interface CartItem {
  _id: number;
  title: string;
  images: string | string[];
  quantity: number;
  discountPrice: number;
}

const Header = ({ cart }: { cart: CartItem[] }) => {
  const [wishlist, setWishlist] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État pour la connexion

  return (
    <header className="bg-customBlue text-white py-2 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <img src="/favicon.png" alt="Dubon Services" className="w-16" />

        {/* Barre de recherche */}
        <div className="flex-1 mx-4 px-40">
          <input
            type="text"
            placeholder="Rechercher"
            className="w-full px-3 py-1.5 border border-gray-500 text-sm"
          />
        </div>

        {/* Icônes et menu */}
        <div className="flex items-center space-x-3 relative">
          {/* Icône Panier */}
          <div className="relative">
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative">
              <FaShoppingCart size={18} />
              {Array.isArray(cart) && cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            {/* Menu déroulant du panier */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-lg p-4 z-20">
                <h3 className="font-bold text-lg border-b pb-2">
                  Votre panier ({Array.isArray(cart) ? cart.length : 0})
                </h3>
                <ul className="divide-y divide-gray-200">
                  {Array.isArray(cart) &&
                    cart.map((item) => (
                      <li key={item._id} className="flex items-center py-2">
                        <img
                          src={Array.isArray(item.images) ? item.images[0] : item.images}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-bold">{item.title}</h4>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × ${item.discountPrice}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {/* Icône Wishlist */}
          <div className="relative">
            <button onClick={() => setIsWishlistOpen(!isWishlistOpen)} className="relative">
              <FaHeart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                  {wishlist.length}
                </span>
              )}
            </button>
            {/* Menu déroulant de la wishlist */}
            {isWishlistOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-lg p-4 z-20">
                <h3 className="font-bold text-lg border-b pb-2">Wishlist ({wishlist.length})</h3>
              </div>
            )}
          </div>

          {/* Icône Utilisateur */}
          <div className="relative">
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="relative">
              <FaUser size={18} />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-6 z-50">
                <h3 className="text-xl font-bold text-center mb-6 text-gray-800">Connectez-vous</h3>
                
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

              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
