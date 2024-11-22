"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  List,
  Users,
  MessageSquare,
  Calendar,
  ShoppingCart,
  GraduationCap,
  Settings,
  LogOut
} from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      href: "/admin/dashboard" 
    },
    { 
      icon: Package, 
      label: "Ajouter produits", 
      href: "/admin/add-product" 
    },
    { 
      icon: List, 
      label: "Liste produits", 
      href: "/admin/products" 
    },
    { 
      icon: Users, 
      label: "Utilisateurs", 
      href: "/admin/users" 
    },
    {
      icon: Users,
      label: "Demandes vendeurs",
      href: "/admin/seller-requests",
      badge: true // Pour afficher le nombre de demandes en attente
    },
    { 
      icon: MessageSquare, 
      label: "Messages", 
      href: "/admin/messages" 
    },
    { 
      icon: Calendar, 
      label: "Evènements", 
      href: "/admin/events" 
    },
    { 
      icon: ShoppingCart, 
      label: "Commandes", 
      href: "/admin/orders" 
    },
    { 
      icon: GraduationCap, 
      label: "Formations", 
      href: "/admin/trainings" 
    },
    { 
      icon: Settings, 
      label: "Paramètres", 
      href: "/admin/settings" 
    },
    { 
      icon: LogOut, 
      label: "Déconnexion", 
      href: "/logout" 
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 border-b">
          <img src="/logo.png" alt="Logo" className="h-8" />
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                pathname === item.href ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' : ''
              }`}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Admin</span>
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </header>
        <div className="p-6">
          <LogoutButton />
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 