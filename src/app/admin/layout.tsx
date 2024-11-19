"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Heart,
  Repeat2,
  MapPin,
  Clock,
  Settings,
  LogOut,
  User,
} from "lucide-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Clock, label: "Historique Payment", href: "/admin/payments" },
    { icon: MapPin, label: "Livraison", href: "/admin/delivery" },
    { icon: ShoppingCart, label: "Shopping Cart", href: "/admin/cart" },
    { icon: Heart, label: "Liste de souhaits", href: "/admin/wishlist" },
    { icon: Repeat2, label: "Comparaison", href: "/admin/compare" },
    { icon: MapPin, label: "Carte et Adresse", href: "/admin/address" },
    { icon: Clock, label: "Historique", href: "/admin/history" },
    { icon: Settings, label: "Paramètres", href: "/admin/settings" },
    { icon: LogOut, label: "Déconnexion", href: "/admin/logout" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4">
          <img src="/logo.png" alt="Logo" className="h-8" />
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                pathname === item.href ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Admin</span>
              <User className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 